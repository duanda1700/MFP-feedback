<template>
  <div class="dashboard-container">
    <h2>仪表盘</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-card-container">
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon blue">
            <el-icon><i-ep-order /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ orderStats.total }}</div>
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
            <div class="stats-card-value">{{ orderStats.completed }}</div>
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
            <div class="stats-card-value">{{ orderStats.warning }}</div>
            <div class="stats-card-label">预警订单</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon red">
            <el-icon><i-ep-alarm-clock /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ todoCount }}</div>
            <div class="stats-card-label">待办任务</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-container">
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>订单状态分布</span>
            <el-select v-model="chartTimeRange" size="small">
              <el-option label="今日" value="today" />
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="全年" value="year" />
            </el-select>
          </div>
        </template>
        <div ref="orderStatusChartRef" class="chart"></div>
      </el-card>
      
      <el-card class="chart-card">
        <template #header>
          <div class="chart-header">
            <span>预警趋势</span>
            <el-select v-model="chartTimeRange" size="small">
              <el-option label="今日" value="today" />
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="全年" value="year" />
            </el-select>
          </div>
        </template>
        <div ref="alertTrendChartRef" class="chart"></div>
      </el-card>
    </div>
    
    <!-- 最近预警和待办任务 -->
    <div class="recent-container">
      <el-card class="recent-card">
        <template #header>
          <div class="recent-header">
            <span>最近预警</span>
          </div>
        </template>
        <el-table :data="recentAlerts" style="width: 100%">
          <el-table-column prop="id" label="预警ID" width="100" />
          <el-table-column prop="alertType" label="预警类型" />
          <el-table-column prop="alertContent" label="预警内容" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'unhandled' ? 'danger' : 'success'">
                {{ scope.row.status === 'unhandled' ? '未处理' : '已处理' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <el-card class="recent-card">
        <template #header>
          <div class="recent-header">
            <span>最近待办</span>
            <el-link type="primary" :href="'/todo'">查看全部</el-link>
          </div>
        </template>
        <el-table :data="recentTodos" style="width: 100%">
          <el-table-column prop="id" label="任务ID" width="100" />
          <el-table-column prop="taskType" label="任务类型" />
          <el-table-column prop="taskContent" label="任务内容" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="scope">
              <el-tag :type="getPriorityType(scope.row.priority)">
                {{ scope.row.priority }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { useUserStore } from '../store/user';
import { todoApi } from '../api';

const userStore = useUserStore();
const orderStatusChartRef = ref<HTMLElement>();
const alertTrendChartRef = ref<HTMLElement>();
const orderStatusChart = ref<echarts.ECharts>();
const alertTrendChart = ref<echarts.ECharts>();
const chartTimeRange = ref('week');

// 模拟数据
const orderStats = ref({
  total: 120,
  completed: 85,
  warning: 15,
  pending: 20
});

const todoCount = ref(8);

const recentAlerts = ref([
  { id: 'A001', alertType: '进度预警', alertContent: '订单PO-2026-0001 进度延迟', createTime: '2026-02-03 10:30:00', status: 'unhandled' },
  { id: 'A002', alertType: '反馈预警', alertContent: '供应商未提交进度反馈', createTime: '2026-02-03 09:15:00', status: 'unhandled' },
  { id: 'A003', alertType: '进度预警', alertContent: '订单PO-2026-0002 进度延迟', createTime: '2026-02-02 16:45:00', status: 'handled' }
]);

const recentTodos = ref([
  { id: 'T001', taskType: '审批', taskContent: '生产计划PP-2026-0001 审批', createTime: '2026-02-03 11:00:00', priority: '高' },
  { id: 'T002', taskType: '任务接收', taskContent: '接收新任务', createTime: '2026-02-03 10:00:00', priority: '中' },
  { id: 'T003', taskType: '进度反馈', taskContent: '提交进度反馈', createTime: '2026-02-03 09:30:00', priority: '中' }
]);

const getPriorityType = (priority: string) => {
  switch (priority) {
    case '高':
      return 'danger';
    case '中':
      return 'warning';
    case '低':
      return 'info';
    default:
      return 'info';
  }
};

const initOrderStatusChart = () => {
  if (orderStatusChartRef.value) {
    orderStatusChart.value = echarts.init(orderStatusChartRef.value);
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
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
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: orderStats.value.completed, name: '已完成' },
            { value: orderStats.value.pending, name: '待完成' },
            { value: orderStats.value.warning, name: '预警' }
          ],
          color: ['#4CAF50', '#1E88E5', '#FF5252']
        }
      ]
    };
    orderStatusChart.value.setOption(option);
  }
};

const initAlertTrendChart = () => {
  if (alertTrendChartRef.value) {
    alertTrendChart.value = echarts.init(alertTrendChartRef.value);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['进度预警', '反馈预警']
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '进度预警',
          type: 'line',
          data: [3, 5, 2, 6, 4, 1, 2],
          smooth: true,
          color: '#FF5252'
        },
        {
          name: '反馈预警',
          type: 'line',
          data: [1, 2, 3, 2, 1, 0, 1],
          smooth: true,
          color: '#FF9800'
        }
      ]
    };
    alertTrendChart.value.setOption(option);
  }
};

const loadData = async () => {
  try {
    // 加载待办任务数量
    const todoResponse = await todoApi.getCount();
    todoCount.value = todoResponse.count || 0;
  } catch (error) {
    console.error('Load dashboard data error:', error);
  }
};

onMounted(async () => {
  await loadData();
  initOrderStatusChart();
  initAlertTrendChart();
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    orderStatusChart.value?.resize();
    alertTrendChart.value?.resize();
  });
});

watch(chartTimeRange, () => {
  // 重新加载图表数据
  initOrderStatusChart();
  initAlertTrendChart();
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
  margin-bottom: 30px;
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