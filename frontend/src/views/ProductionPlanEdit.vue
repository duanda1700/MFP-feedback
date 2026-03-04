<template>
  <div class="production-plan-edit">
    <el-card shadow="hover" class="card">
      <template #header>
        <div class="card-header">
          <span>生产计划编辑</span>
        </div>
      </template>
      
      <!-- 采购订单选择 -->
      <el-form :inline="true" class="search-form" @submit.prevent>
        <el-form-item label="采购订单">
          <el-select v-model="selectedOrderId" placeholder="选择采购订单" style="width: 240px">
            <el-option 
              v-for="order in orders" 
              :key="order.id" 
              :label="`${order.orderNumber} - ${order.supplierName}`" 
              :value="order.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadProductionPlans">查询</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 生产计划列表 -->
      <el-table :data="productionPlans" style="width: 100%" border>
        <el-table-column prop="planNumber" label="计划编号" width="180" />
        <el-table-column prop="planClass" label="计划分类" width="140" />
        <el-table-column prop="planType" label="计划类型" width="120" />
        <el-table-column prop="materialCode" label="物料编码" width="150" />
        <el-table-column prop="materialDesc" label="物料描述" min-width="200" />
        <el-table-column label="计划数量" width="120">
          <template #default="scope">
            <el-input-number 
              v-model="scope.row.quantity" 
              :min="0" 
              :step="1" 
              size="small"
              @change="handleQuantityChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column label="计划日期" width="140">
          <template #default="scope">
            <el-date-picker 
              v-model="scope.row.plannedDate" 
              type="date" 
              format="YYYY-MM-DD" 
              value-format="YYYY-MM-DD" 
              size="small"
              @change="handleDateChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="计划状态" width="120">
          <template #default="scope">
            <el-select 
              v-model="scope.row.planStatus" 
              size="small"
              @change="handleStatusChange(scope.row)"
            >
              <el-option label="待确认" value="待确认" />
              <el-option label="已确认" value="已确认" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已取消" value="已取消" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150">
          <template #default="scope">
            <el-input 
              v-model="scope.row.remarks" 
              type="textarea" 
              :rows="2" 
              size="small"
              @change="handleRemarksChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="savePlan(scope.row)"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getSupplierOrders, getSupplierOrderPlans, updatePlanStatus } from '../api';

// 数据
const orders = ref<any[]>([]);
const productionPlans = ref<any[]>([]);
const selectedOrderId = ref<string>('');
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

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
  if (!selectedOrderId.value) {
    ElMessage.warning('请选择采购订单');
    return;
  }
  
  try {
    const response = await getSupplierOrderPlans(selectedOrderId.value, {
      page: currentPage.value,
      pageSize: pageSize.value,
      orderId: selectedOrderId.value
    });
    productionPlans.value = response.data || [];
    total.value = response.total || 0;
  } catch (error) {
    ElMessage.error('获取生产计划失败');
    console.error('Failed to load production plans:', error);
  }
};

// 处理数量变化
const handleQuantityChange = (plan: any) => {
  console.log('Quantity changed:', plan);
};

// 处理日期变化
const handleDateChange = (plan: any) => {
  console.log('Date changed:', plan);
};

// 处理状态变化
const handleStatusChange = (plan: any) => {
  console.log('Status changed:', plan);
};

// 处理备注变化
const handleRemarksChange = (plan: any) => {
  console.log('Remarks changed:', plan);
};

// 保存计划
const savePlan = async (plan: any) => {
  try {
    // 这里需要调用后端API来保存计划
    // 暂时只更新状态，后续可以扩展为更新所有字段
    await updatePlanStatus(plan.id, plan.planStatus);
    ElMessage.success('计划保存成功');
  } catch (error) {
    ElMessage.error('计划保存失败');
    console.error('Failed to save plan:', error);
  }
};

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  loadProductionPlans();
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
  loadProductionPlans();
};

// 初始化
onMounted(() => {
  loadSupplierOrders();
});
</script>

<style scoped>
.production-plan-edit {
  padding: 20px;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>