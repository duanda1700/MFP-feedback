<template>
  <div class="production-plan-container">
    <h2>生产计划确认</h2>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="success" @click="handleRefresh">
        <el-icon><View /></el-icon>
        刷新列表
      </el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="采购订单">
            <el-select v-model="searchForm.orderId" placeholder="选择采购订单" style="width: 240px">
              <el-option 
                v-for="order in orders" 
                :key="order.id" 
                :label="`${order.orderNumber} - ${order.supplierName}`" 
                :value="order.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="计划编号">
            <el-input v-model="searchForm.planNumber" placeholder="请输入计划编号" />
          </el-form-item>
          
          <el-form-item label="计划状态">
            <el-select v-model="searchForm.planStatus" placeholder="请选择计划状态">
              <el-option label="待确认" value="待确认" />
              <el-option label="已确认" value="已确认" />
              <el-option label="进行中" value="进行中" />
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
    
    <!-- 生产计划列表 -->
    <div class="plan-list-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>生产计划列表</span>
          </div>
        </template>
        
        <el-table 
          :data="productionPlans" 
          style="width: 100%"
        >
          <el-table-column prop="id" label="订单ID" width="100" />
          <el-table-column prop="djbH" label="订单编号" />
          <el-table-column prop="purchaseManager" label="采购主管" />
          <el-table-column prop="major" label="专业" width="100" />
          <el-table-column prop="project" label="项目" width="180" />
          <el-table-column prop="supplierName" label="供应商" />
          <el-table-column prop="orderStatus" label="订单状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.orderStatus)">
                {{ scope.row.orderStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="setCount" label="台份" width="100" />
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewPlanDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container" v-if="total > 0">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    



  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { View, Close } from '@element-plus/icons-vue';
import { purchaseOrderApi } from '../api';

// 路由
const router = useRouter();

// 数据
const orders = ref<any[]>([]);
const productionPlans = ref<any[]>([]);
const total = ref<number>(0);

// 搜索表单
const searchForm = reactive({
  orderId: '',
  planNumber: '',
  planStatus: ''
});

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 选中的行
const selectedRows = ref<any[]>([]);



// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '待确认':
      return 'warning';
    case '已确认':
      return 'success';
    case '待下发':
      return 'info';
    case '有变更':
      return 'primary';
    case '已下发':
      return 'success';
    default:
      return 'info';
  }
};

// 加载供应商订单
const loadSupplierOrders = async () => {
  try {
    const response = await purchaseOrderApi.getList({ orderStatus: '已下发' });
    orders.value = response.data || [];
  } catch (error) {
    ElMessage.error('获取订单列表失败');
    console.error('Failed to load supplier orders:', error);
  }
};

// 加载生产计划
const loadProductionPlans = async () => {
  try {
    const response = await purchaseOrderApi.getList({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      orderStatus: '已下发',
      ...searchForm
    });
    productionPlans.value = response.data || [];
    total.value = response.total || 0;
    pagination.total = total.value;
  } catch (error) {
    ElMessage.error('获取生产计划失败');
    console.error('Failed to load production plans:', error);
  }
};

// 刷新列表
const handleRefresh = async () => {
  try {
    await loadProductionPlans();
    ElMessage.success('列表刷新成功');
  } catch (error) {
    ElMessage.error('列表刷新失败');
    console.error('Failed to refresh plan list:', error);
  }
};

// 搜索
const handleSearch = async () => {
  pagination.currentPage = 1;
  try {
    await loadProductionPlans();
    ElMessage.success('搜索成功');
  } catch (error) {
    ElMessage.error('搜索失败');
    console.error('Failed to search plans:', error);
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
  loadProductionPlans();
};

// 当前页变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current;
  loadProductionPlans();
};

// 查看计划详情
const viewPlanDetail = async (plan: any) => {
  router.push({
    path: `/app/purchase-order/issue/${plan.id}`
  });
};

// 初始化
onMounted(() => {
  loadSupplierOrders();
  loadProductionPlans();
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

/* 详情对话框样式 - 从右侧弹出 */
.plan-detail-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.plan-detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fade-in 0.3s ease-out;
}

.plan-detail-panel {
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

.plan-detail-header-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
}

.plan-detail-header-panel h3 {
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

.plan-detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.plan-detail-header {
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

.plan-detail-footer {
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