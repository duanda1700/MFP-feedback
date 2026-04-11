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
              <el-option label="待下发" value="待下发" />
              <el-option label="有变更" value="有变更" />
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
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleSingleIssueTask(scope.row)">下发</el-button>
              <el-button 
                size="small" 
                type="warning" 
                @click="handleSplitOrder(scope.row)"
                v-if="scope.row.orderStatus === '待下发' && scope.row.orderType !== 'SPLIT'"
              >
                拆分
              </el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Refresh, View } from '@element-plus/icons-vue';
import { purchaseOrderApi } from '../api';

// 路由
const router = useRouter();

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
    case '待下发':
      return 'warning';
    case '有变更':
      return 'danger';
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
    console.log('Search form:', searchForm);
    // 调用后端API获取采购订单列表
    const response = await purchaseOrderApi.getList({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    console.log('Response:', response);
    // 过滤订单状态为"待下发"和"有变更"的行
    orderList.value = (response.data || []).filter((order: any) => {
      console.log('Order status:', order.orderStatus);
      return order.orderStatus === '待下发' || order.orderStatus === '有变更';
    });
    console.log('Filtered orders:', orderList.value);
    pagination.total = orderList.value.length;
    ElMessage.success('列表刷新成功');
  } catch (error) {
    console.error('Refresh order list error:', error);
    ElMessage.error('列表刷新失败');
  }
};

// 搜索
const handleSearch = async () => {
  try {
    console.log('Search form:', searchForm);
    // 调用后端API搜索采购订单
    const response = await purchaseOrderApi.getList({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    console.log('Response:', response);
    // 过滤订单状态为"待下发"和"有变更"的行
    orderList.value = (response.data || []).filter((order: any) => {
      console.log('Order status:', order.orderStatus);
      return order.orderStatus === '待下发' || order.orderStatus === '有变更';
    });
    console.log('Filtered orders:', orderList.value);
    pagination.total = orderList.value.length;
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



// 选择行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 单个下发任务
const handleSingleIssueTask = (row: any) => {
  // 跳转到订单下发编辑页面
  router.push(`/app/purchase-order/issue/${row.id}`);
};

// 订单拆分
const handleSplitOrder = (row: any) => {
  // 跳转到订单拆分页面
  router.push(`/app/order-split/${row.id}`);
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
          orderId: ids[0],
          supplierId: Number(issueTaskForm.supplierId),
      
          // @ts-ignore - description 字段用于扩展，API 类型定义中暂未包含
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
</style>