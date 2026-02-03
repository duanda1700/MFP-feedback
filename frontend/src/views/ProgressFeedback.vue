<template>
  <div class="progress-feedback-container">
    <h2>进度反馈管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="计划编号">
            <el-input v-model="searchForm.planNo" placeholder="请输入计划编号" />
          </el-form-item>
          
          <el-form-item label="物料图号">
            <el-input v-model="searchForm.materialCode" placeholder="请输入物料图号" />
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option label="待反馈" value="pending" />
              <el-option label="已反馈" value="submitted" />
              <el-option label="已确认" value="confirmed" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 双列表展示 -->
    <div class="dual-list-container">
      <!-- 左侧：承制订单列表 -->
      <el-card class="order-list-card">
        <template #header>
          <span>承制订单列表</span>
        </template>
        <el-table :data="orderList" style="width: 100%" @row-click="handleOrderClick">
          <el-table-column prop="orderNo" label="订单编号" />
          <el-table-column prop="materialCode" label="物料图号" />
          <el-table-column prop="materialName" label="物料名称" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="deliveryDate" label="交货日期" width="180" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 右侧：计划明细反馈表 -->
      <el-card class="feedback-form-card">
        <template #header>
          <span>计划明细反馈表</span>
          <el-button type="primary" @click="handleSubmitFeedback" v-if="selectedOrder">提交反馈</el-button>
        </template>
        
        <div v-if="selectedOrder" class="feedback-form">
          <el-form :model="feedbackForm" label-width="120px">
            <el-form-item label="订单编号">
              <el-input v-model="feedbackForm.orderNo" disabled />
            </el-form-item>
            
            <el-form-item label="物料图号">
              <el-input v-model="feedbackForm.materialCode" disabled />
            </el-form-item>
            
            <el-form-item label="物料名称">
              <el-input v-model="feedbackForm.materialName" disabled />
            </el-form-item>
            
            <el-form-item label="数量">
              <el-input v-model="feedbackForm.quantity" disabled />
            </el-form-item>
            
            <el-form-item label="责任人">
              <el-input v-model="feedbackForm.responsiblePerson" />
            </el-form-item>
            
            <el-form-item label="计划状态">
              <el-select v-model="feedbackForm.status">
                <el-option label="待开始" value="pending" />
                <el-option label="执行中" value="executing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="备注">
              <el-input v-model="feedbackForm.remarks" type="textarea" :rows="4" />
            </el-form-item>
            
            <el-form-item label="关键零部件标记">
              <el-switch v-model="feedbackForm.isKeyMaterial" />
            </el-form-item>
            
            <el-form-item label="制造符合性检查">
              <el-switch v-model="feedbackForm.isConformityCheck" />
            </el-form-item>
            
            <el-form-item label="检查时间点" v-if="feedbackForm.isConformityCheck">
              <el-date-picker v-model="feedbackForm.checkTime" type="datetime" placeholder="请选择检查时间" />
            </el-form-item>
          </el-form>
        </div>
        
        <div v-else class="no-selection">
          <p>请从左侧选择一个订单进行反馈</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { progressFeedbackApi } from '../api';

const searchForm = reactive({
  planNo: '',
  materialCode: '',
  status: ''
});

// 模拟数据
const orderList = ref([
  { id: '1', orderNo: 'PO-2026-0001', materialCode: 'MAT-001', materialName: '物料A', quantity: 100, deliveryDate: '2026-03-01', status: 'pending' },
  { id: '2', orderNo: 'PO-2026-0002', materialCode: 'MAT-002', materialName: '物料B', quantity: 200, deliveryDate: '2026-03-15', status: 'submitted' },
  { id: '3', orderNo: 'PO-2026-0003', materialCode: 'MAT-003', materialName: '物料C', quantity: 150, deliveryDate: '2026-04-01', status: 'confirmed' }
]);

const selectedOrder = ref<any>(null);
const feedbackForm = reactive({
  orderNo: '',
  materialCode: '',
  materialName: '',
  quantity: '',
  responsiblePerson: '',
  status: 'pending',
  remarks: '',
  isKeyMaterial: false,
  isConformityCheck: false,
  checkTime: null
});

const getStatusType = (status: string) => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'submitted':
      return 'warning';
    case 'confirmed':
      return 'success';
    default:
      return 'info';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待反馈';
    case 'submitted':
      return '已反馈';
    case 'confirmed':
      return '已确认';
    default:
      return status;
  }
};

const handleSearch = async () => {
  try {
    const response = await progressFeedbackApi.getList(searchForm);
    orderList.value = response.data || [];
  } catch (error) {
    console.error('Search progress feedback error:', error);
    ElMessage.error('搜索失败');
  }
};

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = '';
  });
  handleSearch();
};

const handleOrderClick = (row: any) => {
  selectedOrder.value = row;
  // 填充反馈表单
  feedbackForm.orderNo = row.orderNo;
  feedbackForm.materialCode = row.materialCode;
  feedbackForm.materialName = row.materialName;
  feedbackForm.quantity = row.quantity;
  feedbackForm.responsiblePerson = '';
  feedbackForm.status = 'pending';
  feedbackForm.remarks = '';
  feedbackForm.isKeyMaterial = false;
  feedbackForm.isConformityCheck = false;
  feedbackForm.checkTime = null;
};

const handleSubmitFeedback = async () => {
  if (!selectedOrder.value) {
    ElMessage.warning('请选择一个订单进行反馈');
    return;
  }
  
  try {
    await progressFeedbackApi.submit({
      orderId: selectedOrder.value.id,
      ...feedbackForm
    });
    ElMessage.success('反馈提交成功');
    // 更新订单状态
    selectedOrder.value.status = 'submitted';
  } catch (error) {
    console.error('Submit feedback error:', error);
    ElMessage.error('反馈提交失败');
  }
};
</script>

<style scoped>
.progress-feedback-container {
  padding: 20px;
}

.progress-feedback-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.search-filter-container {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.dual-list-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.order-list-card {
  height: fit-content;
}

.feedback-form-card {
  height: fit-content;
}

.no-selection {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.feedback-form {
  margin-top: 20px;
}

@media (max-width: 1200px) {
  .dual-list-container {
    grid-template-columns: 1fr;
  }
}
</style>