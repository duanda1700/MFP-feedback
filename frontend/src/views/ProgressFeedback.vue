<template>
  <div class="progress-feedback-container">
    <h2>计划进度反馈管理</h2>
    
    <!-- 顶部筛选栏 -->
    <div class="filter-section">
      <el-card shadow="hover">
        <el-form :inline="true" :model="searchForm" class="filter-form">
          <el-form-item label="订单编号">
            <el-input 
              v-model="searchForm.orderNo" 
              placeholder="请输入订单编号" 
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          
          <el-form-item label="反馈状态">
            <el-select 
              v-model="searchForm.feedbackStatus" 
              placeholder="请选择状态"
              clearable
              @change="handleSearch"
            >
              <el-option label="未开始" value="未开始" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已延期" value="已延期" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="handleSearch"
            />
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
        </el-form>
      </el-card>
    </div>
    
    <!-- 底部统计区 -->
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
                <div class="stat-value">{{ statistics.pending }}</div>
                <div class="stat-label">待处理</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 订单列表区 -->
    <div class="order-list-section">
      <div v-if="orderList.length === 0" class="empty-state">
        <el-empty description="暂无订单数据" />
      </div>
      
      <div v-else class="order-cards">
        <el-card 
          v-for="order in orderList" 
          :key="order.id"
          shadow="hover"
          class="order-card"
          :class="{ 'expanded': expandedOrders.includes(order.id) }"
        >
          <!-- 订单卡片头部 -->
          <div class="order-card-header" @click="toggleOrderExpand(order.id)">
            <div class="order-basic-info">
              <div class="order-title">
                <el-tag :type="getFeedbackStatusType(order.feedbackStatus)" size="large">
                  {{ order.feedbackStatus }}
                </el-tag>
                <span class="order-no">{{ order.djbH }}</span>
              </div>
              <div class="order-meta">
                <span><el-icon><User /></el-icon> {{ order.purchaseManager || '-' }}</span>
                <span><el-icon><OfficeBuilding /></el-icon> {{ order.supplierName || '-' }}</span>
                <span><el-icon><Folder /></el-icon> {{ order.project || '-' }}</span>
              </div>
            </div>
            
            <div class="order-progress">
              <div class="progress-label">
                <span>进度概览</span>
                <span class="progress-text">{{ getOrderProgress(order).toFixed(0) }}%</span>
              </div>
              <el-progress 
                :percentage="getOrderProgress(order)" 
                :color="getProgressColor(order.feedbackStatus)"
                :stroke-width="10"
              />
            </div>
            
            <div class="order-actions">
              <el-button 
                :icon="expandedOrders.includes(order.id) ? 'ArrowUp' : 'ArrowDown'" 
                circle
                @click.stop="toggleOrderExpand(order.id)"
              />
            </div>
          </div>
          
          <!-- 订单明细（展开后显示） -->
          <el-collapse-transition>
            <div v-show="expandedOrders.includes(order.id)" class="order-details">
              <el-divider />
              <div class="details-header">
                <h4>生产计划明细</h4>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="handleSubmitFeedback(order)"
                  :loading="submitting"
                >
                  提交反馈
                </el-button>
              </div>
              
              <el-table 
                :data="order.plans" 
                style="width: 100%"
                v-loading="loading"
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="materialCode" label="物料图号" width="150" />
                <el-table-column prop="materialDesc" label="物料名称" width="200" />
                <el-table-column prop="quantity" label="数量" width="80" />
                <el-table-column prop="planClass" label="计划分类" width="120" />
                <el-table-column prop="planStatus" label="计划状态" width="120">
                  <template #default="scope">
                    <el-select 
                      v-model="scope.row.planStatus" 
                      size="small"
                      @change="handlePlanStatusChange(scope.row, order)"
                    >
                      <el-option label="待确认" value="待确认" />
                      <el-option label="已确认" value="已确认" />
                      <el-option label="进行中" value="进行中" />
                      <el-option label="已完成" value="已完成" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="finishedQuantity" label="完成数量" width="120">
                  <template #default="scope">
                    <el-input-number 
                      v-model="scope.row.finishedQuantity" 
                      :min="0" 
                      :max="scope.row.quantity"
                      size="small"
                      @change="handleFinishedQuantityChange(scope.row, order)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="进度" width="150">
                  <template #default="scope">
                    <el-progress 
                      :percentage="getPlanProgress(scope.row)" 
                      :color="getProgressColor(scope.row.planStatus)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                  <template #default="scope">
                    <el-input 
                      v-model="scope.row.remarks" 
                      size="small"
                      placeholder="请输入备注"
                      @change="handleRemarksChange(scope.row, order)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </el-card>
      </div>
      
      <!-- 分页 -->
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
  Folder
} from '@element-plus/icons-vue';
import { purchaseOrderApi, supplierApi } from '../api';

const loading = ref(false);
const submitting = ref(false);
const orderList = ref<any[]>([]);
const expandedOrders = ref<number[]>([]);

