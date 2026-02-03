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
        action="/api/production-plan/import"
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
          
          <el-form-item label="申请人">
            <el-input v-model="searchForm.applyUsername" placeholder="请输入申请人" />
          </el-form-item>
          
          <el-form-item label="申请部门">
            <el-input v-model="searchForm.applyDept" placeholder="请输入申请部门" />
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="searchForm.orderStatus" placeholder="请选择状态">
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
    
    <!-- 计划列表 -->
    <div class="plan-list-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>生产计划列表</span>
          </div>
        </template>
        
        <el-table :data="planList" style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="订单ID" width="100" />
          <el-table-column prop="djbH" label="订单编号" />
          <el-table-column prop="applyUsername" label="申请人" />
          <el-table-column prop="applyDept" label="申请部门" />
          <el-table-column prop="major" label="专业" width="100" />
          <el-table-column prop="project" label="项目" width="180" />
          <el-table-column prop="supplierName" label="供应商" />
          <el-table-column prop="orderStatus" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.orderStatus)">
                {{ getStatusText(scope.row.orderStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="setCount" label="台份" width="100" />
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="scope">
              <div class="action-buttons">
                <el-button size="small" @click="handleViewDetail(scope.row)">详情</el-button>
                <el-button size="small" type="primary" @click="handleEditPlan(scope.row)">编辑</el-button>
                <el-button size="small" type="success" @click="handleSubmitApproval(scope.row)" v-if="scope.row.orderStatus === '待处理'">提交审批</el-button>
              </div>
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
  </div>

  <!-- 编辑计划对话框（二级页面） -->
  <el-dialog v-model="editDialogVisible" title="编辑计划 - 采购明细" width="80%" :before-close="handleCloseDialog">
    <div class="purchase-details-container">
      <h3>采购明细列表</h3>
      <el-table :data="purchaseDetailsList" style="width: 100%">
        <el-table-column prop="id" label="明细ID" width="100" />
        <el-table-column prop="materialCode" label="物料编码" />
        <el-table-column prop="materialDesc" label="物料描述" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="planDate" label="计划日期" width="180" />
        <el-table-column prop="planNo" label="计划编号" />
        <el-table-column prop="productType" label="产品类型" />
        <el-table-column prop="orderNo" label="订单编号" />
        <el-table-column prop="detailStatus" label="明细状态" width="120">
          <template #default="scope">
            <el-tag :type="getDetailStatusType(scope.row.detailStatus)">
              {{ scope.row.detailStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElUpload, ElDialog } from 'element-plus';
import { productionPlanApi, purchaseOrderApi } from '../api';

const uploadRef = ref<InstanceType<typeof ElUpload>>();
const editDialogVisible = ref(false);
const currentOrder = ref<any>(null);
const purchaseDetailsList = ref<any[]>([]);

const searchForm = reactive({
  djbH: '',
  applyUsername: '',
  applyDept: '',
  orderStatus: '',
  setCount: ''
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 生产计划列表
const planList = ref<any[]>([]);

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
    // 调用后端API获取生产计划列表
    const response = await productionPlanApi.getList({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    planList.value = response.data || [];
    pagination.total = response.total || 0;
    ElMessage.success('搜索成功');
  } catch (error) {
    console.error('Search production plan error:', error);
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

const handleViewDetail = (row: any) => {
  console.log('View detail:', row);
  // 跳转到详情页
};

const handleEditPlan = async (row: any) => {
  currentOrder.value = row;
  editDialogVisible.value = true;
  // 获取采购明细数据
  await loadPurchaseDetails(row.id);
};

const loadPurchaseDetails = async (orderId: string) => {
  try {
    // 调用后端API获取采购明细
    const response = await purchaseOrderApi.getDetail(orderId);
    purchaseDetailsList.value = response.details || [];
  } catch (error) {
    console.error('Load purchase details error:', error);
    ElMessage.error('获取采购明细失败');
  }
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

const handleCloseDialog = () => {
  editDialogVisible.value = false;
  currentOrder.value = null;
  purchaseDetailsList.value = [];
};

const saveEdit = () => {
  // 这里应该保存编辑内容
  ElMessage.success('保存成功');
  editDialogVisible.value = false;
  currentOrder.value = null;
  purchaseDetailsList.value = [];
};

const handleSubmitApproval = async (row: any) => {
  try {
    await productionPlanApi.submitApproval(row.id);
    ElMessage.success('提交审批成功');
    handleSearch();
  } catch (error) {
    console.error('Submit approval error:', error);
    ElMessage.error('提交审批失败');
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
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.purchase-details-container {
  margin-bottom: 20px;
}

.purchase-details-container h3 {
  margin-bottom: 16px;
  color: #333;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>