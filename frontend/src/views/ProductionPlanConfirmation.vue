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
            <div class="header-actions">
              <el-button type="primary" @click="handleBatchConfirm" :disabled="selectedRows.length === 0">
                批量确认
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="productionPlans" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="计划ID" width="100" />
          <el-table-column prop="planNumber" label="计划编号" />
          <el-table-column prop="applicant" label="申请人" />
          <el-table-column prop="department" label="申请部门" />
          <el-table-column prop="major" label="专业" width="100" />
          <el-table-column prop="project" label="项目" width="180" />
          <el-table-column prop="supplier" label="供应商" />
          <el-table-column prop="planStatus" label="计划状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.planStatus)">
                {{ scope.row.planStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="台份" width="100" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="viewPlanDetail(scope.row)">详情</el-button>
              <el-button 
                size="small" 
                type="primary" 
                @click="confirmPlan(scope.row)"
                :disabled="scope.row.planStatus === '已确认'"
              >
                确认
              </el-button>
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
    
    <!-- 批量确认对话框 -->
    <el-dialog v-model="batchConfirmDialogVisible" title="批量确认计划" width="400px">
      <el-form :model="batchConfirmForm" label-width="100px">
        <el-form-item label="确认说明">
          <el-input v-model="batchConfirmForm.description" type="textarea" placeholder="请输入确认说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchConfirmDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmBatchConfirm" :loading="batchConfirmLoading">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <div class="plan-detail-wrapper" v-if="detailDialogVisible">
      <!-- 遮罩层 -->
      <div class="plan-detail-overlay" @click="detailDialogVisible = false"></div>
      <!-- 详情面板 -->
      <div class="plan-detail-panel">
        <div class="plan-detail-header-panel">
          <h3>生产计划明细</h3>
          <el-button type="text" @click="detailDialogVisible = false" class="close-btn">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        
        <div class="plan-detail-content">
          <div class="plan-detail-header">
            <div class="detail-info">
              <span class="info-item">计划编号: {{ currentPlan?.planNumber }}</span>
              <span class="info-item">申请人: {{ currentPlan?.applicant }}</span>
              <span class="info-item">申请部门: {{ currentPlan?.department }}</span>
              <span class="info-item">供应商: {{ currentPlan?.supplier }}</span>
              <span class="info-item">计划状态: <el-tag :type="getStatusType(currentPlan?.planStatus)">{{ currentPlan?.planStatus }}</el-tag></span>
            </div>
          </div>
          
          <div class="detail-list-container">
            <el-table :data="planDetails" style="width: 100%" :loading="detailLoading">
              <el-table-column prop="id" label="明细ID" width="120" />
              <el-table-column prop="materialCode" label="物料编码" />
              <el-table-column prop="materialDesc" label="物料描述" />
              <el-table-column prop="quantity" label="数量" width="100" />
              <el-table-column prop="unit" label="单位" width="80" />
              <el-table-column prop="plannedDate" label="计划日期" width="150" />
              <el-table-column prop="finishedQuantity" label="完成数量" width="120" />
              <el-table-column prop="remarks" label="备注" />
            </el-table>
          </div>
          
          <div class="plan-detail-footer">
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
import { View, Close } from '@element-plus/icons-vue';
import { getSupplierOrders, getSupplierOrderPlans, updatePlanStatus } from '../api';

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

// 批量确认对话框
const batchConfirmDialogVisible = ref(false);
const batchConfirmForm = reactive({
  description: ''
});
const batchConfirmLoading = ref(false);

// 详情对话框
const detailDialogVisible = ref(false);
const currentPlan = ref<any>(null);
const planDetails = ref<any[]>([]);
const detailLoading = ref(false);

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '待确认':
      return 'warning';
    case '已确认':
      return 'success';
    case '进行中':
      return 'primary';
    case '已完成':
      return 'info';
    default:
      return 'info';
  }
};

// 加载供应商订单
const loadSupplierOrders = async () => {
  try {
    const response = await getSupplierOrders();
    orders.value = response.data || [];
  } catch (error) {
    ElMessage.error('获取订单列表失败');
    console.error('Failed to load supplier orders:', error);
  }
};

// 加载生产计划
const loadProductionPlans = async () => {
  try {
    const response = await getSupplierOrderPlans(searchForm.orderId, {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
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

// 选择行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

// 批量确认
const handleBatchConfirm = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要确认的计划');
    return;
  }
  batchConfirmDialogVisible.value = true;
};

// 确认批量确认
const confirmBatchConfirm = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要确认的计划');
    return;
  }
  
  batchConfirmLoading.value = true;
  try {
    const ids = selectedRows.value.map(row => row.id);
    for (const id of ids) {
      await updatePlanStatus(id, '已确认');
    }
    ElMessage.success('批量确认成功');
    batchConfirmDialogVisible.value = false;
    handleRefresh();
  } catch (error) {
    ElMessage.error('批量确认失败');
    console.error('Failed to batch confirm plans:', error);
  } finally {
    batchConfirmLoading.value = false;
  }
};

// 查看计划详情
const viewPlanDetail = async (plan: any) => {
  currentPlan.value = plan;
  detailDialogVisible.value = true;
  
  // 加载生产计划明细数据
  detailLoading.value = true;
  try {
    // 这里可以调用后端API获取生产计划明细
    // 暂时使用模拟数据
    planDetails.value = [
      {
        id: 1,
        materialCode: 'MAT001',
        materialDesc: '测试物料1',
        quantity: 10,
        unit: '件',
        plannedDate: new Date(),
        finishedQuantity: 0,
        remarks: '无'
      },
      {
        id: 2,
        materialCode: 'MAT002',
        materialDesc: '测试物料2',
        quantity: 20,
        unit: '件',
        plannedDate: new Date(),
        finishedQuantity: 0,
        remarks: '无'
      }
    ];
  } catch (error) {
    ElMessage.error('加载明细数据失败');
    console.error('Failed to load plan details:', error);
    planDetails.value = [];
  } finally {
    detailLoading.value = false;
  }
};

// 确认计划
const confirmPlan = async (plan: any) => {
  try {
    await updatePlanStatus(plan.id, '已确认');
    ElMessage.success('计划确认成功');
    // 重新加载计划列表
    loadProductionPlans();
  } catch (error) {
    ElMessage.error('计划确认失败');
    console.error('Failed to confirm plan:', error);
  }
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