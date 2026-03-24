<template>
  <div class="dashboard-container">
    <h2>仪表盘</h2>
    
    <div class="stats-card-container">
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon blue">
            <el-icon><i-ep-order /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ statistics.orders?.total || 0 }}</div>
            <div class="stats-card-label">采购订单总数</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon green">
            <el-icon><i-ep-success /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ statistics.orders?.completed || 0 }}</div>
            <div class="stats-card-label">已完成订单</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon orange">
            <el-icon><i-ep-warning /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ statistics.orders?.delayed || 0 }}</div>
            <div class="stats-card-label">延期订单</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon red">
            <el-icon><i-ep-alarm-clock /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ statistics.todos?.pending || 0 }}</div>
            <div class="stats-card-label">待办任务</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="secondary-stats-container">
      <el-card class="secondary-stats-card">
        <div class="secondary-stats-header">
          <el-icon><i-ep-document /></el-icon>
          <span>生产计划</span>
        </div>
        <div class="secondary-stats-content">
          <div class="stat-item">
            <span class="stat-value">{{ statistics.plans?.total || 0 }}</span>
            <span class="stat-label">总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value confirmed">{{ statistics.plans?.confirmed || 0 }}</span>
            <span class="stat-label">已确认</span>
          </div>
          <div class="stat-item">
            <span class="stat-value pending">{{ statistics.plans?.pending || 0 }}</span>
            <span class="stat-label">待确认</span>
          </div>
        </div>
      </el-card>
      
      <el-card class="secondary-stats-card">
        <div class="secondary-stats-header">
          <el-icon><i-ep-edit /></el-icon>
          <span>进度反馈</span>
        </div>
        <div class="secondary-stats-content">
          <div class="stat-item">
            <span class="stat-value">{{ statistics.feedbacks?.total || 0 }}</span>
            <span class="stat-label">总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value confirmed">{{ statistics.feedbacks?.completed || 0 }}</span>
            <span class="stat-label">已完成</span>
          </div>
          <div class="stat-item">
            <span class="stat-value pending">{{ statistics.feedbacks?.delayed || 0 }}</span>
            <span class="stat-label">已延期</span>
          </div>
        </div>
      </el-card>
      
      <el-card class="secondary-stats-card">
        <div class="secondary-stats-header">
          <el-icon><i-ep-bell /></el-icon>
          <span>待办任务</span>
        </div>
        <div class="secondary-stats-content">
          <div class="stat-item">
            <span class="stat-value">{{ statistics.todos?.total || 0 }}</span>
            <span class="stat-label">总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value pending">{{ statistics.todos?.pending || 0 }}</span>
            <span class="stat-label">待处理</span>
          </div>
          <div class="stat-item">
            <span class="stat-value danger">{{ statistics.todos?.highPriority || 0 }}</span>
            <span class="stat-label">高优先</span>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="chart-container">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>订单状态分布</span>
          </div>
        </template>
        <div ref="orderStatusChartRef" class="chart" v-loading="chartLoading"></div>
      </el-card>
      
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>反馈趋势</span>
            <el-select v-model="trendDays" size="small" @change="loadFeedbackTrend">
              <el-option label="近7天" :value="7" />
              <el-option label="近14天" :value="14" />
              <el-option label="近30天" :value="30" />
            </el-select>
          </div>
        </template>
        <div ref="feedbackTrendChartRef" class="chart" v-loading="chartLoading"></div>
      </el-card>
    </div>
    
    <div class="recent-container">
      <el-card class="recent-card">
        <template #header>
          <div class="recent-header">
            <span>最近预警</span>
            <el-badge :value="recentAlerts.length" type="danger" v-if="recentAlerts.length > 0" />
          </div>
        </template>
        <el-table :data="recentAlerts" style="width: 100%" v-loading="alertsLoading" max-height="300">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="alertType" label="预警类型" width="100" />
          <el-table-column prop="alertContent" label="预警内容" />
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'unhandled' ? 'danger' : 'success'">
                {{ scope.row.status === 'unhandled' ? '未处理' : '已处理' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="recentAlerts.length === 0 && !alertsLoading" description="暂无预警" />
      </el-card>
      
      <el-card class="recent-card">
        <template #header>
          <div class="recent-header">
            <span>最近待办</span>
            <router-link to="/todo">
              <el-link type="primary">查看全部</el-link>
            </router-link>
          </div>
        </template>
        <el-table :data="recentTodos" style="width: 100%" v-loading="todosLoading" max-height="300">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="taskType" label="任务类型" width="100">
            <template #default="scope">
              <el-tag :type="getTaskTypeStyle(scope.row.taskType)" size="small">
                {{ getTaskTypeText(scope.row.taskType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="任务标题" />
          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="80">
            <template #default="scope">
              <el-tag :type="getPriorityType(scope.row.priority)" size="small">
                {{ getPriorityText(scope.row.priority) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="recentTodos.length === 0 && !todosLoading" description="暂无待办任务" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { dashboardApi } from '../api';

const orderStatusChartRef = ref<HTMLElement>();
const feedbackTrendChartRef = ref<HTMLElement>();
const orderStatusChart = ref<echarts.ECharts>();
const feedbackTrendChart = ref<echarts.ECharts>();

const chartLoading = ref(false);
const alertsLoading = ref(false);
const todosLoading = ref(false);
const trendDays = ref(7);

const statistics = ref({
  orders: { total: 0, completed: 0, inProgress: 0, pending: 0, delayed: 0 },
  plans: { total: 0, confirmed: 0, pending: 0 },
  feedbacks: { total: 0, completed: 0, delayed: 0 },
  todos: { total: 0, pending: 0, processing: 0, completed: 0, highPriority: 0 },
});

const recentAlerts = ref<any[]>([]);
const recentTodos = ref<any[]>([]);
const orderDistribution = ref<any[]>([]);
const feedbackTrend = ref<any[]>([]);

const formatDate = (date: string | Date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTaskTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    approval: '审批',
    task_receive: '任务接收',
    progress_feedback: '进度反馈',
    alert_handle: '预警处理',
    order_confirm: '订单确认',
    plan_confirm: '计划确认',
  };
  return typeMap[type] || type;
};

const getTaskTypeStyle = (type: string) => {
  const styleMap: Record<string, string> = {
    approval: 'danger',
    task_receive: 'primary',
    progress_feedback: 'warning',
    alert_handle: 'danger',
    order_confirm: 'success',
    plan_confirm: 'info',
  };
  return styleMap[type] || 'info';
};

const getPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低',
    urgent: '紧急',
  };
  return priorityMap[priority] || priority;
};

const getPriorityType = (priority: string) => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
};

const initOrderStatusChart = () => {
  if (orderStatusChartRef.value) {
    if (orderStatusChart.value) {
      orderStatusChart.value.dispose();
    }
    orderStatusChart.value = echarts.init(orderStatusChartRef.value);
    
    const data = orderDistribution.value.length > 0
      ? orderDistribution.value
      : [
          { name: '已完成', value: statistics.value.orders?.completed || 0 },
          { name: '进行中', value: statistics.value.orders?.inProgress || 0 },
          { name: '待下发', value: statistics.value.orders?.pending || 0 },
          { name: '已延期', value: statistics.value.orders?.delayed || 0 },
        ];
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: '订单状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
          color: ['#4CAF50', '#1E88E5', '#FF9800', '#FF5252'],
        },
      ],
    };
    orderStatusChart.value.setOption(option);
  }
};

