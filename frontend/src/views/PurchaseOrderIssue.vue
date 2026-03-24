<template>
  <div class="purchase-order-issue">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button type="primary" plain @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回订单列表
      </el-button>
      <h1>{{ isFromConfirmation ? '生产计划确认' : '采购订单下发' }} - 订单编号 {{ order?.djbH }}</h1>
    </div>

    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 左侧：订单基础信息 -->
      <div class="left-section">
        <h2>订单基础信息</h2>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单编号">{{ order?.djbH }}</el-descriptions-item>
          <el-descriptions-item label="采购物料">{{ order?.major }}</el-descriptions-item>
          <el-descriptions-item label="项目">{{ order?.project }}</el-descriptions-item>
          <el-descriptions-item label="版本">{{ order?.version }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ order?.setCount }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(order?.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="原关联供应商">{{ order?.supplierName }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{ order?.orderStatus }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 右侧：下发信息编辑区 -->
      <div class="right-section">
        <h2>下发信息</h2>
        <el-form :model="issueForm" :rules="rules" ref="issueFormRef">
          <!-- 供应商选择 -->
          <el-form-item label="供应商" prop="supplierId">
            <el-select v-model="issueForm.supplierId" placeholder="请选择供应商" filterable>
              <el-option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :label="supplier.supplierName"
                :value="supplier.id"
              >
                <div class="supplier-info">
                  <span class="supplier-name">{{ supplier.supplierName }}</span>
                  <span class="supplier-contact">{{ supplier.contactPerson }} {{ supplier.contactPhone }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 下发说明 -->
          <el-form-item label="下发说明" prop="issueDesc">
            <el-input
              v-model="issueForm.issueDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入下发说明"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>

          <!-- 计划完成时间 -->
          <el-form-item label="计划完成时间" prop="planCompleteTime">
            <el-date-picker
              v-model="issueForm.planCompleteTime"
              type="datetime"
              placeholder="请选择计划完成时间"
              :disabled-date="disabledDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <!-- 采购订单明细 -->
      <div class="details-section">
        <h2>采购订单明细</h2>
        <el-table :data="paginatedOrderDetails" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="60" :index="indexMethod1"></el-table-column>
          <el-table-column prop="materialCode" label="物料编码" width="180"></el-table-column>
          <el-table-column prop="materialDesc" label="物料描述" min-width="200"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="100">
            <template #default="scope">
              {{ Number(scope.row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="jhrq" label="交货日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.jhrq) }}
            </template>
          </el-table-column>
          <el-table-column prop="isKeyMaterial" label="关键物料" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isKeyMaterial"
                :active-value="'是'"
                :inactive-value="'否'"
                @change="handleKeyMaterialChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="isComplianceMaterial" label="制造符合性" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isComplianceMaterial"
                :active-value="'是'"
                :inactive-value="'否'"
                @change="handleComplianceMaterialChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="detailsCurrentPage"
          v-model:page-size="detailsPageSize"
          :page-sizes="[50, 100, 200]"
          :total="orderDetails.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 16px; justify-content: flex-end;"
        ></el-pagination>
      </div>

      <!-- 生产计划初始化 -->
      <div class="template-section">
        <div class="template-header">
          <h2>{{ isFromConfirmation ? '生产计划确认' : '生产计划初始化' }}</h2>
          <el-button v-if="!isFromConfirmation" type="primary" @click="generateTemplate">
          <el-icon><Refresh /></el-icon>
          生成计划
        </el-button>
        </div>
        <el-table :data="paginatedPlanTemplate" style="width: 100%" border :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" width="60" :index="indexMethod2"></el-table-column>
          <el-table-column prop="setCount" label="台份" width="100">
            <template #default="scope">
              {{ scope.row.setCount || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="planClass" label="计划分类" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.planClass" placeholder="请选择">
                <el-option label="生产计划" value="生产计划"></el-option>
                <el-option label="工序计划" value="工序计划"></el-option>
                <el-option label="制造符合性检查计划" value="制造符合性检查计划"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="planType" label="计划类型" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.planType" placeholder="请输入计划类型"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="drawingNo" label="图号" width="120">
            <template #default="scope">
              {{ scope.row.drawingNo || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="materialCode" label="物料编码" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.materialCode" placeholder="请输入物料编码"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="materialDesc" label="物料描述" min-width="200">
            <template #default="scope">
              <el-input v-model="scope.row.materialDesc" placeholder="请输入物料描述"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100">
            <template #default="scope">
              {{ Number(scope.row.quantity || 0).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.unit" placeholder="单位"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="jhrq" label="交货日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.jhrq) }}
            </template>
          </el-table-column>
          <el-table-column prop="changeType" label="变更类型" width="120">
            <template #default="scope">
              {{ scope.row.changeType || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="sfzz" label="是否自制" width="120">
            <template #default="scope">
              <el-select v-model="scope.row.sfzz" placeholder="请选择" clearable>
                <el-option label="自制" value="自制"></el-option>
                <el-option label="外采" value="外采"></el-option>
                <el-option label="外委" value="外委"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="plannedDate" label="计划日期" width="180">
            <template #default="scope">
              <el-date-picker v-model="scope.row.plannedDate" type="date" placeholder="计划日期" style="width: 100%"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="备注" min-width="200">
            <template #default="scope">
              <el-input v-model="scope.row.remarks" placeholder="请输入备注"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="success" size="small" @click="addTemplateItem(indexMethod2(scope.$index))">
                <el-icon><Plus /></el-icon>
                新增行
              </el-button>
              <el-button type="danger" size="small" @click="removeTemplateItem(indexMethod2(scope.$index) - 1)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="planCurrentPage"
          v-model:page-size="planPageSize"
          :page-sizes="[50, 100, 200]"
          :total="planFeedbackTemplate.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 16px; justify-content: flex-end;"
        ></el-pagination>
      </div>

      <!-- 底部按钮 -->
      <div class="bottom-buttons">
        <el-button @click="goBack">取消</el-button>
        <!-- 采购订单下发模块：显示提交下发按钮 -->
        <el-button v-if="!isFromConfirmation" type="primary" @click="submitIssue" :loading="submitting">
          {{ submitting ? '提交中...' : '提交下发' }}
        </el-button>
        <!-- 生产计划确认模块：显示确认提交按钮 -->
        <el-button v-if="isFromConfirmation && planFeedbackTemplate.length > 0" type="success" @click="confirmSubmit" :loading="confirming">
          {{ confirming ? '确认中...' : '确认提交' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Refresh, Plus, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { purchaseOrderApi, supplierApi, productionPlanApi } from '../api';

// 路由和导航
const route = useRoute();
const router = useRouter();
const orderId = computed(() => {
  const id = route.params.orderId;
  console.log('Order ID from route:', id);
  return Number(id);
});

// 判断是否来自生产计划确认模块
const isFromConfirmation = computed(() => {
  return route.query.from === 'confirmation';
});

// 表单数据
const issueForm = ref({
  supplierId: '',
  issueDesc: '',
  planCompleteTime: new Date()
});

// 验证规则
const rules = {
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  issueDesc: [], // 下发说明非必填
  planCompleteTime: [{ required: true, message: '请选择计划完成时间', trigger: 'change' }]
};

// 表单引用
const issueFormRef = ref();

// 数据
const order = ref<any>(null);
const orderDetails = ref<any[]>([]);
const suppliers = ref<any[]>([]);
const planFeedbackTemplate = ref<any[]>([]);
const submitting = ref(false);
const confirming = ref(false);

// 分页相关
const detailsCurrentPage = ref(1);
const detailsPageSize = ref(50);
const planCurrentPage = ref(1);
const planPageSize = ref(50);

// 分页计算属性
const paginatedOrderDetails = computed(() => {
  const start = (detailsCurrentPage.value - 1) * detailsPageSize.value;
  const end = start + detailsPageSize.value;
  return orderDetails.value.slice(start, end);
});

const paginatedPlanTemplate = computed(() => {
  const start = (planCurrentPage.value - 1) * planPageSize.value;
  const end = start + planPageSize.value;
  return planFeedbackTemplate.value.slice(start, end);
});

// 序号计算方法
const indexMethod1 = (index: number) => {
  return (detailsCurrentPage.value - 1) * detailsPageSize.value + index + 1;
};

const indexMethod2 = (index: number) => {
  return (planCurrentPage.value - 1) * planPageSize.value + index + 1;
};

// 日期禁用函数
const disabledDate = (time: Date) => {
  const now = new Date();
  const ninetyDaysLater = new Date();
  ninetyDaysLater.setDate(now.getDate() + 90);
  return time.getTime() < now.getTime() || time.getTime() > ninetyDaysLater.getTime();
};

// 格式化日期
const formatDate = (date: any) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 返回订单列表
const goBack = () => {
  router.push('/app/purchase-order');
};

// 处理关键物料标记变更
const handleKeyMaterialChange = async (row: any) => {
  try {
    console.log('Updating key material for row:', row);
    // 调用后端API更新标记
    await purchaseOrderApi.markKeyMaterial({ 
      orderDetailId: row.id, 
      isKeyMaterial: row.isKeyMaterial === '是' 
    });
    console.log('Key material updated successfully:', row);
    ElMessage.success('关键物料标记更新成功');
  } catch (error) {
    console.error('Failed to update key material:', error);
    ElMessage.error('更新关键物料标记失败');
    // 回滚本地状态
    row.isKeyMaterial = row.isKeyMaterial === '是' ? '否' : '是';
  }
};

// 处理制造符合性检查物料标记变更
const handleComplianceMaterialChange = async (row: any) => {
  try {
    console.log('Updating compliance material for row:', row);
    // 调用后端API更新标记
    await purchaseOrderApi.markComplianceMaterial({ 
      orderDetailId: row.id, 
      isComplianceMaterial: row.isComplianceMaterial === '是' 
    });
    console.log('Compliance material updated successfully:', row);
    ElMessage.success('制造符合性标记更新成功');
  } catch (error) {
    console.error('Failed to update compliance material:', error);
    ElMessage.error('更新制造符合性标记失败');
    // 回滚本地状态
    row.isComplianceMaterial = row.isComplianceMaterial === '是' ? '否' : '是';
  }
};

// 生成计划反馈模板
const generateTemplate = async () => {
  try {
    // 首先获取采购订单明细，确保包含最新的标记信息
    const orderResponse: any = await purchaseOrderApi.getDetail(orderId.value);
    const details = orderResponse.details || [];
    
    // 处理模板数据，按照采购订单明细的顺序生成计划
    const templateItems: any[] = [];
    
    // 遍历采购订单明细，按照顺序生成计划
    let sortOrder = 1; // 初始化sort_order计数器
    details.forEach((detail: any) => {
      console.log('Processing detail:', detail);
      console.log('isKeyMaterial:', detail.isKeyMaterial);
      console.log('isComplianceMaterial:', detail.isComplianceMaterial);
      
      // 1. 生成基础计划（生产计划）
      const baseItem = {
        setCount: detail.setCount,
        drawingNo: detail.drawingNo,
        changeType: detail.changeType,
        sfzz: detail.sfzz,
        materialCode: detail.materialCode,
        materialDesc: detail.materialDesc,
        quantity: detail.quantity,
        jhrq: detail.jhrq,
        planClass: '生产计划', // 默认计划分类
        planType: '',
        planStatus: '待确认',
        unit: detail.unit || '',
        plannedDate: detail.planDate || '',
        finishedQuantity: 0,
        isKeyMaterial: detail.isKeyMaterial,
        remarks: '',
        purchaseDetailsId: detail.id,
        sortOrder: sortOrder++ // 分配sort_order
      };
      templateItems.push(baseItem);
      
      // 2. 关键物料标记为是的行，生成工序计划
      if (detail.isKeyMaterial === '是') {
        console.log('Generating process plan for key material:', detail.materialCode);
        templateItems.push({
          setCount: detail.setCount,
          drawingNo: detail.drawingNo,
          changeType: detail.changeType,
          sfzz: detail.sfzz,
          materialCode: detail.materialCode,
          materialDesc: detail.materialDesc,
          quantity: detail.quantity,
          jhrq: detail.jhrq,
          planClass: '工序计划',
          planType: '',
          planStatus: '待确认',
          unit: detail.unit || '',
          plannedDate: detail.planDate || '',
          finishedQuantity: 0,
          isKeyMaterial: detail.isKeyMaterial,
          remarks: '',
          purchaseDetailsId: detail.id,
          sortOrder: sortOrder++ // 分配sort_order
        });
      }
      
      // 3. 制造符合性标记为是的行，生成制造符合性检查计划
      if (detail.isComplianceMaterial === '是') {
        console.log('Generating compliance plan for material:', detail.materialCode);
        templateItems.push({
          setCount: detail.setCount,
          drawingNo: detail.drawingNo,
          changeType: detail.changeType,
          sfzz: detail.sfzz,
          materialCode: detail.materialCode,
          materialDesc: detail.materialDesc,
          quantity: detail.quantity,
          jhrq: detail.jhrq,
          planClass: '制造符合性检查计划',
          planType: '',
          planStatus: '待确认',
          unit: detail.unit || '',
          plannedDate: detail.planDate || '',
          finishedQuantity: 0,
          isKeyMaterial: detail.isKeyMaterial,
          remarks: '',
          purchaseDetailsId: detail.id,
          sortOrder: sortOrder++ // 分配sort_order
        });
      }
    });
    
    console.log('Generated template items:', templateItems);
    planFeedbackTemplate.value = templateItems;
  } catch (error) {
    console.error('Failed to generate template:', error);
    ElMessage.error('生成模板失败');
  }
};

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
  if (row.planClass === '工序计划') {
    return 'process-plan-row';
  } else if (row.planClass === '制造符合性检查计划') {
    return 'compliance-plan-row';
  }
  return '';
};

// 添加模板行
const addTemplateItem = (index: number) => {
  // 获取当前行的purchaseDetailsId（如果存在）
  const currentRow = index > 0 ? planFeedbackTemplate.value[index - 1] : null;
  const purchaseDetailsId = currentRow?.purchaseDetailsId || 0;
  const jhrq = currentRow?.jhrq || null;
  const setCount = currentRow?.setCount || '';
  const drawingNo = currentRow?.drawingNo || '';
  const changeType = currentRow?.changeType || '';
  const sfzz = currentRow?.sfzz || '';
  
  // 计算当前最大的sortOrder值
  const maxSortOrder = planFeedbackTemplate.value.reduce((max, item) => {
    return Math.max(max, item.sortOrder || 0);
  }, 0);
  
  const newItem = {
    setCount: setCount,
    drawingNo: drawingNo,
    changeType: changeType,
    sfzz: sfzz,
    planClass: '',
    planType: '',
    planStatus: '待确认',
    materialCode: '',
    materialDesc: '',
    quantity: 0,
    jhrq: jhrq,
    unit: '',
    plannedDate: '',
    finishedQuantity: 0,
    remarks: '',
    purchaseDetailsId: purchaseDetailsId, // 继承当前行的purchaseDetailsId
    sortOrder: maxSortOrder + 1 // 设置为最大值+1
  };
  if (index !== undefined) {
    planFeedbackTemplate.value.splice(index, 0, newItem);
  } else {
    planFeedbackTemplate.value.push(newItem);
  }
};

// 删除模板行
const removeTemplateItem = (index: number) => {
  planFeedbackTemplate.value.splice(index, 1);
};

// 提交下发
const submitIssue = async () => {
  if (!issueFormRef.value) return;
  
  try {
    await issueFormRef.value.validate();
    submitting.value = true;
    
    if (planFeedbackTemplate.value.length === 0) {
      ElMessage.info('正在自动生成计划...');
      await generateTemplate();
      if (planFeedbackTemplate.value.length === 0) {
        ElMessage.warning('无法生成计划，请检查订单明细数据');
        submitting.value = false;
        return;
      }
      ElMessage.success('计划已自动生成，正在提交下发...');
    }
    
    const detailMarks = orderDetails.value.map(detail => ({
      detailId: detail.id,
      isKeyMaterial: detail.isKeyMaterial === '是',
      isComplianceMaterial: detail.isComplianceMaterial === '是'
    }));
    
    await purchaseOrderApi.issueOrder({
      orderId: orderId.value,
      supplierId: issueForm.value.supplierId,
      issueDesc: issueForm.value.issueDesc,
      planCompleteTime: issueForm.value.planCompleteTime,
      detailMarks: detailMarks,
      planFeedbackTemplate: planFeedbackTemplate.value
    });
    
    ElMessage.success('订单下发成功');
    goBack();
  } catch (error) {
    console.error('Failed to issue order:', error);
    ElMessage.error('订单下发失败');
  } finally {
    submitting.value = false;
  }
};

// 确认提交 - 将所有计划以新增形式保存到production_plan表中，状态为"已确认"
const confirmSubmit = async () => {
  if (planFeedbackTemplate.value.length === 0) {
    ElMessage.warning('请先生成生产计划');
    return;
  }

  try {
    confirming.value = true;
    
    // 准备计划数据，状态统一设置为"已确认"
    const plans = planFeedbackTemplate.value.map(plan => ({
      purchaseDetailsId: plan.purchaseDetailsId || 0,
      setCount: plan.setCount,
      drawingNo: plan.drawingNo,
      djbH: order.value.djbH,
      planName: `计划反馈-${order.value.djbH}`,
      planType: plan.planType || '采购计划',
      planClass: plan.planClass || '生产计划',
      planDept: '采购部',
      planMaker: '系统',
      planDate: new Date(),
      planStatus: '已确认',
      materialCode: plan.materialCode,
      materialDesc: plan.materialDesc,
      quantity: plan.quantity,
      unit: plan.unit || '个',
      plannedDate: plan.plannedDate || new Date(),
      jhrq: plan.jhrq,
      changeType: plan.changeType,
      sfzz: plan.sfzz,
      finishedQuantity: plan.finishedQuantity || 0,
      isKeyMaterial: plan.isKeyMaterial,
      productionLine: '',
      remarks: plan.remarks || '',
      sortOrder: plan.sortOrder || 0
    }));
    
    console.log('Confirming plans:', plans);
    
    // 批量导入计划
    const response = await productionPlanApi.import({
      plans: plans,
      createdBy: 1,
      createdName: '系统',
      orderId: orderId.value
    });
    console.log('Import response:', response);
    
    ElMessage.success(`成功确认并保存 ${plans.length} 条生产计划`);
    
    // 返回上一页
    setTimeout(() => {
      router.back();
    }, 1000);
  } catch (error) {
    ElMessage.error('确认提交失败');
    console.error('Failed to confirm submit:', error);
  } finally {
    confirming.value = false;
  }
};

// 加载数据
const loadData = async () => {
  try {
    console.log('Loading data for order ID:', orderId.value);
    // 加载订单详情
    const orderResponse: any = await purchaseOrderApi.getDetail(orderId.value);
    console.log('Order response:', orderResponse);
    order.value = orderResponse.order;
    orderDetails.value = orderResponse.details;
    console.log('Order data:', order.value);
    console.log('Order details:', orderDetails.value);
    
    // 加载供应商列表
    const suppliersResponse: any = await purchaseOrderApi.getSuppliers();
    console.log('Suppliers response:', suppliersResponse);
    suppliers.value = suppliersResponse;
    
    // 默认选择原供应商
    if (order.value?.supplierName) {
      const defaultSupplier = suppliers.value.find((s: any) => s.supplierName === order.value.supplierName);
      console.log('Default supplier:', defaultSupplier);
      if (defaultSupplier) {
        issueForm.value.supplierId = defaultSupplier.id;
        console.log('Set supplier ID:', defaultSupplier.id);
      }
    }
    
    // 自动加载已生成的生产计划
    await loadExistingPlans();
  } catch (error) {
    console.error('Failed to load data:', error);
    ElMessage.error('加载数据失败');
  }
};

// 加载已生成的生产计划
const loadExistingPlans = async () => {
  try {
    console.log('Loading existing production plans for order:', orderId.value);
    const response = await supplierApi.getOrderPlans(orderId.value.toString(), {
      page: 1,
      pageSize: 100
    });
    console.log('Existing plans response:', response);
    
    if (response.data && response.data.length > 0) {
      let plans = response.data;
      
      // 如果订单状态为"已确认"，只显示plan_status为"已确认"且version最大的条目
      if (order.value?.orderStatus === '已确认') {
        console.log('Order status is "已确认", filtering plans...');
        
        // 找出最大的version
        const maxVersion = Math.max(...plans.map((p: any) => p.version || 1));
        console.log('Max version:', maxVersion);
        
        // 过滤出plan_status为"已确认"且version最大的条目
        plans = plans.filter((p: any) => 
          p.planStatus === '已确认' && (p.version || 1) === maxVersion
        );
        console.log('Filtered plans count:', plans.length);
      }
      
      // 如果有已生成的生产计划，直接显示
      planFeedbackTemplate.value = plans.map((plan: any) => ({
        setCount: plan.setCount,
        drawingNo: plan.drawingNo,
        changeType: plan.changeType,
        sfzz: plan.sfzz,
        materialCode: plan.materialCode,
        materialDesc: plan.materialDesc,
        quantity: plan.quantity,
        jhrq: plan.jhrq,
        planClass: plan.planClass || '生产计划',
        planType: plan.planType || '',
        planStatus: plan.planStatus || '待确认',
        unit: plan.unit || '',
        plannedDate: plan.plannedDate || '',
        finishedQuantity: plan.finishedQuantity || 0,
        remarks: plan.remarks || '',
        purchaseDetailsId: plan.purchaseDetailsId,
        sortOrder: plan.sortOrder || 0, // 保留sort_order
        id: plan.id
      }));
      console.log('Loaded existing plans:', planFeedbackTemplate.value.length);
    } else {
      console.log('No existing plans found');
    }
  } catch (error) {
    console.error('Failed to load existing plans:', error);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.purchase-order-issue {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.page-header h1 {
  font-size: 20px;
  margin: 0;
}

.page-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.left-section,
.right-section {
  margin-bottom: 30px;
}

.left-section h2,
.right-section h2,
.details-section h2,
.template-section h2 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #303133;
}

.details-section,
.template-section {
  margin-bottom: 30px;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.supplier-info {
  display: flex;
  flex-direction: column;
}

.supplier-name {
  font-weight: bold;
}

.supplier-contact {
  font-size: 12px;
  color: #606266;
}

.bottom-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

@media (min-width: 768px) {
  .page-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .left-section,
  .right-section {
    margin-bottom: 0;
  }
  
  .details-section,
  .template-section,
  .bottom-buttons {
    grid-column: 1 / -1;
  }
}

/* 计划行样式 */
:deep(.process-plan-row) {
  background-color: #fffbe6 !important;
}

:deep(.compliance-plan-row) {
  background-color: #f3e8ff !important;
}

:deep(.process-plan-row:hover),
:deep(.compliance-plan-row:hover) {
  background-color: #f0f9ff !important;
}
</style>