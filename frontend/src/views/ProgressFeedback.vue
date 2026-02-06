<template>
  <div class="progress-feedback-container">
    <h2>计划进度反馈管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.orderNo" placeholder="请输入订单编号" />
          </el-form-item>
          
          <el-form-item label="物料图号">
            <el-input v-model="searchForm.materialCode" placeholder="请输入物料图号" />
          </el-form-item>
          
          <el-form-item label="项目">
            <el-input v-model="searchForm.project" placeholder="请输入项目" />
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
    
    <!-- 双表布局 -->
    <div class="dual-table-layout">
      <!-- 采购订单主表（极简化，导航功能） -->
      <div class="primary-table-container">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>采购订单导航</span>
            </div>
          </template>
          
          <el-table 
            :data="orderList" 
            style="width: 100%"
            @row-click="handleOrderSelect"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="订单信息" width="300">
              <template #default="scope">
                <div class="order-info-cell">
                  <div class="order-info-item">
                    <span class="order-info-label">订单编号:</span>
                    <span class="order-info-value">{{ scope.row.orderNo }}</span>
                  </div>
                  <div class="order-info-item">
                    <span class="order-info-label">项目:</span>
                    <span class="order-info-value">{{ scope.row.project }}</span>
                  </div>
                  <div class="order-info-item">
                    <span class="order-info-label">台份:</span>
                    <span class="order-info-value">{{ scope.row.setCount }}</span>
                  </div>
                  <div class="order-info-item">
                    <span class="order-info-label">状态:</span>
                    <el-tag :type="getStatusType(scope.row.status)" size="small">
                      {{ getStatusText(scope.row.status) }}
                    </el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </div>
      
      <!-- 采购订单明细副表（主要表单，所有交互） -->
      <div class="secondary-table-container">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>采购订单明细反馈表</span>
              <div class="header-actions">
                <el-button size="small" type="primary" @click="handleSubmitFeedback" v-if="selectedOrder">提交反馈</el-button>
              </div>
            </div>
          </template>
          
          <div v-if="selectedOrder">
            <!-- 宽表：purchase_details与production_plan组成 -->
            <div class="wide-table-container">
              <el-table :data="wideTableData" style="width: 100%" v-loading="wideTableLoading">
                <el-table-column prop="materialCode" label="物料图号" width="180" />
                <el-table-column prop="materialDesc" label="物料名称" width="200" />
                <el-table-column prop="quantity" label="数量" width="100" />
                <el-table-column prop="drawingNo" label="图号" width="150" />
                <el-table-column prop="purchasePlanDate" label="采购计划日期" width="180" />
                <el-table-column prop="productionPlanDate" label="生产计划日期" width="180" />
                <el-table-column prop="planStatus" label="计划状态" width="120">
                  <template #default="scope">
                    <el-select v-model="scope.row.planStatus" placeholder="请选择计划状态" @change="handlePlanStatusChange(scope.row)">
                      <el-option label="待处理" value="待处理" />
                      <el-option label="处理中" value="处理中" />
                      <el-option label="已完成" value="已完成" />
                      <el-option label="未知" value="未知" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                  <template #default="scope">
                    <el-input v-model="scope.row.remarks" placeholder="请输入备注" @change="handleRemarksChange(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          
          <div v-else class="no-selection">
            <p>请从左侧选择一个订单进行反馈</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { purchaseOrderApi } from '../api';

const selectedOrder = ref<any>(null);
const orderList = ref<any[]>([]);
const detailsLoading = ref(false);
const wideTableData = ref<any[]>([]);
const wideTableLoading = ref(false);

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  materialCode: '',
  project: '',
  status: ''
});

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
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

// 存储变更的数据
const changes = ref<any[]>([]);

// 处理计划状态变更
const handlePlanStatusChange = (row: any) => {
  console.log('Plan status changed:', row);
  // 检查是否已经存在该物料的变更
  const existingChangeIndex = changes.value.findIndex(change => change.materialCode === row.materialCode);
  if (existingChangeIndex >= 0) {
    // 更新现有变更
    changes.value[existingChangeIndex].planStatus = row.planStatus;
  } else {
    // 添加新变更
    changes.value.push({
      materialCode: row.materialCode,
      planStatus: row.planStatus,
      remarks: row.remarks
    });
  }
  ElMessage.info('计划状态已暂存，点击"提交反馈"按钮保存');
};

