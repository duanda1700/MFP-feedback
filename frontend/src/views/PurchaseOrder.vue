<template>
  <div class="purchase-order-container">
    <h2>采购订单外发管理</h2>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleSyncERP" :loading="syncLoading">
        <el-icon><Refresh /></el-icon>
        同步ERP数据
      </el-button>
      <el-button type="success" @click="handleRefresh">
        <el-icon><View /></el-icon>
        刷新列表
      </el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.djbH" placeholder="请输入订单编号" />
          </el-form-item>
          
          <el-form-item label="申请人">
            <el-input v-model="searchForm.applyUsername" placeholder="请输入申请人" />
          </el-form-item>
          
          <el-form-item label="申请部门">
            <el-input v-model="searchForm.applyDept" placeholder="请输入申请部门" />
          </el-form-item>
          
          <el-form-item label="供应商">
            <el-select v-model="searchForm.supplierId" placeholder="请选择供应商">
              <el-option v-for="supplier in supplierList" :key="supplier.id" :label="supplier.name" :value="supplier.id" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态">
              <el-option label="待处理" value="待处理" />
              <el-option label="处理中" value="处理中" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="台份">
            <el-input v-model="searchForm.setCount" placeholder="请输入台份" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 订单列表 -->
    <div class="order-list-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>采购订单列表</span>
            <div class="header-actions">
              <el-button type="primary" @click="handleBatchIssueTask" :disabled="selectedRows.length === 0">
                批量下发任务
              </el-button>
              <el-button type="warning" @click="exportOrderList">
                导出订单
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="orderList" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="订单ID" width="100" />
          <el-table-column prop="djbH" label="订单编号" />
          <el-table-column prop="applyUsername" label="申请人" />
          <el-table-column prop="applyDept" label="申请部门" />
          <el-table-column prop="major" label="专业" width="100" />
          <el-table-column prop="project" label="项目" width="180" />
          <el-table-column prop="supplierName" label="供应商" />
          <el-table-column prop="orderStatus" label="订单状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.orderStatus)">
                {{ getStatusText(scope.row.orderStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="setCount" label="台份" width="100" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleViewDetail(scope.row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSingleIssueTask(scope.row)">下发</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
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
      </el-card>
    </div>
    
    <!-- 任务下发对话框 -->
    <el-dialog v-model="issueTaskDialogVisible" title="下发任务" width="600px">
      <el-form :model="issueTaskForm" :rules="issueTaskRules" ref="issueTaskFormRef" label-width="120px">
        <el-form-item label="选择供应商">
          <el-select v-model="issueTaskForm.supplierId" placeholder="请选择供应商" style="width: 100%">
            <el-option v-for="supplier in supplierList" :key="supplier.id" :label="supplier.name" :value="supplier.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="下发说明">
          <el-input v-model="issueTaskForm.description" type="textarea" placeholder="请输入下发说明" />
        </el-form-item>
        <el-form-item label="计划完成时间">
          <el-date-picker v-model="issueTaskForm.dueDate" type="date" placeholder="请选择计划完成时间" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="issueTaskDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmIssueTask" :loading="issueTaskLoading">确认下发</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <div class="order-detail-wrapper" v-if="detailDialogVisible">
      <!-- 遮罩层 -->
      <div class="order-detail-overlay" @click="detailDialogVisible = false"></div>
      <!-- 详情面板 -->
      <div class="order-detail-panel">
        <div class="order-detail-header-panel">
          <h3>采购订单明细</h3>
          <el-button type="text" @click="detailDialogVisible = false" class="close-btn">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        
        <div class="order-detail-content">
          <div class="order-detail-header">
            <div class="detail-info">
              <span class="info-item">订单编号: {{ currentOrder?.djbH }}</span>
              <span class="info-item">申请人: {{ currentOrder?.applyUsername }}</span>
              <span class="info-item">申请部门: {{ currentOrder?.applyDept }}</span>
              <span class="info-item">供应商: {{ currentOrder?.supplierName }}</span>
              <span class="info-item">订单状态: <el-tag :type="getStatusType(currentOrder?.orderStatus)">{{ getStatusText(currentOrder?.orderStatus) }}</el-tag></span>
            </div>
          </div>
          
          <div class="detail-list-container">
            <el-table :data="orderDetails" style="width: 100%" :loading="detailLoading">
              <el-table-column prop="id" label="明细ID" width="120" />
              <el-table-column prop="bpm_cgdd_instance_id" label="采购订单实例ID" width="200" />
              <el-table-column prop="material_code" label="物料编码" />
              <el-table-column prop="material_name" label="物料名称" />
              <el-table-column prop="specification" label="规格型号" width="180" />
              <el-table-column prop="unit" label="单位" width="80" />
              <el-table-column prop="quantity" label="数量" width="100" />
              <el-table-column prop="price" label="单价" width="100" />
              <el-table-column prop="amount" label="金额" width="120" />
              <el-table-column prop="delivery_date" label="交货日期" width="150" />
              <el-table-column prop="order_status" label="订单状态" width="120">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.order_status)">
                    {{ getStatusText(scope.row.order_status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div class="order-detail-footer">
            <el-button @click="detailDialogVisible = false">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh, View, Close } from '@element-plus/icons-vue';
import { purchaseOrderApi, supplierApi } from '../api';

// 搜索表单
const searchForm = reactive({
  djbH: '',
  applyUsername: '',
  applyDept: '',
  supplierId: '',
  orderStatus: '',
  setCount: ''
});

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 订单列表
const orderList = ref<any[]>([]);

// 供应商列表
const supplierList = ref([
  { id: '1', name: '供应商A' },
  { id: '2', name: '供应商B' },
  { id: '3', name: '供应商C' }
]);

// 加载状态
const syncLoading = ref(false);
const issueTaskLoading = ref(false);

// 选中的行
const selectedRows = ref<any[]>([]);

// 任务下发对话框
const issueTaskDialogVisible = ref(false);
const issueTaskFormRef = ref();
const issueTaskForm = reactive({
  supplierId: '',
  description: '',
  dueDate: ''
});

// 详情对话框
const detailDialogVisible = ref(false);
const currentOrder = ref<any>(null);
const orderDetails = ref<any[]>([]);
const detailLoading = ref(false);

const issueTaskRules = {
  supplierId: [
    { required: true, message: '请选择供应商', trigger: 'blur' }
  ],
  dueDate: [
    { required: true, message: '请选择计划完成时间', trigger: 'blur' }
  ]
};

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '待处理':
      return 'info';
    case '处理中':
      return 'primary';
    case '已完成':
      return 'success';
    default:
      return 'info';
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  return status;
};

// 同步ERP数据
const handleSyncERP = async () => {
  syncLoading.value = true;
  try {
    // 这里应该调用后端API同步ERP数据
    // await purchaseOrderApi.syncERP();
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟同步过程
    ElMessage.success('ERP数据同步成功');
    handleRefresh();
  } catch (error: any) {
    console.error('Sync ERP error:', error);
    ElMessage.error(error.message || 'ERP数据同步失败');
  } finally {
    syncLoading.value = false;
  }
};

// 刷新列表
const handleRefresh = async () => {
  try {
    // 调用后端API获取采购订单列表
    const response = await purchaseOrderApi.getList({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    orderList.value = response.data || [];
    pagination.total = response.total || 0;
    ElMessage.success('列表刷新成功');
  } catch (error) {
    console.error('Refresh order list error:', error);
    ElMessage.error('列表刷新失败');
  }
};

// 搜索
const handleSearch = async () => {
  try {
    // 调用后端API搜索采购订单
    const response = await purchaseOrderApi.getList({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    orderList.value = response.data || [];
    pagination.total = response.total || 0;
    ElMessage.success('搜索成功');
  } catch (error) {
    console.error('Search purchase order error:', error);
    ElMessage.error('搜索失败');
  }
};

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = '';
  });
  pagination.currentPage = 1;
  handleSearch();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  handleSearch();
};

// 当前页变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current;
  handleSearch();
};



// 查看详情
const handleViewDetail = async (row: any) => {
  currentOrder.value = row;
  detailDialogVisible.value = true;
  
  // 加载采购订单明细数据
  detailLoading.value = true;
  try {
    // 使用bpmCgddInstanceId作为过滤条件（注意：后端实体使用驼峰命名）
    const bpmCgddInstanceId = row.bpmCgddInstanceId || row.bpm_cgdd_instance_id;
    
    if (!bpmCgddInstanceId) {
      ElMessage.warning('订单缺少实例ID，无法加载明细数据');
      orderDetails.value = [];
      return;
    }
    
    // 调用后端API获取采购订单明细
    const response = await purchaseOrderApi.getDetail(row.id.toString());
    orderDetails.value = response.details || [];
  } catch (error) {
    console.error('Load order detail error:', error);
    ElMessage.error('加载明细数据失败');
    orderDetails.value = [];
  } finally {
    detailLoading.value = false;
  }
};

// 选择行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 批量下发任务
const handleBatchIssueTask = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要下发的订单');
    return;
  }
  issueTaskForm.supplierId = selectedRows.value[0].supplierId;
  issueTaskDialogVisible.value = true;
};

// 单个下发任务
const handleSingleIssueTask = (row: any) => {
  selectedRows.value = [row];
  issueTaskForm.supplierId = row.supplierId;
  issueTaskDialogVisible.value = true;
};

// 确认下发任务
const confirmIssueTask = async () => {
  if (!issueTaskFormRef.value) return;
  
  await issueTaskFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      issueTaskLoading.value = true;
      try {
        const ids = selectedRows.value.map(row => row.id);
        await purchaseOrderApi.issueTask({
          ids,
          supplierId: issueTaskForm.supplierId,
          description: issueTaskForm.description,
          dueDate: issueTaskForm.dueDate
        });
        ElMessage.success('任务下发成功');
        issueTaskDialogVisible.value = false;
        handleRefresh();
      } catch (error: any) {
        console.error('Issue task error:', error);
        ElMessage.error(error.message || '任务下发失败');
      } finally {
        issueTaskLoading.value = false;
      }
    }
  });
};

