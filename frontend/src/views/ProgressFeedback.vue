<template>
  <div class="progress-feedback-container">
    <h2>计划进度反馈管理</h2>
    
    <div class="filter-section">
      <el-card shadow="hover">
        <el-form :inline="true" :model="searchForm" class="filter-form">
          <el-form-item label="订单编号">
            <el-input 
              v-model="searchForm.djbH" 
              placeholder="请输入订单编号" 
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item label="订单状态">
            <el-select
              v-model="searchForm.statusFilter"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择状态"
              style="width: 280px"
              @change="handleSearch"
            >
              <el-option label="未开始" value="未开始" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已延期" value="已延期" />
              <el-option label="已取消" value="已取消" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="handleBatchExport" :disabled="selectedOrders.length === 0">
              <el-icon><Download /></el-icon>
              批量导出 ({{ selectedOrders.length }})
            </el-button>
            <el-button type="warning" @click="triggerBatchImport">
              <el-icon><Upload /></el-icon>
              批量导入
            </el-button>
            <input 
              ref="batchImportInput" 
              type="file" 
              accept=".xlsx,.xls" 
              style="display: none" 
              @change="handleBatchImport"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <div class="statistics-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#409EFF"><Document /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.total }}</div>
                <div class="stat-label">总订单数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#67C23A"><CircleCheck /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.completed }}</div>
                <div class="stat-label">已完成</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#E6A23C"><Clock /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.inProgress }}</div>
                <div class="stat-label">进行中</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <el-icon :size="40" color="#F56C6C"><Warning /></el-icon>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.delayed }}</div>
                <div class="stat-label">已延期</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="order-list-section">
      <div v-if="orderList.length === 0" class="empty-state">
        <el-empty description="暂无已确认的采购订单" />
      </div>
      
      <div v-else class="order-cards">
        <el-card 
          v-for="order in orderList" 
          :key="order.id"
          shadow="hover"
          class="order-card"
          :class="{ 'expanded': expandedOrders.includes(order.id) }"
        >
          <div class="order-card-header" @click="toggleOrderExpand(order.id)">
            <div class="order-basic-info">
              <div class="order-title">
                <el-checkbox 
                  v-model="order.selected"
                  @change="handleOrderSelect(order)"
                  @click.stop
                  style="margin-right: 10px;"
                />
                <el-tag :type="getFeedbackStatusType(order.feedbackStatus)" size="large">
                  {{ order.feedbackStatus }}
                </el-tag>
                <span class="order-no">{{ order.djbH }}</span>
              </div>
              <div class="order-meta">
                <span><el-icon><User /></el-icon> {{ order.applyUsername || '-' }}</span>
                <span><el-icon><OfficeBuilding /></el-icon> {{ order.applyDept || '-' }}</span>
                <span><el-icon><Document /></el-icon> {{ order.planCount || 0 }} 条生产计划</span>
              </div>
            </div>
            
            <div class="order-actions">
              <el-button 
                :icon="expandedOrders.includes(order.id) ? 'ArrowUp' : 'ArrowDown'" 
                circle
                @click.stop="toggleOrderExpand(order.id)"
              />
            </div>
          </div>
          
          <el-collapse-transition>
            <div v-show="expandedOrders.includes(order.id)" class="order-details">
              <el-divider />
              <div class="details-header">
                <h4>生产计划明细</h4>
                <div class="feedback-cycle-input">
                  <span>反馈周期：</span>
                  <el-input 
                    v-model="order.feedbackCycle" 
                    placeholder="如：2026W12"
                    style="width: 150px;"
                    size="small"
                  />
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="submitOrderFeedback(order)"
                    :loading="order.submitting"
                    style="margin-left: 10px;"
                  >
                    提交反馈
                  </el-button>
                </div>
              </div>
              
              <el-table 
                :data="order.plans" 
                style="width: 100%"
                v-loading="loading"
                border
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="setCount" label="台份" width="100">
                  <template #default="scope">
                    {{ scope.row.setCount || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="drawingNo" label="图号" width="120">
                  <template #default="scope">
                    {{ scope.row.drawingNo || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="materialCode" label="物料编码" width="120" />
                <el-table-column prop="materialDesc" label="物料描述" width="150" />
                <el-table-column prop="planClass" label="计划分类" width="140" />
                <el-table-column prop="sfzz" label="是否自制" width="100">
                  <template #default="scope">
                    {{ scope.row.sfzz || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="计划数量" width="100">
                  <template #default="scope">
                    {{ Number(scope.row.quantity || 0).toFixed(2) }} {{ scope.row.unit }}
                  </template>
                </el-table-column>
                <el-table-column prop="plannedDate" label="计划交付日期" width="120">
                  <template #default="scope">
                    {{ scope.row.plannedDate ? formatDateOnly(scope.row.plannedDate) : '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="progressStatus" label="进展状态" width="120">
                  <template #default="scope">
                    <el-select 
                      v-model="scope.row.progressStatus" 
                      placeholder="请选择"
                      size="small"
                      style="width: 100%"
                      @change="(val: string) => handleProgressStatusChange(val, scope.row)"
                    >
                      <el-option label="未开始" value="未开始" />
                      <el-option label="进行中" value="进行中" />
                      <el-option label="已完成" value="已完成" />
                      <el-option label="已延期" value="已延期" />
                      <el-option label="已取消" value="已取消" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="完成数量" width="120">
                  <template #default="scope">
                    <el-input-number 
                      v-model="scope.row.finishedQuantity" 
                      :min="0" 
                      :max="scope.row.quantity"
                      size="small"
                      style="width: 100%"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="实际交付日期" width="160">
                  <template #default="scope">
                    <el-date-picker 
                      v-model="scope.row.actualDeliveryDate" 
                      type="date"
                      placeholder="选择日期"
                      size="small"
                      style="width: 100%"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="备注" min-width="150">
                  <template #default="scope">
                    <el-input 
                      v-model="scope.row.remarks" 
                      placeholder="请输入备注"
                      size="small"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </el-card>
      </div>
      
      <div class="pagination-container" v-if="pagination.total > 0">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { 
  Search, 
  Refresh, 
  Document, 
  CircleCheck, 
  Clock, 
  Warning,
  User,
  OfficeBuilding,
  Download,
  Upload
} from '@element-plus/icons-vue';
import { progressFeedbackApi } from '../api';
import axios from 'axios';

const loading = ref(false);
const orderList = ref<any[]>([]);
const expandedOrders = ref<number[]>([]);
const batchImportInput = ref<HTMLInputElement | null>(null);

const selectedOrders = computed(() => {
  return orderList.value.filter(order => order.selected);
});

const searchForm = reactive({
  djbH: '',
  statusFilter: ['未开始', '进行中', '已延期', '已取消'] as string[]
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const statistics = ref({
  total: 0,
  completed: 0,
  inProgress: 0,
  delayed: 0
});

const getFeedbackStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success',
    '已延期': 'danger'
  };
  return typeMap[status] || 'info';
};

const formatDateOnly = (date: string | Date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const handleProgressStatusChange = (value: string, row: any) => {
  if (value === '已完成') {
    row.actualDeliveryDate = new Date();
    row.finishedQuantity = row.quantity || 0;
  }
};

const getCurrentCycle = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}W${weekNumber.toString().padStart(2, '0')}`;
};

const toggleOrderExpand = async (orderId: number) => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
};

const submitOrderFeedback = async (order: any) => {
  try {
    if (!order.feedbackCycle) {
      ElMessage.warning('请填写反馈周期');
      return;
    }
    
    order.submitting = true;
    
    const feedbackItems = order.plans.map((plan: any) => ({
      productionPlanId: plan.id,
      purchaseDetailsId: plan.purchaseDetailsId,
      materialCode: plan.materialCode,
      materialDesc: plan.materialDesc,
      planQuantity: plan.quantity,
      unit: plan.unit,
      finishedQuantity: plan.finishedQuantity || 0,
      defectQuantity: plan.defectQuantity || 0,
      actualDeliveryDate: plan.actualDeliveryDate,
      progressStatus: plan.progressStatus || '未开始',
      remarks: plan.remarks || '',
      supplierCode: order.supplierCode || 'SUPPLIER001'
    }));
    
    await progressFeedbackApi.submit({
      feedbackCycle: order.feedbackCycle,
      feedbackItems,
      creator: 'admin'
    });
    
    ElMessage.success('反馈提交成功');
    
    order.plans.forEach((plan: any) => {
      plan.finishedQuantity = 0;
      plan.defectQuantity = 0;
      plan.actualDeliveryDate = null;
      plan.remarks = '';
    });
    
    await loadStatistics();
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    ElMessage.error('反馈提交失败');
  } finally {
    order.submitting = false;
  }
};

const handleSearch = () => {
  pagination.currentPage = 1;
  loadOrderList();
};

const resetSearch = () => {
  searchForm.djbH = '';
  searchForm.statusFilter = ['未开始', '进行中', '已延期', '已取消'];
  pagination.currentPage = 1;
  loadOrderList();
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  loadOrderList();
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  loadOrderList();
};

const loadOrderList = async () => {
  try {
    loading.value = true;
    
    const params: any = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    
    if (searchForm.djbH) {
      params.djbH = searchForm.djbH;
    }
    
    if (searchForm.statusFilter && searchForm.statusFilter.length > 0) {
      params.statusFilter = searchForm.statusFilter.join(',');
    }
    
    const response: any = await progressFeedbackApi.getOrdersWithPlans(params);
    orderList.value = (response.data || []).map((order: any) => ({
      ...order,
      selected: false,
      feedbackCycle: getCurrentCycle(),
      submitting: false,
      plans: order.plans.map((plan: any) => ({
        ...plan,
        finishedQuantity: plan.finishedQuantity || 0,
        defectQuantity: plan.defectQuantity || 0,
        actualDeliveryDate: plan.actualDeliveryDate || null,
        progressStatus: plan.progressStatus || '未开始',
        remarks: plan.remarks || ''
      }))
    }));
    pagination.total = response.total || 0;
  } catch (error) {
    console.error('Failed to load order list:', error);
    ElMessage.error('加载订单列表失败');
  } finally {
    loading.value = false;
  }
};

const loadStatistics = async () => {
  try {
    const response: any = await progressFeedbackApi.getStatistics({});
    statistics.value = response;
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
};

const handleOrderSelect = (_order: any) => {
  // 复选框状态已通过v-model自动更新
};

const handleBatchExport = async () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择要导出的订单');
    return;
  }
  
  try {
    ElMessage.info('正在导出...');
    
    const djbHList = selectedOrders.value.map(order => order.djbH);
    
    const response = await axios.post('/api/excel/export/batch', { djbHList }, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `feedback_batch_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('Batch export failed:', error);
    ElMessage.error('批量导出失败');
  }
};

const triggerBatchImport = () => {
  if (batchImportInput.value) {
    batchImportInput.value.click();
  }
};

const handleBatchImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;
  
  try {
    ElMessage.info('正在导入...');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('creator', 'admin');
    
    const response = await axios.post('/api/excel/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const result = response.data;
    
    if (result.success > 0) {
      ElMessage.success(`导入成功 ${result.success} 条记录`);
    }
    
    if (result.failed > 0) {
      ElMessage.warning(`${result.failed} 条记录导入失败，请查看错误信息`);
      console.error('Import errors:', result.errors);
    }
    
    await loadOrderList();
    await loadStatistics();
  } catch (error: any) {
    console.error('Import failed:', error);
    const errorMsg = error.response?.data?.message || '导入失败';
    ElMessage.error(errorMsg);
  } finally {
    input.value = '';
  }
};

onMounted(() => {
  loadOrderList();
  loadStatistics();
});
</script>

<style scoped>
.progress-feedback-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.progress-feedback-container h2 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.statistics-section {
  margin-bottom: 20px;
}

.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.order-list-section {
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.order-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.order-basic-info {
  flex: 1;
}

.order-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.order-no {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.order-meta {
  display: flex;
  gap: 20px;
  color: #606266;
  font-size: 14px;
}

.order-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.order-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.order-details {
  padding-top: 10px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.details-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.feedback-cycle-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
