<template>
  <div class="monitor-container">
    <h2>数据监控与分析</h2>
    
    <!-- 时间范围选择 -->
    <div class="time-range-container">
      <el-card>
        <el-form :inline="true" :model="queryForm" class="query-form">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="queryForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </el-form-item>
          
          <el-form-item label="供应商">
            <el-select v-model="queryForm.supplierId" placeholder="请选择供应商">
              <el-option label="全部" value="" />
              <el-option label="供应商A" value="1" />
              <el-option label="供应商B" value="2" />
              <el-option label="供应商C" value="3" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button @click="handleExport">导出报表</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-card-container">
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon blue">
            <el-icon><i-ep-order /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ dashboardData.totalOrders }}</div>
            <div class="stats-card-label">订单总数</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stats-card">
        <div class="stats-card-content">
          <div class="stats-card-icon green">
            <el-icon><i-ep-success /></el-icon>
          </div>
          <div class="stats-card-info">
            <div class="stats-card-value">{{ dashboardData.completedOrders }}</div>
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
            <div class="stats-card-value">{{ dashboardData.warningOrders }}</div>
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
            <div class="stats-card-value">{{ dashboardData.alertCount }}</div>
            <div class="stats-card-label">预警数量</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="chart-container">
      <el-card class="chart-card">
        <template #header>
          <span>订单状态分布</span>
        </template>
        <div ref="orderStatusChartRef" class="chart"></div>
      </el-card>
      
      <el-card class="chart-card">
        <template #header>
          <span>订单完成趋势</span>
        </template>
        <div ref="orderTrendChartRef" class="chart"></div>
      </el-card>
    </div>
    
    <div class="chart-container">
      <el-card class="chart-card">
        <template #header>
          <span>供应商交付率</span>
        </template>
        <div ref="deliveryRateChartRef" class="chart"></div>
      </el-card>
      
      <el-card class="chart-card">
        <template #header>
          <span>预警趋势</span>
        </template>
        <div ref="alertTrendChartRef" class="chart"></div>
      </el-card>
    </div>
    
    <!-- 预警列表 -->
    <div class="alert-list-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>预警列表</span>
            <el-button type="primary" @click="handleHandleAlert">处理预警</el-button>
          </div>
        </template>
        
        <el-table :data="alerts" style="width: 100%">
          <el-table-column prop="id" label="预警ID" width="100" />
          <el-table-column prop="alertType" label="预警类型" />
          <el-table-column prop="alertContent" label="预警内容" />
          <el-table-column prop="supplierName" label="供应商" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleViewAlertDetail(scope.row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleHandleAlert(scope.row)" v-if="scope.row.status === 'unhandled'">处理</el-button>
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { monitorApi } from '../api';

const queryForm = reactive({
  dateRange: null,
  supplierId: ''
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const orderStatusChartRef = ref<HTMLElement>();
const orderTrendChartRef = ref<HTMLElement>();
const deliveryRateChartRef = ref<HTMLElement>();
const alertTrendChartRef = ref<HTMLElement>();

const orderStatusChart = ref<echarts.ECharts>();
const orderTrendChart = ref<echarts.ECharts>();
const deliveryRateChart = ref<echarts.ECharts>();
const alertTrendChart = ref<echarts.ECharts>();

// 模拟数据
const dashboardData = ref({
  totalOrders: 120,
  completedOrders: 85,
  warningOrders: 15,
  alertCount: 8
});

const alerts = ref([
  { id: 'A001', alertType: '进度预警', alertContent: '订单PO-2026-0001 进度延迟', supplierName: '供应商A', createTime: '2026-02-03 10:30:00', status: 'unhandled' },
  { id: 'A002', alertType: '反馈预警', alertContent: '供应商未提交进度反馈', supplierName: '供应商B', createTime: '2026-02-03 09:15:00', status: 'unhandled' },
  { id: 'A003', alertType: '进度预警', alertContent: '订单PO-2026-0002 进度延迟', supplierName: '供应商C', createTime: '2026-02-02 16:45:00', status: 'handled' },
  { id: 'A004', alertType: '反馈预警', alertContent: '供应商未提交进度反馈', supplierName: '供应商A', createTime: '2026-02-02 14:30:00', status: 'handled' }
]);

const getStatusType = (status: string) => {
  switch (status) {
    case 'unhandled':
      return 'danger';
    case 'handled':
      return 'success';
    default:
      return 'info';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'unhandled':
      return '未处理';
    case 'handled':
      return '已处理';
    default:
      return status;
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
            { value: dashboardData.value.completedOrders, name: '已完成' },
            { value: dashboardData.value.totalOrders - dashboardData.value.completedOrders - dashboardData.value.warningOrders, name: '执行中' },
            { value: dashboardData.value.warningOrders, name: '预警' }
          ],
          color: ['#4CAF50', '#1E88E5', '#FF5252']
        }
      ]
    };
    orderStatusChart.value.setOption(option);
  }
};