// 处理备注变更
const handleRemarksChange = (row: any) => {
  console.log('Remarks changed:', row);
  // 检查是否已经存在该物料的变更
  const existingChangeIndex = changes.value.findIndex(change => change.materialCode === row.materialCode);
  if (existingChangeIndex >= 0) {
    // 更新现有变更
    changes.value[existingChangeIndex].remarks = row.remarks;
  } else {
    // 添加新变更
    changes.value.push({
      materialCode: row.materialCode,
      planStatus: row.planStatus,
      remarks: row.remarks
    });
  }
  ElMessage.info('备注已暂存，点击"提交反馈"按钮保存');
};

// 提交反馈
const handleSubmitFeedback = async () => {
  if (!selectedOrder.value) {
    ElMessage.warning('请选择一个订单进行反馈');
    return;
  }
  
  if (changes.value.length === 0) {
    ElMessage.warning('没有需要提交的变更');
    return;
  }
  
  try {
    // 批量提交所有变更
    for (const change of changes.value) {
      // 更新计划状态
      if (change.planStatus) {
        await purchaseOrderApi.updatePlanStatus({
          materialCode: change.materialCode,
          planStatus: change.planStatus
        });
      }
      // 更新备注
      if (change.remarks !== undefined) {
        await purchaseOrderApi.updateRemarks({
          materialCode: change.materialCode,
          remarks: change.remarks
        });
      }
    }
    
    ElMessage.success('反馈提交成功');
    // 清空变更记录
    changes.value = [];
    // 重新加载数据
    await loadWideTableData(selectedOrder.value.id);
  } catch (error) {
    console.error('Submit feedback error:', error);
    ElMessage.error('反馈提交失败');
  }
};

const handleSearch = async () => {
  try {
    // 构建搜索参数
    const searchParams = {
      orderNo: searchForm.orderNo,
      materialCode: searchForm.materialCode,
      project: searchForm.project,
      status: searchForm.status,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    
    // 调用后端API获取采购订单列表
    const response = await purchaseOrderApi.getList(searchParams);
    
    // 转换后端返回的数据结构
    orderList.value = (response.data || []).map((order: any) => ({
      id: order.id,
      orderNo: order.djbH, // 使用订单编号
      project: order.project, // 使用项目
      setCount: order.setCount, // 使用台份
      status: order.orderStatus || 'pending' // 使用订单状态
    }));
    
    pagination.total = response.total || 0;
    ElMessage.success('搜索成功');
  } catch (error) {
    console.error('Search purchase order error:', error);
    ElMessage.error('搜索失败');
  }
};

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = '';
  });
  pagination.currentPage = 1;
  handleSearch();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  handleSearch();
};

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current;
  handleSearch();
};

// 订单选择
const handleOrderSelect = async (row: any) => {
  selectedOrder.value = row;
  // 清空之前的变更记录
  changes.value = [];
  
  // 加载宽表数据
  await loadWideTableData(row.id);
};

// 加载宽表数据
const loadWideTableData = async (orderId: string) => {
  wideTableLoading.value = true;
  try {
    // 调用后端API获取宽表数据
    const response = await purchaseOrderApi.getWideTableData(parseInt(orderId));
    wideTableData.value = response.data || [];
  } catch (error) {
    console.error('Load wide table data error:', error);
    ElMessage.error('加载宽表数据失败');
    wideTableData.value = [];
  } finally {
    wideTableLoading.value = false;
  }
};

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
  return selectedOrder.value?.id === row.id ? 'selected-row' : '';
};

// 初始化
onMounted(async () => {
  try {
    await handleSearch();
  } catch (error) {
    console.error('Initialize error:', error);
  }
});
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
  flex-wrap: wrap;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 双表布局 */
.dual-table-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.primary-table-container {
  min-width: 300px;
  max-width: 320px;
}

.secondary-table-container {
  flex: 1;
}

/* 订单信息单元格样式 */
.order-info-cell {
  padding: 8px;
}

.order-info-item {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

.order-info-item:last-child {
  margin-bottom: 0;
}

.order-info-label {
  font-weight: 500;
  margin-right: 8px;
  min-width: 60px;
  font-size: 12px;
}

.order-info-value {
  font-size: 12px;
  color: #333;
  word-break: break-all;
}

/* 选中行样式 */
:deep(.selected-row) {
  background-color: #e6f7ff !important;
}

:deep(.el-table__row:hover) {
  background-color: #f0f9ff !important;
}

.no-selection {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .dual-table-layout {
    grid-template-columns: 1fr;
  }
  
  .primary-table-container {
    min-width: auto;
    max-width: 100%;
  }
}
</style>
