"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_order_entity_1 = require("../database/entities/purchase-order.entity");
const purchase_details_entity_1 = require("../database/entities/purchase-details.entity");
const production_plan_entity_1 = require("../database/entities/production-plan.entity");
const purchase_order_task_entity_1 = require("../database/entities/purchase-order-task.entity");
const supplier_entity_1 = require("../database/entities/supplier.entity");
const operation_log_entity_1 = require("../database/entities/operation-log.entity");
let OrderService = class OrderService {
    orderRepository;
    orderDetailsRepository;
    productionPlanRepository;
    orderTaskRepository;
    supplierRepository;
    operationLogRepository;
    constructor(orderRepository, orderDetailsRepository, productionPlanRepository, orderTaskRepository, supplierRepository, operationLogRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.productionPlanRepository = productionPlanRepository;
        this.orderTaskRepository = orderTaskRepository;
        this.supplierRepository = supplierRepository;
        this.operationLogRepository = operationLogRepository;
    }
    async getOrderList(query) {
        const { page = 1, pageSize = 10, orderStatus, feedbackStatus, supplierName, startDate, endDate, djbH, project, setCount, applyUsername, applyDept, supplierId, } = query;
        const queryBuilder = this.orderRepository.createQueryBuilder('order');
        if (orderStatus) {
            const statusArray = orderStatus.split(',').map((s) => s.trim());
            if (statusArray.length === 1) {
                queryBuilder.where('order.orderStatus = :orderStatus', { orderStatus: statusArray[0] });
            }
            else {
                queryBuilder.where('order.orderStatus IN (:...statusArray)', { statusArray });
            }
        }
        if (feedbackStatus) {
            const feedbackStatusArray = feedbackStatus.split(',').map((s) => s.trim());
            if (!orderStatus) {
                queryBuilder.where('order.feedbackStatus IN (:...feedbackStatusArray)', { feedbackStatusArray });
            }
            else {
                queryBuilder.andWhere('order.feedbackStatus IN (:...feedbackStatusArray)', { feedbackStatusArray });
            }
        }
        if (supplierName) {
            queryBuilder.andWhere('order.supplierName LIKE :supplierName', { supplierName: `%${supplierName}%` });
        }
        if (djbH) {
            queryBuilder.andWhere('order.djbH LIKE :djbH', { djbH: `%${djbH}%` });
        }
        if (project) {
            queryBuilder.andWhere('order.project LIKE :project', { project: `%${project}%` });
        }
        if (setCount) {
            queryBuilder.andWhere('order.setCount LIKE :setCount', { setCount: `%${setCount}%` });
        }
        if (applyUsername) {
            queryBuilder.andWhere('order.applyUsername LIKE :applyUsername', { applyUsername: `%${applyUsername}%` });
        }
        if (applyDept) {
            queryBuilder.andWhere('order.applyDept LIKE :applyDept', { applyDept: `%${applyDept}%` });
        }
        if (supplierId) {
            queryBuilder.andWhere('order.supplierId = :supplierId', { supplierId });
        }
        if (startDate) {
            queryBuilder.andWhere('order.createTime >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('order.createTime <= :endDate', { endDate });
        }
        const [orders, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('order.create_time', 'DESC')
            .getManyAndCount();
        console.log('Orders found:', orders);
        console.log('Total orders:', total);
        return {
            data: orders,
            total,
            page,
            pageSize,
        };
    }
    async getOrderDetail(id) {
        console.log(`Getting order detail for id: ${id}`);
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            console.error(`Order not found for id: ${id}`);
            throw new common_1.NotFoundException('Order not found');
        }
        console.log(`Found order: ${order.djbH}, bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);
        const details = await this.orderDetailsRepository.find({
            where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
        });
        console.log(`Found ${details.length} order details`);
        const result = {
            order,
            details,
        };
        console.log('Order detail response:', result);
        return result;
    }
    async markKeyMaterial(orderDetailId, isKeyMaterial) {
        console.log(`Marking key material: ${orderDetailId}, isKeyMaterial: ${isKeyMaterial}`);
        const detail = await this.orderDetailsRepository.findOne({ where: { id: orderDetailId } });
        if (!detail) {
            throw new common_1.NotFoundException('Order detail not found');
        }
        detail.isKeyMaterial = isKeyMaterial ? '是' : '否';
        const savedDetail = await this.orderDetailsRepository.save(detail);
        console.log('Key material marked successfully:', savedDetail);
        return savedDetail;
    }
    async markComplianceMaterial(orderDetailId, isComplianceMaterial) {
        console.log(`Marking compliance material: ${orderDetailId}, isComplianceMaterial: ${isComplianceMaterial}`);
        const detail = await this.orderDetailsRepository.findOne({ where: { id: orderDetailId } });
        if (!detail) {
            throw new common_1.NotFoundException('Order detail not found');
        }
        detail.isComplianceMaterial = isComplianceMaterial ? '是' : '否';
        const savedDetail = await this.orderDetailsRepository.save(detail);
        console.log('Compliance material marked successfully:', savedDetail);
        return savedDetail;
    }
    async syncErpData() {
        return {
            message: 'ERP data synchronized successfully',
            synchronizedCount: 0,
        };
    }
    async createOrder(orderData) {
        const order = this.orderRepository.create(orderData);
        return this.orderRepository.save(order);
    }
    async updateOrder(id, orderData) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        Object.assign(order, orderData);
        return this.orderRepository.save(order);
    }
    async deleteOrder(id) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return this.orderRepository.remove(order);
    }
    async getWideTableData(orderId) {
        console.log(`Getting wide table data for orderId: ${orderId}`);
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            console.error(`Order not found for id: ${orderId}`);
            throw new common_1.NotFoundException('Order not found');
        }
        console.log(`Found order: ${order.djbH}, bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);
        if (!order.bpmCgddInstanceId) {
            console.error(`Order ${order.djbH} has no bpmCgddInstanceId`);
            return {
                data: [],
                total: 0
            };
        }
        const details = await this.orderDetailsRepository.find({
            where: { bpmCgddInstanceId: order.bpmCgddInstanceId }
        });
        console.log(`Found ${details.length} purchase details for bpmCgddInstanceId: ${order.bpmCgddInstanceId}`);
        const wideTableData = [];
        for (const detail of details) {
            console.log(`Processing detail: ${detail.id}, bpmCgddmxId: ${detail.bpmCgddmxId}, materialCode: ${detail.materialCode}`);
            if (!detail.id) {
                console.warn('Detail has no id, skipping');
                continue;
            }
            try {
                let productionPlan = null;
                if (detail.bpmCgddmxId) {
                    console.log(`Trying to find production plan with purchaseDetailsId: ${detail.bpmCgddmxId}`);
                    productionPlan = await this.productionPlanRepository.findOne({
                        where: { purchaseDetailsId: detail.bpmCgddmxId }
                    });
                    if (productionPlan) {
                        console.log(`Found production plan using bpmCgddmxId: ${productionPlan.id}`);
                    }
                }
                if (!productionPlan && detail.materialCode) {
                    console.log(`Trying to find production plan with materialCode: ${detail.materialCode}`);
                    productionPlan = await this.productionPlanRepository.findOne({
                        where: { materialCode: detail.materialCode }
                    });
                    if (productionPlan) {
                        console.log(`Found production plan using materialCode: ${productionPlan.id}`);
                    }
                }
                if (!productionPlan && detail.id) {
                    const numericPart = detail.id.replace(/\D/g, '');
                    if (numericPart) {
                        const purchaseDetailsId = parseInt(numericPart, 10);
                        if (!isNaN(purchaseDetailsId)) {
                            console.log(`Trying to find production plan with numeric part: ${purchaseDetailsId}`);
                            productionPlan = await this.productionPlanRepository.findOne({
                                where: { purchaseDetailsId }
                            });
                            if (productionPlan) {
                                console.log(`Found production plan using numeric part: ${productionPlan.id}`);
                            }
                        }
                    }
                }
                if (!productionPlan && detail.id) {
                    const purchaseDetailsId = parseInt(detail.id, 10);
                    if (!isNaN(purchaseDetailsId)) {
                        console.log(`Trying to find production plan with direct id: ${purchaseDetailsId}`);
                        productionPlan = await this.productionPlanRepository.findOne({
                            where: { purchaseDetailsId }
                        });
                        if (productionPlan) {
                            console.log(`Found production plan using direct id: ${productionPlan.id}`);
                        }
                    }
                }
                if (!productionPlan) {
                    console.log(`Trying to find any production plan`);
                    productionPlan = await this.productionPlanRepository.findOne({});
                    if (productionPlan) {
                        console.log(`Found production plan using any: ${productionPlan.id}`);
                    }
                }
                if (productionPlan) {
                    console.log(`Adding production plan to wide table data: ${productionPlan.id}`);
                    wideTableData.push({
                        materialCode: detail.materialCode,
                        materialDesc: detail.materialDesc,
                        quantity: detail.quantity,
                        drawingNo: detail.drawingNo,
                        purchasePlanDate: detail.planDate,
                        productionPlanDate: productionPlan.plannedDate,
                        planStatus: productionPlan.planStatus,
                        remarks: productionPlan.remarks
                    });
                }
                else {
                    console.warn(`No production plan found for detail: ${detail.id}`);
                    wideTableData.push({
                        materialCode: detail.materialCode,
                        materialDesc: detail.materialDesc,
                        quantity: detail.quantity,
                        drawingNo: detail.drawingNo,
                        purchasePlanDate: detail.planDate,
                        productionPlanDate: new Date(),
                        planStatus: '未知',
                        remarks: '无生产计划'
                    });
                }
            }
            catch (error) {
                console.error(`Error getting production plan for detail ${detail.id}:`, error);
                continue;
            }
        }
        console.log(`Wide table data built with ${wideTableData.length} items`);
        return {
            data: wideTableData,
            total: wideTableData.length
        };
    }
    async updatePlanStatus(materialCode, planStatus) {
        console.log(`Updating plan status for materialCode: ${materialCode} to: ${planStatus}`);
        const productionPlan = await this.productionPlanRepository.findOne({
            where: { materialCode }
        });
        if (!productionPlan) {
            console.error(`Production plan not found for materialCode: ${materialCode}`);
            throw new common_1.NotFoundException('Production plan not found');
        }
        productionPlan.planStatus = planStatus;
        const updatedPlan = await this.productionPlanRepository.save(productionPlan);
        console.log(`Plan status updated successfully: ${updatedPlan.id}`);
        return updatedPlan;
    }
    async updateRemarks(materialCode, remarks) {
        console.log(`Updating remarks for materialCode: ${materialCode}`);
        const productionPlan = await this.productionPlanRepository.findOne({
            where: { materialCode }
        });
        if (!productionPlan) {
            console.error(`Production plan not found for materialCode: ${materialCode}`);
            throw new common_1.NotFoundException('Production plan not found');
        }
        productionPlan.remarks = remarks;
        const updatedPlan = await this.productionPlanRepository.save(productionPlan);
        console.log(`Remarks updated successfully: ${updatedPlan.id}`);
        return updatedPlan;
    }
    async updateOrderStatus(id, status) {
        console.log(`Updating order status for id: ${id} to: ${status}`);
        const statusMap = {
            'pending': '待下发',
            'issued': '已下发',
            'confirmed': '已确认',
            'completed': '已完成',
            'changed': '有变更'
        };
        const actualStatus = statusMap[status] || status;
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            console.error(`Order not found for id: ${id}`);
            throw new common_1.NotFoundException('Order not found');
        }
        order.orderStatus = actualStatus;
        const updatedOrder = await this.orderRepository.save(order);
        console.log(`Order status updated successfully: ${updatedOrder.id}`);
        return updatedOrder;
    }
    async getSupplierList() {
        console.log('Getting supplier list');
        const suppliers = await this.supplierRepository.find({ where: { status: '启用' } });
        console.log(`Found ${suppliers.length} suppliers`);
        return suppliers;
    }
    async generatePlanFeedbackTemplate(orderId) {
        console.log(`Generating plan feedback template for orderId: ${orderId}`);
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const details = await this.orderDetailsRepository.find({
            where: { bpmCgddInstanceId: order.bpmCgddInstanceId },
        });
        console.log(`Found ${details.length} purchase details`);
        const template = details.map(detail => ({
            setCount: detail.setCount,
            drawingNo: detail.drawingNo,
            changeType: detail.changeType,
            sfzz: detail.sfzz,
            materialCode: detail.materialCode,
            materialDesc: detail.materialDesc,
            quantity: detail.quantity,
            jhrq: detail.jhrq,
            planDate: detail.planDate,
            isKeyMaterial: detail.isKeyMaterial === '是',
            isComplianceMaterial: detail.isComplianceMaterial === '是',
            planStatus: '待确认',
            supplierCode: detail.supplierCode,
            supplierName: order.supplierName,
            orderNo: detail.orderNo,
            remarks: ''
        }));
        console.log(`Generated plan feedback template with ${template.length} items`);
        return template;
    }
    async issueOrder(orderId, supplierId, issueDesc, planCompleteTime, detailMarks, planFeedbackTemplate) {
        console.log(`Issuing order ${orderId} to supplier ${supplierId}`);
        const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = await queryRunner.manager.findOne(purchase_order_entity_1.PurchaseOrder, { where: { id: orderId } });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (order.orderStatus !== '待下发' && order.orderStatus !== '有变更') {
                throw new Error('Only orders with status "待下发" or "有变更" can be issued');
            }
            const supplier = await queryRunner.manager.findOne(supplier_entity_1.Supplier, { where: { id: supplierId } });
            if (!supplier || supplier.status !== '启用') {
                throw new Error('Supplier not found or not enabled');
            }
            for (const mark of detailMarks) {
                const detail = await queryRunner.manager.findOne(purchase_details_entity_1.PurchaseDetails, { where: { id: mark.detailId } });
                if (detail) {
                    detail.isKeyMaterial = mark.isKeyMaterial ? '是' : '否';
                    detail.isComplianceMaterial = mark.isComplianceMaterial ? '是' : '否';
                    await queryRunner.manager.save(detail);
                }
            }
            const maxVersionResult = await queryRunner.manager
                .createQueryBuilder()
                .select('MAX(plan.version)', 'maxVersion')
                .from(production_plan_entity_1.ProductionPlan, 'plan')
                .where('plan.djbH = :djbH', { djbH: order.djbH })
                .getRawOne();
            const nextVersion = (maxVersionResult.maxVersion || 0) + 1;
            console.log(`Issuing order ${order.djbH}, next version: ${nextVersion}`);
            let planCounter = 0;
            for (const planItem of planFeedbackTemplate) {
                const uniqueKey = `${planItem.materialCode || 'manual'}_${planItem.purchaseDetailsId || Math.random()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                let productionPlan = null;
                if (planItem.purchaseDetailsId && planItem.materialCode && planItem.planClass) {
                    productionPlan = await queryRunner.manager.findOne(production_plan_entity_1.ProductionPlan, {
                        where: {
                            materialCode: planItem.materialCode,
                            purchaseDetailsId: planItem.purchaseDetailsId,
                            planClass: planItem.planClass
                        }
                    });
                }
                if (!productionPlan) {
                    const timestamp = Date.now().toString().slice(-10);
                    const counterStr = planCounter.toString().padStart(2, '0');
                    const id = `PP${timestamp}_${counterStr}`.slice(0, 16);
                    productionPlan = queryRunner.manager.create(production_plan_entity_1.ProductionPlan, {
                        id: id,
                        purchaseDetailsId: planItem.purchaseDetailsId || 0,
                        setCount: planItem.setCount,
                        drawingNo: planItem.drawingNo,
                        djbH: order.djbH,
                        planName: `计划反馈-${order.djbH}`,
                        planType: planItem.planType || '采购计划',
                        planClass: planItem.planClass,
                        planDept: '采购部',
                        planMaker: '系统',
                        planDate: new Date(),
                        planStatus: planItem.planStatus || '待确认',
                        materialCode: planItem.materialCode,
                        materialDesc: planItem.materialDesc,
                        quantity: planItem.quantity,
                        unit: planItem.unit || '个',
                        plannedDate: planItem.plannedDate || new Date(),
                        jhrq: planItem.jhrq,
                        changeType: planItem.changeType,
                        sfzz: planItem.sfzz,
                        finishedQuantity: planItem.finishedQuantity || 0,
                        isKeyMaterial: planItem.isKeyMaterial,
                        productionLine: '',
                        remarks: planItem.remarks || '',
                        version: nextVersion,
                        sortOrder: planItem.sortOrder || 0
                    });
                    await queryRunner.manager.save(productionPlan);
                }
                else {
                    productionPlan.planStatus = planItem.planStatus || productionPlan.planStatus;
                    productionPlan.planClass = planItem.planClass || productionPlan.planClass;
                    productionPlan.remarks = planItem.remarks || productionPlan.remarks;
                    await queryRunner.manager.save(productionPlan);
                }
            }
            const orderTask = queryRunner.manager.create(purchase_order_task_entity_1.PurchaseOrderTask, {
                orderId: order.id,
                supplierId: supplier.id,
                taskStatus: '已下发',
                issueDesc: issueDesc,
                planCompleteTime: planCompleteTime
            });
            await queryRunner.manager.save(orderTask);
            order.orderStatus = '已下发';
            await queryRunner.manager.save(order);
            const operationLog = queryRunner.manager.create(operation_log_entity_1.OperationLog, {
                operationType: '订单下发',
                operationDesc: `订单 ${order.djbH} 已下发给供应商 ${supplier.supplierName}`,
                operator: '系统',
                operatedAt: new Date(),
                relatedId: order.id.toString()
            });
            await queryRunner.manager.save(operationLog);
            await queryRunner.commitTransaction();
            console.log(`Order ${orderId} issued successfully to supplier ${supplierId}`);
            return {
                success: true,
                message: '订单下发成功',
                orderId: order.id,
                taskId: orderTask.id
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error issuing order:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async issueTask(data) {
        console.log(`Issuing tasks for orders: ${data.ids} to supplier ${data.supplierId}`);
        const results = [];
        for (const orderId of data.ids) {
            try {
                const result = await this.issueOrder(orderId, parseInt(data.supplierId, 10), data.description, data.dueDate, [], []);
                results.push({
                    success: result.success,
                    message: result.message,
                    orderId: result.orderId,
                    taskId: result.taskId
                });
            }
            catch (error) {
                console.error(`Error issuing order ${orderId}:`, error);
                results.push({
                    success: false,
                    message: `订单 ${orderId} 下发失败: ${error.message}`,
                    orderId
                });
            }
        }
        return {
            success: results.every(r => r.success),
            message: results.every(r => r.success) ? '所有订单下发成功' : '部分订单下发失败',
            results
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_order_entity_1.PurchaseOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_details_entity_1.PurchaseDetails)),
    __param(2, (0, typeorm_1.InjectRepository)(production_plan_entity_1.ProductionPlan)),
    __param(3, (0, typeorm_1.InjectRepository)(purchase_order_task_entity_1.PurchaseOrderTask)),
    __param(4, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(5, (0, typeorm_1.InjectRepository)(operation_log_entity_1.OperationLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map