const searchForm = reactive({
  orderNo: '',
  feedbackStatus: '',
  dateRange: null as any
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const statistics = computed(() => {
  const total = pagination.total;
  const completed = orderList.value.filter(o => o.feedbackStatus === '已完成').length;
  const inProgress = orderList.value.filter(o => o.feedbackStatus === '进行中').length;
  const pending = orderList.value.filter(o => o.feedbackStatus === '未开始').length;
  
  return { total, completed, inProgress, pending };
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

const getProgressColor = (status: string) => {
  const colorMap: Record<string, string> = {
    '未开始': '#909399',
    '进行中': '#E6A23C',
    '已完成': '#67C23A',
    '已延期': '#F56C6C',
    '待确认': '#909399',
    '已确认': '#409EFF'
  };
  return colorMap[status] || '#409EFF';
};

const getOrderProgress = (order: any) => {
  if (!order.plans || order.plans.length === 0) return 0;
  const totalProgress = order.plans.reduce((sum: number, plan: any) => {
    return sum + getPlanProgress(plan);
  }, 0);
  return totalProgress / order.plans.length;
};

const getPlanProgress = (plan: any) => {
  if (!plan.quantity || plan.quantity === 0) return 0;
  const finished = plan.finishedQuantity || 0;
  return Math.min((finished / plan.quantity) * 100, 100);
};

const toggleOrderExpand = async (orderId: number) => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1);
  } else {
    expandedOrders.value.push(orderId);
    const order = orderList.value.find(o => o.id === orderId);
    if (order && !order.plans) {
      await loadOrderPlans(order);
    }
  }
};

const loadOrderPlans = async (order: any) => {
  try {
    loading.value = true;
    const response: any = await supplierApi.getOrderPlans(order.id.toString(), {
      page: 1,
      pageSize: 100
    });
    order.plans = response.data || [];
  } catch (error) {
    console.error('Failed to load order plans:', error);
    ElMessage.error('加载订单计划失败');
  } finally {
    loading.value = false;
  }
};

const handlePlanStatusChange = (plan: any, order: any) => {
  console.log('Plan status changed:', plan);
  updateOrderFeedbackStatus(order);
};

const handleFinishedQuantityChange = (plan: any, order: any) => {
  console.log('Finished quantity changed:', plan);
  updateOrderFeedbackStatus(order);
};

const handleRemarksChange = (plan: any, order: any) => {
  console.log('Remarks changed:', plan);
};

const updateOrderFeedbackStatus = (order: any) => {
  if (!order.plans || order.plans.length === 0) return;
  
  const allCompleted = order.plans.every((p: any) => p.planStatus === '已完成');
  const anyInProgress = order.plans.some((p: any) => 
    p.planStatus === '进行中' || p.planStatus === '已确认'
  );
  
  if (allCompleted) {
    order.feedbackStatus = '已完成';
  } else if (anyInProgress) {
    order.feedbackStatus = '进行中';
  } else {
    order.feedbackStatus = '未开始';
  }
};

const handleSubmitFeedback = async (order: any) => {
  try {
    submitting.value = true;
    
    const response: any = await purchaseOrderApi.updateOrder(order.id, {
      feedbackStatus: order.feedbackStatus
    });
    
    ElMessage.success('反馈提交成功');
    await loadOrders();
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    ElMessage.error('反馈提交失败');
  } finally {
    submitting.value = false;
  }
};

const handleSearch = () => {
  pagination.currentPage = 1;
  loadOrders();
};

const resetSearch = () => {
  searchForm.orderNo = '';
  searchForm.feedbackStatus = '';
  searchForm.dateRange = null;
  pagination.currentPage = 1;
  loadOrders();
};

const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  loadOrders();
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  loadOrders();
};

const loadOrders = async () => {
  try {
    loading.value = true;
    
    const params: any = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    
    if (searchForm.orderNo) {
      params.djbH = searchForm.orderNo;
    }
    
    if (searchForm.feedbackStatus) {
      params.feedbackStatus = searchForm.feedbackStatus;
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0];
      params.endDate = searchForm.dateRange[1];
    }
    
    const response: any = await purchaseOrderApi.getList(params);
    orderList.value = (response.data || []).map((order: any) => ({
      ...order,
      plans: null
    }));
    pagination.total = response.total || 0;
  } catch (error) {
    console.error('Failed to load orders:', error);
    ElMessage.error('加载订单列表失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadOrders();
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

/* 筛选区域 */
.filter-section {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 统计区域 */
.statistics-section {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

/* 订单列表区域 */
.order-list-section {
  min-height: 400px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.order-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-card.expanded {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 订单卡片头部 */
.order-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.order-card-header:hover {
  background-color: #f5f7fa;
}

.order-basic-info {
  flex: 1;
}

.order-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.order-no {
  font-size: 18px;
  font-weight: 600;
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

.order-progress {
  flex: 1;
  max-width: 300px;
  margin: 0 20px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.progress-text {
  font-weight: 600;
  color: #409EFF;
}

.order-actions {
  margin-left: 20px;
}

/* 订单明细 */
.order-details {
  padding: 0 15px 15px;
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

/* 分页 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-feedback-container {
    padding: 10px;
  }
  
  .filter-form {
    flex-direction: column;
  }
  
  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-progress {
    width: 100%;
    max-width: none;
    margin: 15px 0;
  }
  
  .order-actions {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .order-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
  }
}

/* 动画效果 */
.el-collapse-transition {
  transition: all 0.3s ease;
}

.order-card {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
