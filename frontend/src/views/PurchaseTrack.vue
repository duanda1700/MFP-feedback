<template>
  <div class="purchase-track">
    <div class="page-header">
      <h1>采购订单跟踪</h1>
      <div class="header-actions">
        <el-button type="primary" @click="refreshData">
          <i class="el-icon-refresh"></i> 刷新数据
        </el-button>
      </div>
    </div>

    <div class="overview-stats">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ totalOrders }}</div>
          <div class="stat-label">总订单数</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ pendingOrders }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ processingOrders }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ completedOrders }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-card>
    </div>

    <div class="status-sections">
      <div class="status-section" v-if="pendingOrders > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-time"></i> 待处理订单
            <span class="order-count">{{ pendingOrders }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus['pending']" 
            :key="order.id"
            shadow="hover"
            class="order-card"
          >
            <div class="order-card-header">
              <div class="order-info">
                <h3 class="order-no">{{ order.djbH }}</h3>
                <div class="order-status status-pending">{{ order.orderStatus }}</div>
              </div>
              <div class="order-date">{{ formatDate(order.createTime) }}</div>
            </div>
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order.id)">查看详情</el-button>
              <el-button size="small" type="primary" @click="processOrder(order.id)">开始处理</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="status-section" v-if="processingOrders > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-loading"></i> 处理中订单
            <span class="order-count">{{ processingOrders }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus['processing']" 
            :key="order.id"
            shadow="hover"
            class="order-card"
          >
            <div class="order-card-header">
              <div class="order-info">
                <h3 class="order-no">{{ order.djbH }}</h3>
                <div class="order-status status-processing">{{ order.orderStatus }}</div>
              </div>
              <div class="order-date">{{ formatDate(order.createTime) }}</div>
            </div>
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order.id)">查看详情</el-button>
              <el-button size="small" type="success" @click="completeOrder(order.id)">标记完成</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="status-section" v-if="completedOrders > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-check"></i> 已完成订单
            <span class="order-count">{{ completedOrders }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus['completed']" 
            :key="order.id"
            shadow="hover"
            class="order-card"
          >
            <div class="order-card-header">
              <div class="order-info">
                <h3 class="order-no">{{ order.djbH }}</h3>
                <div class="order-status status-completed">{{ order.orderStatus }}</div>
              </div>
              <div class="order-date">{{ formatDate(order.createTime) }}</div>
            </div>
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order.id)">查看详情</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div v-if="totalOrders === 0" class="empty-state">
        <el-empty description="暂无采购订单数据" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { purchaseOrderApi } from '../api';

const orders = ref<any[]>([]);
const loading = ref(false);

const ordersByStatus = computed(() => {
  const grouped: any = {
    pending: [],
    processing: [],
    completed: []
  };

  orders.value.forEach(order => {
    switch (order.orderStatus) {
      case '待处理':
        grouped.pending.push(order);
        break;
      case '处理中':
        grouped.processing.push(order);
        break;
      case '已完成':
        grouped.completed.push(order);
        break;
      default:
        grouped.pending.push(order);
    }
  });

  return grouped;
});

const totalOrders = computed(() => orders.value.length);
const pendingOrders = computed(() => ordersByStatus.value.pending.length);
const processingOrders = computed(() => ordersByStatus.value.processing.length);
const completedOrders = computed(() => ordersByStatus.value.completed.length);

const formatDate = (date: any) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadOrders = async () => {
  loading.value = true;
  try {
    const response = await purchaseOrderApi.getList({});
    orders.value = response.data || [];
  } catch (error) {
    ElMessage.error('加载订单数据失败');
    console.error('加载订单数据失败:', error);
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadOrders();
};

const viewOrderDetail = (orderId: number) => {
  ElMessage.info(`查看订单详情: ${orderId}`);
};

const processOrder = async (orderId: number) => {
  try {
    await purchaseOrderApi.updateStatus(orderId, 'processing');
    ElMessage.success('订单状态已更新为处理中');
    loadOrders();
  } catch (error) {
    ElMessage.error('更新订单状态失败');
    console.error('更新订单状态失败:', error);
  }
};

const completeOrder = async (orderId: number) => {
  try {
    await purchaseOrderApi.updateStatus(orderId, 'completed');
    ElMessage.success('订单状态已更新为已完成');
    loadOrders();
  } catch (error) {
    ElMessage.error('更新订单状态失败');
    console.error('更新订单状态失败:', error);
  }
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.purchase-track {
  padding: 20px 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e6e8eb;
}

.page-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #1E88E5;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.status-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.status-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.order-count {
  background-color: #f0f2f5;
  color: #666;
  font-size: 14px;
  font-weight: normal;
  padding: 2px 10px;
  border-radius: 12px;
}

.order-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.order-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.order-info {
  flex: 1;
}

.order-no {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.order-status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #fff2e8;
  color: #fa8c16;
}

.status-processing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.order-date {
  font-size: 12px;
  color: #999;
}

.order-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-item label {
  width: 80px;
  color: #666;
  font-weight: 500;
}

.detail-item span {
  flex: 1;
  color: #333;
}

.order-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .order-cards {
    grid-template-columns: 1fr;
  }
  
  .status-section {
    padding: 16px;
  }
}

@media screen and (max-width: 480px) {
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-item label {
    width: auto;
  }
}
</style>