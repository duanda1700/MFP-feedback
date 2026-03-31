import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ManufacturePlanFeedbackMain } from '../database/entities/manufacture-plan-feedback-main.entity';
import { ManufacturePlanFeedbackVersion } from '../database/entities/manufacture-plan-feedback-version.entity';
import { ProductionPlan } from '../database/entities/production-plan.entity';
import { PurchaseOrder } from '../database/entities/purchase-order.entity';
import { TodoTaskService } from '../todo/todo-task.service';
import { TodoTaskType, TodoTaskPriority } from '../database/entities/todo-task.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(ManufacturePlanFeedbackMain)
    private feedbackMainRepository: Repository<ManufacturePlanFeedbackMain>,
    @InjectRepository(ManufacturePlanFeedbackVersion)
    private feedbackVersionRepository: Repository<ManufacturePlanFeedbackVersion>,
    @InjectRepository(ProductionPlan)
    private productionPlanRepository: Repository<ProductionPlan>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    private dataSource: DataSource,
    @Inject(forwardRef(() => TodoTaskService))
    private todoTaskService: TodoTaskService,
  ) {}

  async getFeedbackList(query: any) {
    const {
      page = 1,
      pageSize = 10,
      djbH,
      materialCode,
      feedbackStatus,
      feedbackCycle,
      supplierCode,
    } = query;

    const queryBuilder = this.feedbackMainRepository
      .createQueryBuilder('main')
      .leftJoinAndSelect('main.versions', 'version', 'version.version = main.latestVersion');

    if (djbH) {
      queryBuilder.andWhere('main.djbH LIKE :djbH', { djbH: `%${djbH}%` });
    }
    if (materialCode) {
      queryBuilder.andWhere('main.material_code LIKE :materialCode', {
        materialCode: `%${materialCode}%`,
      });
    }
    if (feedbackStatus) {
      queryBuilder.andWhere('main.feedback_status = :feedbackStatus', { feedbackStatus });
    }
    if (feedbackCycle) {
      queryBuilder.andWhere('main.feedback_cycle = :feedbackCycle', { feedbackCycle });
    }
    if (supplierCode) {
      queryBuilder.andWhere('main.supplier_code = :supplierCode', { supplierCode });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('main.createTime', 'DESC')
      .getManyAndCount();

    // 检查并更新过期的状态
    await this.updateExpiredStatus();

    return { data, total, page, pageSize };
  }

  async updateExpiredStatus() {
    const now = new Date();
    
    // 查找所有未完成且已过期的反馈记录
    const expiredRecords = await this.feedbackMainRepository
      .createQueryBuilder('main')
      .where('main.progress_status NOT IN (:...statuses)', { statuses: ['已完成', '已取消'] })
      .andWhere('main.planned_date < :now', { now })
      .getMany();

    for (const record of expiredRecords) {
      if (record.progressStatus !== '已延期') {
        record.progressStatus = '已延期';
        await this.feedbackMainRepository.save(record);
        console.log(`Updated expired record ${record.id} to 已延期`);
      }
    }
  }

  async getFeedbackDetail(mainId: string) {
    const main = await this.feedbackMainRepository.findOne({
      where: { id: mainId },
      relations: ['versions'],
    });

    if (!main) {
      throw new Error('反馈主记录不存在');
    }

    main.versions.sort((a, b) => b.version - a.version);

    return main;
  }

  async submitFeedback(feedbackData: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { purchaseDetailsId, feedbackCycle, feedbackItems, creator } = feedbackData;

      // 收集所有涉及的订单编号
      const djbHSet = new Set<string>();

      // 第一步：收集所有需要处理的purchaseDetailsId，并预先确定version
      const mainRecordMap = new Map<string, { 
        mainRecord: any; 
        newVersion: number;
        finishedQuantity: number;
        planQuantity: number;
        plannedDate: Date;
        progressStatus: string;
      }>();
      
      for (const item of feedbackItems) {
        const productionPlan = await this.productionPlanRepository.findOne({
          where: { id: item.productionPlanId },
        });

        if (!productionPlan) {
          continue;
        }

        // 收集订单编号
        if (productionPlan.djbH) {
          djbHSet.add(productionPlan.djbH);
        }

        const purchaseDetailsIdStr = productionPlan.purchaseDetailsId.toString();
        const materialCode = productionPlan.materialCode;
        const planClass = productionPlan.planClass;
        const productionPlanId = item.productionPlanId;
        
        // 使用productionPlanId作为唯一键
        const uniqueKey = productionPlanId;
        
        // 如果已经处理过这个唯一键，跳过
        if (mainRecordMap.has(uniqueKey)) {
          continue;
        }

        // 查找或创建mainRecord
        let mainRecord = await queryRunner.manager.findOne(
          ManufacturePlanFeedbackMain,
          {
            where: {
              productionPlanId: productionPlanId,
              feedbackCycle,
            },
          },
        );

        if (!mainRecord) {
          mainRecord = queryRunner.manager.create(ManufacturePlanFeedbackMain, {
            id: this.generateId(),
            purchaseDetailsId: purchaseDetailsIdStr,
            productionPlanId: productionPlanId,
            setCount: productionPlan.setCount,
            drawingNo: productionPlan.drawingNo,
            sfzz: productionPlan.sfzz,
            progressStatus: '未开始',
            djbH: productionPlan.djbH,
            planName: productionPlan.planName,
            planType: productionPlan.planType,
            materialCode: materialCode,
            materialDesc: productionPlan.materialDesc,
            planQuantity: productionPlan.quantity,
            unit: productionPlan.unit,
            plannedDate: productionPlan.plannedDate,
            isKeyMaterial: productionPlan.isKeyMaterial,
            productionLine: productionPlan.productionLine,
            planClass: planClass,
            supplierCode: item.supplierCode || 'SUPPLIER001',
            feedbackCycleType: '周度',
            feedbackCycle,
            latestVersion: 1,
            feedbackStatus: '正常',
            creator,
          });
          await queryRunner.manager.save(mainRecord);
        }

        // 预先确定newVersion
        const newVersion = mainRecord.latestVersion + 1;
        mainRecordMap.set(uniqueKey, { 
          mainRecord, 
          newVersion,
          finishedQuantity: item.finishedQuantity || 0,
          planQuantity: productionPlan.quantity,
          plannedDate: productionPlan.plannedDate,
          progressStatus: item.progressStatus || ''
        });
      }

      // 第二步：创建version记录
      for (const item of feedbackItems) {
        const productionPlan = await this.productionPlanRepository.findOne({
          where: { id: item.productionPlanId },
        });

        if (!productionPlan) {
          continue;
        }

        const productionPlanId = item.productionPlanId;
        const uniqueKey = productionPlanId;
        
        const recordData = mainRecordMap.get(uniqueKey);
        
        if (!recordData) {
          continue;
        }
        
        const { mainRecord, newVersion } = recordData;

        const finishedQty = item.finishedQuantity || 0;
        const planQty = productionPlan.quantity || 0;
        const now = new Date();
        const planned = productionPlan.plannedDate ? new Date(productionPlan.plannedDate) : null;
        
        let versionProgressStatus = item.progressStatus || '未开始';
        
        if (item.progressStatus && item.progressStatus !== '已完成' && item.progressStatus !== '已取消') {
          if (planned && now > planned) {
            versionProgressStatus = '已延期';
          }
        } else if (!item.progressStatus) {
          if (finishedQty > 0) {
            if (finishedQty >= planQty) {
              versionProgressStatus = '已完成';
            } else if (planned && now > planned) {
              versionProgressStatus = '已延期';
            } else {
              versionProgressStatus = '进行中';
            }
          } else if (planned && now > planned) {
            versionProgressStatus = '已延期';
          }
        }

        const versionRecord = queryRunner.manager.create(
          ManufacturePlanFeedbackVersion,
          {
            id: this.generateId(),
            mainId: mainRecord.id,
            purchaseDetailsId: productionPlan.purchaseDetailsId?.toString(),
            setCount: productionPlan.setCount,
            drawingNo: productionPlan.drawingNo,
            sfzz: productionPlan.sfzz,
            progressStatus: versionProgressStatus,
            materialCode: productionPlan.materialCode,
            version: newVersion,
            feedbackTime: new Date(),
            finishedQuantity: finishedQty,
            planQuantity: productionPlan.quantity,
            defectQuantity: item.defectQuantity || 0,
            actualDeliveryDate: item.actualDeliveryDate,
            adjustedPlannedDate: item.adjustedPlannedDate,
            remarks: item.remarks,
            creator,
          },
        );
        await queryRunner.manager.save(versionRecord);
      }

      // 第三步：更新所有mainRecord的latestVersion和progressStatus
      for (const [productionPlanId, { mainRecord, newVersion, finishedQuantity, planQuantity, plannedDate, progressStatus }] of mainRecordMap) {
        mainRecord.latestVersion = newVersion;
        mainRecord.updateTime = new Date();
        
        const now = new Date();
        const planned = plannedDate ? new Date(plannedDate) : null;
        
        if (progressStatus) {
          if (progressStatus !== '已完成' && progressStatus !== '已取消' && planned && now > planned) {
            mainRecord.progressStatus = '已延期';
          } else {
            mainRecord.progressStatus = progressStatus;
          }
        } else {
          const finishedQty = finishedQuantity || 0;
          const planQty = planQuantity || 0;
          
          if (finishedQty === 0) {
            if (planned && now > planned) {
              mainRecord.progressStatus = '已延期';
            } else {
              mainRecord.progressStatus = '未开始';
            }
          } else if (finishedQty >= planQty) {
            mainRecord.progressStatus = '已完成';
          } else if (planned && now > planned) {
            mainRecord.progressStatus = '已延期';
          } else {
            mainRecord.progressStatus = '进行中';
          }
        }
        
        await queryRunner.manager.save(mainRecord);
      }

      // 第四步：更新订单的反馈状态和订单状态
      for (const djbH of djbHSet) {
        // 查询该订单下所有反馈明细的进展状态
        const feedbackMains = await queryRunner.manager.find(
          ManufacturePlanFeedbackMain,
          {
            where: { djbH },
          },
        );

        if (feedbackMains.length === 0) continue;

        const allStatuses = feedbackMains.map((m) => m.progressStatus);
        
        // 判断订单状态
        let orderFeedbackStatus = '进行中';
        if (allStatuses.every((s) => s === '已完成')) {
          orderFeedbackStatus = '已完成';
        } else if (allStatuses.some((s) => s === '已延期')) {
          orderFeedbackStatus = '已延期';
        }

        // 查询订单当前状态
        const order = await queryRunner.manager.findOne(PurchaseOrder, {
          where: { djbH },
        });

        if (order) {
          // 根据反馈状态确定订单状态
          let newOrderStatus = order.orderStatus;
          
          if (orderFeedbackStatus === '已完成') {
            newOrderStatus = '已完成';
          } else if (orderFeedbackStatus === '已延期') {
            newOrderStatus = '已延期';
          } else if (order.orderStatus === '已确认') {
            newOrderStatus = '进行中';
          }
          
          await queryRunner.manager.update(
            PurchaseOrder,
            { djbH },
            { 
              feedbackStatus: orderFeedbackStatus,
              orderStatus: newOrderStatus
            },
          );
          console.log(`Updated order ${djbH}: orderStatus=${newOrderStatus}, feedbackStatus=${orderFeedbackStatus}`);
        }
      }

      await queryRunner.commitTransaction();
      return { success: true, message: '反馈提交成功' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getFeedbackStatistics(_query: any) {
    const orderRepo = this.dataSource.getRepository('PurchaseOrder');
    
    const total = await orderRepo
      .createQueryBuilder('order')
      .where('order.orderStatus IN (:...statuses)', { statuses: ['已确认', '进行中', '已延期'] })
      .getCount();

    const completed = await orderRepo
      .createQueryBuilder('order')
      .where('order.orderStatus IN (:...statuses)', { statuses: ['已确认', '进行中', '已延期'] })
      .andWhere('order.feedback_status = :feedbackStatus', { feedbackStatus: '已完成' })
      .getCount();

    const inProgress = await orderRepo
      .createQueryBuilder('order')
      .where('order.orderStatus IN (:...statuses)', { statuses: ['已确认', '进行中', '已延期'] })
      .andWhere('order.feedback_status = :feedbackStatus', { feedbackStatus: '进行中' })
      .getCount();

    const delayed = await orderRepo
      .createQueryBuilder('order')
      .where('order.orderStatus IN (:...statuses)', { statuses: ['已确认', '进行中', '已延期'] })
      .andWhere('order.feedback_status = :feedbackStatus', { feedbackStatus: '已延期' })
      .getCount();

    return { total, completed, inProgress, delayed };
  }

  async getConfirmedPlans(query: any) {
    const {
      page = 1,
      pageSize = 10,
      djbH,
      materialCode,
    } = query;

    const queryBuilder = this.productionPlanRepository
      .createQueryBuilder('plan')
      .where('plan.planStatus = :status', { status: '已确认' });

    if (djbH) {
      queryBuilder.andWhere('plan.djbH LIKE :djbH', { djbH: `%${djbH}%` });
    }
    if (materialCode) {
      queryBuilder.andWhere('plan.materialCode LIKE :materialCode', {
        materialCode: `%${materialCode}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('plan.createTime', 'DESC')
      .getManyAndCount();

    return { data, total, page, pageSize };
  }

  async getConfirmedOrdersWithPlans(query: any) {
    const {
      page = 1,
      pageSize = 10,
      djbH,
      statusFilter,
    } = query;

    const orderRepo = this.dataSource.getRepository('PurchaseOrder');
    
    const queryBuilder = orderRepo
      .createQueryBuilder('order')
      .where('order.orderStatus IN (:...statuses)', { statuses: ['已确认', '进行中', '已延期'] });

    if (djbH) {
      queryBuilder.andWhere('order.djbH LIKE :djbH', { djbH: `%${djbH}%` });
    }

    if (statusFilter) {
      const statusList = statusFilter.split(',').map((s: string) => s.trim());
      queryBuilder.andWhere('order.feedback_status IN (:...statusList)', { statusList });
    }

    const [orders, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('order.createTime', 'DESC')
      .getManyAndCount();

    const now = new Date();

    const ordersWithPlans = await Promise.all(
      orders.map(async (order: any) => {
        const plans = await this.productionPlanRepository
          .createQueryBuilder('plan')
          .where('plan.djbH = :djbH', { djbH: order.djbH })
          .andWhere('plan.planStatus = :status', { status: '已确认' })
          .orderBy('plan.sortOrder', 'ASC')
          .addOrderBy('plan.createTime', 'DESC')
          .getMany();

        const latestPlans = plans;

        // 为每个计划添加进展状态和上期反馈数据
        const plansWithStatus = await Promise.all(
          latestPlans.map(async (plan: any) => {
            // 查询反馈主表获取进展状态
            const feedbackMain = await this.feedbackMainRepository.findOne({
              where: {
                productionPlanId: plan.id,
              },
              order: { createTime: 'DESC' },
              relations: ['versions'],
            });

            let progressStatus = '未开始';
            let finishedQuantity = 0;
            let defectQuantity = 0;
            let actualDeliveryDate: Date | null = null;
            let remarks = '';
            
            if (feedbackMain) {
              progressStatus = feedbackMain.progressStatus || '未开始';
              
              // 获取最新版本的反馈数据
              if (feedbackMain.versions && feedbackMain.versions.length > 0) {
                const latestVersion = feedbackMain.versions.sort((a, b) => b.version - a.version)[0];
                finishedQuantity = latestVersion.finishedQuantity || 0;
                defectQuantity = latestVersion.defectQuantity || 0;
                actualDeliveryDate = latestVersion.actualDeliveryDate;
                remarks = latestVersion.remarks || '';
              }
            } else {
              // 如果没有反馈记录，检查是否过期
              const plannedDate = plan.plannedDate ? new Date(plan.plannedDate) : null;
              if (plannedDate && now > plannedDate) {
                progressStatus = '已延期';
              }
            }

            return {
              ...plan,
              progressStatus,
              finishedQuantity,
              defectQuantity,
              actualDeliveryDate,
              remarks,
            };
          })
        );

        return {
          ...order,
          plans: plansWithStatus,
          planCount: plansWithStatus.length,
        };
      })
    );

    return { data: ordersWithPlans, total, page, pageSize };
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return (timestamp + random).padEnd(16, '0').substring(0, 16);
  }
}
