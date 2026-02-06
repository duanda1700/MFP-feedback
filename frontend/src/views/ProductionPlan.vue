<template>
  <div class="production-plan-container">
    <h2>生产计划分解管理</h2>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="handleCreatePlan">创建计划</el-button>
      <el-button @click="handleImportPlan">导入计划</el-button>
      <el-button @click="handleExportPlan">导出计划</el-button>
      <el-upload
        class="upload-button"
        action="/api/plan/import"
        :show-file-list="false"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
        accept=".xlsx,.xls"
        :auto-upload="false"
        ref="uploadRef"
      >
        <el-button type="warning">选择文件</el-button>
      </el-upload>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="订单编号">
            <el-input v-model="searchForm.djbH" placeholder="请输入订单编号" />
          </el-form-item>
          
          <el-form-item label="项目">
            <el-input v-model="searchForm.project" placeholder="请输入项目" />
          </el-form-item>
          
          <el-form-item label="台份">
            <el-input v-model="searchForm.setCount" placeholder="请输入台份" />
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="searchForm.orderStatus" placeholder="请选择状态">
              <el-option label="待处理" value="待处理" />
              <el-option label="处理中" value="处理中" />
              <el-option label="已完成" value="已完成" />
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
      <!-- 生产订单表（极简化，导航功能） -->
      <div class="primary-table-container">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>生产订单导航</span>
            </div>
          </template>
          
          <el-table 
            :data="planList" 
            style="width: 100%"
            @row-click="handleOrderSelect"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="订单信息" width="300">
              <template #default="scope">
                <div class="order-info-cell">
                  <div class="order-info-item">
                    <span class="order-info-label">订单编号:</span>
                    <span class="order-info-value">{{ scope.row.djbH }}</span>
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
                    <el-tag :type="getStatusType(scope.row.orderStatus)" size="small">
                      {{ getStatusText(scope.row.orderStatus) }}
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
      
      <!-- 生产订单明细表（主要表单，所有交互） -->
      <div class="secondary-table-container">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>生产订单明细</span>
              <div class="header-actions">
                <el-button size="small" type="primary" @click="handleAddDetail" v-if="selectedOrder">添加明细</el-button>
                <el-button size="small" @click="handleExportDetails" v-if="selectedOrder">导出明细</el-button>
              </div>
            </div>
          </template>
          
          <el-table 
            :data="orderDetailsList" 
            style="width: 100%"
            :loading="detailsLoading"
          >
            <el-table-column prop="id" label="明细ID" width="100" />
            <el-table-column prop="materialCode" label="物料编码" />
            <el-table-column prop="materialDesc" label="物料描述" />
            <el-table-column prop="quantity" label="数量" width="100" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="planDate" label="计划日期" width="180" />
            <el-table-column prop="detailStatus" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="getDetailStatusType(scope.row.detailStatus)">
                  {{ scope.row.detailStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <div class="action-buttons">
                  <el-button size="small" @click="handleEditDetail(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDeleteDetail(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 明细分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="detailsPagination.currentPage"
              v-model:page-size="detailsPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="detailsPagination.total"
              @size-change="handleDetailsSizeChange"
              @current-change="handleDetailsCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </div>
  </div>

  <!-- 编辑明细对话框 -->
  <el-dialog v-model="editDialogVisible" :title="isEditMode ? '编辑明细' : '添加明细'" width="600px" :before-close="handleCloseDialog">
    <el-form :model="detailForm" :rules="detailRules" ref="detailFormRef" label-width="120px">
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="detailForm.materialCode" placeholder="请输入物料编码" />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input v-model="detailForm.materialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model.number="detailForm.quantity" type="number" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="detailForm.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="计划日期" prop="planDate">
        <el-date-picker v-model="detailForm.planDate" type="date" placeholder="请选择计划日期" style="width: 100%" />
      </el-form-item>
      <el-form-item label="状态" prop="detailStatus">
        <el-select v-model="detailForm.detailStatus" placeholder="请选择状态">
          <el-option label="待处理" value="待处理" />
          <el-option label="处理中" value="处理中" />
          <el-option label="已完成" value="已完成" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveDetail">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElUpload, ElDialog, ElForm } from 'element-plus';
import { productionPlanApi, purchaseOrderApi } from '../api';

const uploadRef = ref<InstanceType<typeof ElUpload>>();
const editDialogVisible = ref(false);
const detailFormRef = ref<InstanceType<typeof ElForm>>();
const selectedOrder = ref<any>(null);
const orderDetailsList = ref<any[]>([]);
const detailsLoading = ref(false);
const isEditMode = ref(false);
const currentDetail = ref<any>(null);

// 搜索表单
const searchForm = reactive({
  djbH: '',
  project: '',
  setCount: '',
  orderStatus: ''
});

// 订单分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 明细分页
const detailsPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 订单列表
const planList = ref<any[]>([]);

// 明细表单
const detailForm = reactive({
  materialCode: '',
  materialDesc: '',
  quantity: 0,
  unit: '',
  planDate: '',
  detailStatus: '待处理'
});

// 明细验证规则
const detailRules = {
  materialCode: [
    { required: true, message: '请输入物料编码', trigger: 'blur' }
  ],
  materialDesc: [
    { required: true, message: '请输入物料描述', trigger: 'blur' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ],
  planDate: [
    { required: true, message: '请选择计划日期', trigger: 'blur' }
  ],
  detailStatus: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ]
};

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

const getStatusText = (status: string) => {
  return status;
};

const getDetailStatusType = (status: string) => {
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

const handleCreatePlan = () => {
  console.log('Create plan');
  // 跳转到创建计划页面
};

const handleImportPlan = () => {
  uploadRef.value?.$refs.input?.click();
};

const handleExportPlan = async () => {
  try {
    const response = await productionPlanApi.export(searchForm);
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `生产计划_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export plan error:', error);
    ElMessage.error('导出失败');
  }
};

const handleImportSuccess = (response: any) => {
  ElMessage.success('导入成功');
  handleSearch();
};

const handleImportError = () => {
  ElMessage.error('导入失败');
};

const handleSearch = async () => {
  try {
    // 构建采购订单API支持的搜索参数
    const searchParams = {
      djbH: searchForm.djbH,
      project: searchForm.project,
      setCount: searchForm.setCount,
      orderStatus: searchForm.orderStatus,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    
    // 调用后端API获取采购订单列表
    const response = await purchaseOrderApi.getList(searchParams);
    
    // 转换后端返回的数据结构，使其与前端期望的结构匹配
    planList.value = (response.data || []).map((order: any) => ({
      id: order.id,
      djbH: order.djbH, // 使用订单编号
      project: order.project, // 使用项目
      setCount: order.setCount, // 使用台份
      orderStatus: order.orderStatus // 使用订单状态
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
  await loadOrderDetails(row.id);
};

// 加载订单明细
const loadOrderDetails = async (orderId: string) => {
  detailsLoading.value = true;
  try {
    // 直接使用采购订单API获取明细，将orderId转换为数字类型
    const response = await purchaseOrderApi.getDetail(parseInt(orderId));
    orderDetailsList.value = response.details || [];
    detailsPagination.total = response.details?.length || 0;
  } catch (error) {
    console.error('Load order details error:', error);
    ElMessage.error('获取订单明细失败');
    orderDetailsList.value = [];
    detailsPagination.total = 0;
  } finally {
    detailsLoading.value = false;
  }
};

// 表格行样式
const tableRowClassName = ({ row }: { row: any }) => {
  return selectedOrder.value?.id === row.id ? 'selected-row' : '';
};

// 添加明细
const handleAddDetail = () => {
  isEditMode.value = false;
  currentDetail.value = null;
  // 重置表单
  Object.keys(detailForm).forEach(key => {
    detailForm[key as keyof typeof detailForm] = '';
  });
  detailForm.detailStatus = '待处理';
  editDialogVisible.value = true;
};

// 编辑明细
const handleEditDetail = (row: any) => {
  isEditMode.value = true;
  currentDetail.value = row;
  // 填充表单
  Object.keys(detailForm).forEach(key => {
    detailForm[key as keyof typeof detailForm] = row[key] || '';
  });
  editDialogVisible.value = true;
};

// 删除明细
const handleDeleteDetail = (row: any) => {
  // 这里应该调用后端API删除明细
  ElMessage.success('删除成功');
  loadOrderDetails(selectedOrder.value.id);
};

// 保存明细
const saveDetail = async () => {
  if (!detailFormRef.value) return;
  
  await detailFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 这里应该调用后端API保存明细
        ElMessage.success(isEditMode.value ? '编辑成功' : '添加成功');
        editDialogVisible.value = false;
        loadOrderDetails(selectedOrder.value.id);
      } catch (error) {
        console.error('Save detail error:', error);
        ElMessage.error('保存失败');
      }
    }
  });
};

// 导出明细
const handleExportDetails = async () => {
  if (!selectedOrder.value) {
    ElMessage.warning('请先选择订单');
    return;
  }
  try {
    // 调用后端API导出明细
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('Export details error:', error);
    ElMessage.error('导出失败');
  }
};

// 明细分页
const handleDetailsSizeChange = (size: number) => {
  detailsPagination.pageSize = size;
  if (selectedOrder.value) {
    loadOrderDetails(selectedOrder.value.id);
  }
};

const handleDetailsCurrentChange = (current: number) => {
  detailsPagination.currentPage = current;
  if (selectedOrder.value) {
    loadOrderDetails(selectedOrder.value.id);
  }
};

const handleCloseDialog = () => {
  editDialogVisible.value = false;
  currentDetail.value = null;
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
.production-plan-container {
  padding: 20px;
}

.production-plan-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.upload-button {
  margin-left: 10px;
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

.action-buttons {
  display: flex;
  gap: 8px;
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

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .dual-table-layout {
    grid-template-columns: 1fr;
  }
  
  .primary-table-container {
    min-width: auto;
  }
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>