// 导出订单列表
const exportOrderList = async () => {
  try {
    // 这里应该调用后端API导出订单
    // await purchaseOrderApi.exportList(searchForm);
    ElMessage.success('订单导出成功');
  } catch (error: any) {
    console.error('Export order list error:', error);
    ElMessage.error(error.message || '订单导出失败');
  }
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
.purchase-order-container {
  padding: 20px;
}

.purchase-order-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
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
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 自定义详情对话框样式 - 从右侧弹出 */
:deep(.order-detail-dialog) {
  position: fixed !important;
  right: 0 !important;
  top: 0 !important;
  bottom: 0 !important;
  width: 75% !important;
  margin: 0 !important;
  left: auto !important;
  border-radius: 0 !important;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15) !important;
  animation: slide-in-right 0.3s ease-out !important;
}

:deep(.order-detail-dialog) .el-dialog__header {
  border-bottom: 1px solid #ebeef5 !important;
  padding: 20px !important;
}

:deep(.order-detail-dialog) .el-dialog__body {
  padding: 20px !important;
  height: calc(100% - 120px) !important;
  max-height: 70vh !important;
  overflow-y: auto !important;
}

:deep(.order-detail-dialog) .el-dialog__footer {
  border-top: 1px solid #ebeef5 !important;
  padding: 20px !important;
  text-align: right !important;
}

/* 从右侧滑入动画 */
@keyframes slide-in-right {
  from {
    transform: translateX(100%) !important;
    opacity: 0 !important;
  }
  to {
    transform: translateX(0) !important;
    opacity: 1 !important;
  }
}

/* 详情对话框样式 - 从右侧弹出 */
.order-detail-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.order-detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fade-in 0.3s ease-out;
}

.order-detail-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 75%;
  background-color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  animation: slide-in-right 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.order-detail-header-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.order-detail-header-panel h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.close-btn {
  font-size: 16px;
  color: #909399;
}

.close-btn:hover {
  color: #606266;
}

.order-detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-detail-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.info-item {
  font-size: 14px;
  color: #606266;
}

.detail-list-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.order-detail-footer {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  background-color: #fafafa;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 动画效果 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>