const initOrderTrendChart = () => {
  if (orderTrendChartRef.value) {
    orderTrendChart.value = echarts.init(orderTrendChartRef.value);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单总数', '已完成订单']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单总数',
          type: 'line',
          data: [20, 30, 40, 25, 35, 45],
          smooth: true,
          color: '#1E88E5'
        },
        {
          name: '已完成订单',
          type: 'line',
          data: [15, 25, 30, 20, 30, 40],
          smooth: true,
          color: '#4CAF50'
        }
      ]
    };
    orderTrendChart.value.setOption(option);
  }
};

const initDeliveryRateChart = () => {
  if (deliveryRateChartRef.value) {
    deliveryRateChart.value = echarts.init(deliveryRateChartRef.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['准时交付率', '延期交付率']
      },
      xAxis: {
        type: 'category',
        data: ['供应商A', '供应商B', '供应商C']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '准时交付率',
          type: 'bar',
          data: [95, 85, 90],
          color: '#4CAF50'
        },
        {
          name: '延期交付率',
          type: 'bar',
          data: [5, 15, 10],
          color: '#FF5252'
        }
      ]
    };
    deliveryRateChart.value.setOption(option);
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

const handleQuery = async () => {
  try {
    const response = await monitorApi.getDashboard();
    dashboardData.value = response || dashboardData.value;
    
    // 重新初始化图表
    initOrderStatusChart();
    initOrderTrendChart();
    initDeliveryRateChart();
    initAlertTrendChart();
  } catch (error) {
    console.error('Query dashboard data error:', error);
    ElMessage.error('查询失败');
  }
};

const resetQuery = () => {
  queryForm.dateRange = null;
  queryForm.supplierId = '';
  handleQuery();
};

const handleExport = async () => {
  try {
    const response = await monitorApi.getOrderStats(queryForm);
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `数据监控报表_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export report error:', error);
    ElMessage.error('导出失败');
  }
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
};

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current;
};

const handleViewAlertDetail = (row: any) => {
  console.log('View alert detail:', row);
  // 跳转到预警详情页
};

const handleHandleAlert = async (row?: any) => {
  const alert = row;
  if (!alert) {
    ElMessage.warning('请选择要处理的预警');
    return;
  }
  
  try {
    await monitorApi.handleAlert(alert.id, { status: 'handled' });
    ElMessage.success('处理成功');
    // 更新预警状态
    alert.status = 'handled';
  } catch (error) {
    console.error('Handle alert error:', error);
    ElMessage.error('处理失败');
  }
};

onMounted(() => {
  handleQuery();
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    orderStatusChart.value?.resize();
    orderTrendChart.value?.resize();
    deliveryRateChart.value?.resize();
    alertTrendChart.value?.resize();
  });
});
</script>

<style scoped>
.monitor-container {
  padding: 20px;
}

.monitor-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.time-range-container {
  margin-bottom: 20px;
}

.query-form {
  margin-bottom: 0;
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

.chart {
  height: 300px;
}

.alert-list-container {
  margin-top: 30px;
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

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
  }
}
</style>