const initFeedbackTrendChart = () => {
  if (feedbackTrendChartRef.value) {
    if (feedbackTrendChart.value) {
      feedbackTrendChart.value.dispose();
    }
    feedbackTrendChart.value = echarts.init(feedbackTrendChartRef.value);
    
    const dates = feedbackTrend.value.map(item => item.date);
    const completedData = feedbackTrend.value.map(item => item.completed);
    const delayedData = feedbackTrend.value.map(item => item.delayed);
    
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['已完成', '已延期'],
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '已完成',
          type: 'line',
          data: completedData,
          smooth: true,
          color: '#4CAF50',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(76, 175, 80, 0.3)' },
              { offset: 1, color: 'rgba(76, 175, 80, 0.1)' },
            ]),
          },
        },
        {
          name: '已延期',
          type: 'line',
          data: delayedData,
          smooth: true,
          color: '#FF5252',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 82, 82, 0.3)' },
              { offset: 1, color: 'rgba(255, 82, 82, 0.1)' },
            ]),
          },
        },
      ],
    };
    feedbackTrendChart.value.setOption(option);
  }
};

const loadDashboardData = async () => {
  chartLoading.value = true;
  alertsLoading.value = true;
  todosLoading.value = true;
  
  try {
    const response = await dashboardApi.getDashboardData() as any;
    
    if (response.statistics) {
      statistics.value = response.statistics;
    }
    
    if (response.orderDistribution) {
      orderDistribution.value = response.orderDistribution;
    }
    
    if (response.feedbackTrend) {
      feedbackTrend.value = response.feedbackTrend;
    }
    
    if (response.recentAlerts) {
      recentAlerts.value = response.recentAlerts;
    }
    
    if (response.recentTodos) {
      recentTodos.value = response.recentTodos;
    }
  } catch (error) {
    console.error('Load dashboard data error:', error);
  } finally {
    chartLoading.value = false;
    alertsLoading.value = false;
    todosLoading.value = false;
  }
};

const loadFeedbackTrend = async () => {
  try {
    const response = await fetch(`/api/dashboard/feedback-trend?days=${trendDays.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    feedbackTrend.value = data;
    initFeedbackTrendChart();
  } catch (error) {
    console.error('Load feedback trend error:', error);
  }
};

const handleResize = () => {
  orderStatusChart.value?.resize();
  feedbackTrendChart.value?.resize();
};

onMounted(async () => {
  await loadDashboardData();
  initOrderStatusChart();
  initFeedbackTrendChart();
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  orderStatusChart.value?.dispose();
  feedbackTrendChart.value?.dispose();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.stats-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stats-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stats-card-content {
  display: flex;
  align-items: center;
}

.stats-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.stats-card-icon.blue {
  background-color: #1E88E5;
}

.stats-card-icon.green {
  background-color: #4CAF50;
}

.stats-card-icon.orange {
  background-color: #FF9800;
}

.stats-card-icon.red {
  background-color: #FF5252;
}

.stats-card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stats-card-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.secondary-stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.secondary-stats-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.secondary-stats-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

.secondary-stats-content {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.confirmed {
  color: #4CAF50;
}

.stat-value.pending {
  color: #FF9800;
}

.stat-value.danger {
  color: #FF5252;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 300px;
}

.recent-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.recent-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
  }
  
  .recent-container {
    grid-template-columns: 1fr;
  }
}
</style>
