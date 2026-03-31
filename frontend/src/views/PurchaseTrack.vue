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
          <div class="stat-number">{{ statistics.total }}</div>
          <div class="stat-label">总订单数</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ statistics.pending }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ statistics.confirmed }}</div>
          <div class="stat-label">已确认</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ statistics.inProgress }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ statistics.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-card>
    </div>

    <div class="status-sections">
      <div class="status-section" v-if="ordersByStatus.pending.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-time"></i> 待处理订单
            <span class="order-count">{{ ordersByStatus.pending.length }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus.pending" 
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
            <el-alert
              v-if="order.feedbackStatus === '已延期'"
              title="该订单已延期，请及时跟进处理"
              type="error"
              :closable="false"
              show-icon
              class="delay-alert"
            />
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
              <div class="detail-item">
                <label>计划数:</label>
                <span>{{ order.planCount || 0 }} 项</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order)">查看详情</el-button>
              <el-button size="small" type="primary" @click="viewOrderDetail(order)">开始处理</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="status-section" v-if="ordersByStatus.confirmed.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-loading"></i> 已确认订单
            <span class="order-count">{{ ordersByStatus.confirmed.length }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus.confirmed" 
            :key="order.id"
            shadow="hover"
            class="order-card"
          >
            <div class="order-card-header">
              <div class="order-info">
                <h3 class="order-no">{{ order.djbH }}</h3>
                <div class="order-status status-confirmed">{{ order.orderStatus }}</div>
              </div>
              <div class="order-date">{{ formatDate(order.createTime) }}</div>
            </div>
            <el-alert
              v-if="order.feedbackStatus === '已延期'"
              title="该订单已延期，请及时跟进处理"
              type="error"
              :closable="false"
              show-icon
              class="delay-alert"
            />
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
              <div class="detail-item">
                <label>反馈进度:</label>
                <span>{{ order.feedbackProgress }}%</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order)">查看详情</el-button>
              <el-button size="small" type="warning" @click="openCompareDialog(order)">计划对比</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="status-section" v-if="ordersByStatus.inProgress.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-loading"></i> 进行中订单
            <span class="order-count">{{ ordersByStatus.inProgress.length }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus.inProgress" 
            :key="order.id"
            shadow="hover"
            class="order-card"
          >
            <div class="order-card-header">
              <div class="order-info">
                <h3 class="order-no">{{ order.djbH }}</h3>
                <div class="order-status status-inProgress">{{ order.orderStatus }}</div>
              </div>
              <div class="order-date">{{ formatDate(order.createTime) }}</div>
            </div>
            <el-alert
              v-if="order.feedbackStatus === '已延期'"
              title="该订单已延期，请及时跟进处理"
              type="error"
              :closable="false"
              show-icon
              class="delay-alert"
            />
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
              <div class="detail-item">
                <label>反馈进度:</label>
                <span>{{ order.feedbackProgress }}%</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order)">查看详情</el-button>
              <el-button size="small" type="warning" @click="openCompareDialog(order)">计划对比</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="status-section" v-if="ordersByStatus.delayed.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-warning"></i> 已延期订单
            <span class="order-count">{{ ordersByStatus.delayed.length }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus.delayed" 
            :key="order.id"
            shadow="hover"
            class="order-card"
          >
            <div class="order-card-header">
              <div class="order-info">
                <h3 class="order-no">{{ order.djbH }}</h3>
                <div class="order-status status-delayed">{{ order.orderStatus }}</div>
              </div>
              <div class="order-date">{{ formatDate(order.createTime) }}</div>
            </div>
            <el-alert
              v-if="order.feedbackStatus === '已延期'"
              title="该订单已延期，请及时跟进处理"
              type="error"
              :closable="false"
              show-icon
              class="delay-alert"
            />
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
              <div class="detail-item">
                <label>反馈进度:</label>
                <span>{{ order.feedbackProgress }}%</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order)">查看详情</el-button>
              <el-button size="small" type="warning" @click="openCompareDialog(order)">计划对比</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div class="status-section" v-if="ordersByStatus.completed.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <i class="el-icon-check"></i> 已完成订单
            <span class="order-count">{{ ordersByStatus.completed.length }}</span>
          </h2>
        </div>
        <div class="order-cards">
          <el-card 
            v-for="order in ordersByStatus.completed" 
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
            <el-alert
              v-if="order.feedbackStatus === '已延期'"
              title="该订单已延期，请及时跟进处理"
              type="error"
              :closable="false"
              show-icon
              class="delay-alert"
            />
            <div class="order-details">
              <div class="detail-item">
                <label>采购经理:</label>
                <span>{{ order.purchaseManager || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>供应商:</label>
                <span>{{ order.supplierName || '-' }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <span>{{ order.orderStatus }}</span>
              </div>
            </div>
            <div class="order-actions">
              <el-button size="small" @click="viewOrderDetail(order)">查看详情</el-button>
            </div>
          </el-card>
        </div>
      </div>

      <div v-if="statistics.total === 0" class="empty-state">
        <el-empty description="暂无采购订单数据" />
      </div>
    </div>

    <el-dialog 
      v-model="detailDialogVisible" 
      :title="`订单详情 - ${currentOrder?.djbH || ''}`"
      width="90%"
      top="5vh"
    >
      <div v-if="detailLoading" style="text-align: center; padding: 40px;">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <p>加载中...</p>
      </div>
      <div v-else-if="orderDetail" class="detail-content">
        <div class="detail-header">
          <el-descriptions :column="4" border>
            <el-descriptions-item label="订单编号">{{ orderDetail.order.djbH }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(orderDetail.order.orderStatus)">{{ orderDetail.order.orderStatus }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="供应商">{{ orderDetail.order.supplierName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="采购经理">{{ orderDetail.order.purchaseManager || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="detail-stats">
          <el-row :gutter="16">
            <el-col :span="4">
              <el-statistic title="总计划数" :value="orderDetail.statistics.totalPlans" />
            </el-col>
            <el-col :span="4">
              <el-statistic title="已完成" :value="orderDetail.statistics.completedPlans" />
            </el-col>
            <el-col :span="4">
              <el-statistic title="进行中" :value="orderDetail.statistics.inProgressPlans" />
            </el-col>
            <el-col :span="4">
              <el-statistic title="已延期" :value="orderDetail.statistics.delayedPlans" />
            </el-col>
            <el-col :span="4">
              <el-statistic title="未开始" :value="orderDetail.statistics.notStartedPlans" />
            </el-col>
          </el-row>
        </div>

        <div class="detail-plans">
          <h4>计划明细及反馈情况</h4>
          <el-table :data="orderDetail.plans" border stripe max-height="400">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="materialCode" label="物料编码" width="120" />
            <el-table-column prop="materialDesc" label="物料描述" min-width="150" show-overflow-tooltip />
            <el-table-column prop="planClass" label="计划分类" width="120" />
            <el-table-column prop="quantity" label="计划数量" width="100" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="plannedDate" label="计划交付日期" width="120">
              <template #default="scope">
                {{ formatDate(scope.row.plannedDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="feedbackStatus" label="反馈状态" width="100">
              <template #default="scope">
                <el-tag :type="getFeedbackStatusType(scope.row.feedbackStatus)" size="small">
                  {{ scope.row.feedbackStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="latestFeedback.finishedQuantity" label="完成数量" width="100" />
            <el-table-column prop="latestFeedback.actualDeliveryDate" label="实际交付日期" width="120">
              <template #default="scope">
                {{ scope.row.latestFeedback?.actualDeliveryDate ? formatDate(scope.row.latestFeedback.actualDeliveryDate) : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.feedbackHistory && scope.row.feedbackHistory.length > 0"
                  size="small" 
                  type="primary" 
                  link
                  @click="showPlanHistory(scope.row)"
                >
                  查看历史
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      v-model="compareDialogVisible" 
      :title="`计划模板对比 - ${currentOrder?.djbH || ''}`"
      width="95%"
      top="3vh"
      destroy-on-close
    >
      <div v-if="compareLoading" style="text-align: center; padding: 40px;">
        <el-icon class="is-loading" :size="40"><Loading /></el-icon>
        <p>加载中...</p>
      </div>
      <div v-else-if="compareData" class="compare-content">
        <div class="compare-header">
          <el-alert 
            :title="`共 ${compareData.totalItems} 项计划，${compareData.versions?.length || 0} 个版本，其中 ${compareData.changedItems} 项有变更`" 
            type="info" 
            show-icon 
            style="margin-bottom: 16px;"
          />
          <div class="version-selector" v-if="compareData.versions?.length > 1">
            <span class="selector-label">选择对比版本：</span>
            <el-select v-model="selectedCompareVersions" multiple placeholder="选择要对比的版本" style="width: 300px;">
              <el-option
                v-for="v in compareData.versions"
                :key="v"
                :label="`版本 ${v}`"
                :value="v"
              />
            </el-select>
            <el-checkbox v-model="showOnlyChanged" style="margin-left: 20px;">仅显示变更项</el-checkbox>
          </div>
        </div>
        
        <div class="compare-table-wrapper">
          <el-table 
            :data="filteredCompareData" 
            border 
            stripe 
            max-height="500"
            :row-class-name="getCompareRowClass"
          >
            <el-table-column type="index" label="序号" width="60" fixed />
            <el-table-column prop="materialCode" label="物料编码" width="130" fixed />
            <el-table-column prop="materialDesc" label="物料描述" min-width="150" show-overflow-tooltip fixed />
            <el-table-column prop="planClass" label="计划分类" width="100" fixed />
            
            <el-table-column 
              v-for="version in displayVersions" 
              :key="version"
              :label="`版本 ${version}`"
              min-width="180"
            >
              <template #header>
                <div class="version-header" :class="{ 'latest-version': version === maxVersion }">
                  <span>版本 {{ version }}</span>
                  <el-tag v-if="version === maxVersion" type="success" size="small" style="margin-left: 5px;">最新</el-tag>
                  <el-tag v-if="version === minVersion" type="info" size="small" style="margin-left: 5px;">初始</el-tag>
                </div>
              </template>
              <template #default="scope">
                <div v-if="scope.row.versions[version]" class="version-cell" :class="getVersionCellClass(scope.row, version)">
                  <div class="version-item">
                    <span class="item-label">数量:</span>
                    <span class="item-value">{{ scope.row.versions[version].quantity }}</span>
                  </div>
                  <div class="version-item">
                    <span class="item-label">日期:</span>
                    <span class="item-value">{{ formatDate(scope.row.versions[version].plannedDate) }}</span>
                  </div>
                  <div class="version-item" v-if="scope.row.versions[version].sfzz">
                    <span class="item-label">自制:</span>
                    <span class="item-value">{{ scope.row.versions[version].sfzz }}</span>
                  </div>
                  <div class="version-item" v-if="scope.row.versions[version].remarks">
                    <span class="item-label">备注:</span>
                    <span class="item-value">{{ scope.row.versions[version].remarks }}</span>
                  </div>
                </div>
                <div v-else class="version-cell empty">
                  <span class="empty-text">无数据</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="变更详情" min-width="220" fixed="right">
              <template #default="scope">
                <div v-if="scope.row.changes.hasChanges" class="change-details">
                  <div v-for="(change, idx) in scope.row.changes.fields" :key="idx" class="change-item">
                    <span class="change-field">{{ change.fieldName }}:</span>
                    <span class="change-old">{{ formatChangeValue(change.original) }}</span>
                    <el-icon class="change-arrow"><Right /></el-icon>
                    <span class="change-new">{{ formatChangeValue(change.latest) }}</span>
                  </div>
                </div>
                <el-tag v-else type="success" size="small">无变更</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <div class="compare-legend">
          <span class="legend-title">图例说明：</span>
          <span class="legend-item">
            <span class="legend-color added"></span>新增内容
          </span>
          <span class="legend-item">
            <span class="legend-color removed"></span>删除内容
          </span>
          <span class="legend-item">
            <span class="legend-color changed"></span>变更内容
          </span>
        </div>
      </div>
    </el-dialog>

    <el-dialog 
      v-model="planHistoryDialogVisible" 
      title="计划反馈历史"
      width="70%"
    >
      <el-table v-if="currentPlanHistory" :data="currentPlanHistory" border stripe>
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="feedbackTime" label="反馈时间" width="160">
          <template #default="scope">
            {{ formatDateTime(scope.row.feedbackTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="progressStatus" label="进展状态" width="100">
          <template #default="scope">
            <el-tag :type="getFeedbackStatusType(scope.row.progressStatus)" size="small">
              {{ scope.row.progressStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="finishedQuantity" label="完成数量" width="100" />
        <el-table-column prop="actualDeliveryDate" label="实际交付日期" width="120">
          <template #default="scope">
            {{ scope.row.actualDeliveryDate ? formatDate(scope.row.actualDeliveryDate) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="150" show-overflow-tooltip />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Loading, Right } from '@element-plus/icons-vue';
import { orderTrackingApi } from '../api';

const ordersByStatus = ref<any>({
  pending: [],
  confirmed: [],
  inProgress: [],
  completed: [],
  delayed: []
});

const statistics = ref({
  total: 0,
  pending: 0,
  confirmed: 0,
  inProgress: 0,
  completed: 0
});

const loading = ref(false);

const detailDialogVisible = ref(false);
const detailLoading = ref(false);
const currentOrder = ref<any>(null);
const orderDetail = ref<any>(null);

const compareDialogVisible = ref(false);
const compareLoading = ref(false);
const compareData = ref<any>(null);
const selectedCompareVersions = ref<number[]>([]);
const showOnlyChanged = ref(false);

const planHistoryDialogVisible = ref(false);
const currentPlanHistory = ref<any[]>([]);

const displayVersions = computed(() => {
  if (!compareData.value?.versions) return [];
  if (selectedCompareVersions.value.length === 0) {
    return compareData.value.versions;
  }
  return selectedCompareVersions.value.sort((a, b) => a - b);
});

const maxVersion = computed(() => {
  if (!compareData.value?.versions?.length) return 0;
  return Math.max(...compareData.value.versions);
});

const minVersion = computed(() => {
  if (!compareData.value?.versions?.length) return 0;
  return Math.min(...compareData.value.versions);
});

const filteredCompareData = computed(() => {
  if (!compareData.value?.comparison) return [];
  if (showOnlyChanged.value) {
    return compareData.value.comparison.filter((item: any) => item.changes.hasChanges);
  }
  return compareData.value.comparison;
});

const formatDate = (date: any) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatChangeValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  if (value instanceof Date) return formatDate(value);
  return String(value);
};

const getCompareRowClass = ({ row }: { row: any }) => {
  if (row.changes.hasChanges) {
    return 'row-changed';
  }
  return '';
};

const getVersionCellClass = (row: any, version: number) => {
  if (!row.changes.hasChanges) return '';
  
  const changedFields = row.changes.fields.map((f: any) => f.field);
  const versionData = row.versions[version];
  if (!versionData) return 'cell-empty';
  
  const prevVersion = compareData.value?.versions?.find((v: number) => v < version);
  if (!prevVersion) return '';
  
  const prevData = row.versions[prevVersion];
  if (!prevData) return 'cell-added';
  
  let hasChange = false;
  changedFields.forEach((field: string) => {
    if (versionData[field] !== prevData[field]) {
      hasChange = true;
    }
  });
  
  return hasChange ? 'cell-changed' : '';
};

const formatDateTime = (date: any) => {
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

const getStatusType = (status: string) => {
  const typeMap: any = {
    '待下发': 'info',
    '已下发': 'warning',
    '已确认': 'primary',
    '已完成': 'success'
  };
  return typeMap[status] || 'info';
};

const getFeedbackStatusType = (status: string) => {
  const typeMap: any = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success',
    '已延期': 'danger',
    '已取消': 'info'
  };
  return typeMap[status] || 'info';
};

const getFieldName = (field: string) => {
  const nameMap: any = {
    quantity: '数量',
    plannedDate: '计划交付日期',
    materialDesc: '物料描述',
    remarks: '备注'
  };
  return nameMap[field] || field;
};

const loadOrders = async () => {
  loading.value = true;
  try {
    const response: any = await orderTrackingApi.getOrders();
    ordersByStatus.value = response || {
      pending: [],
      processing: [],
      completed: []
    };
  } catch (error) {
    ElMessage.error('加载订单数据失败');
    console.error('加载订单数据失败:', error);
  } finally {
    loading.value = false;
  }
};

const loadStatistics = async () => {
  try {
    const response: any = await orderTrackingApi.getStatistics();
    statistics.value = response || {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0
    };
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

const refreshData = () => {
  loadOrders();
  loadStatistics();
};

const viewOrderDetail = async (order: any) => {
  currentOrder.value = order;
  detailDialogVisible.value = true;
  detailLoading.value = true;
  
  try {
    const response: any = await orderTrackingApi.getDetail(order.djbH);
    orderDetail.value = response;
  } catch (error) {
    ElMessage.error('加载订单详情失败');
    console.error('加载订单详情失败:', error);
  } finally {
    detailLoading.value = false;
  }
};

const openCompareDialog = async (order: any) => {
  currentOrder.value = order;
  compareDialogVisible.value = true;
  compareLoading.value = true;
  selectedCompareVersions.value = [];
  showOnlyChanged.value = false;
  
  try {
    const response: any = await orderTrackingApi.comparePlans(order.djbH);
    compareData.value = response;
  } catch (error) {
    ElMessage.error('加载计划对比数据失败');
    console.error('加载计划对比数据失败:', error);
  } finally {
    compareLoading.value = false;
  }
};

const showPlanHistory = (plan: any) => {
  currentPlanHistory.value = plan.feedbackHistory || [];
  planHistoryDialogVisible.value = true;
};

onMounted(() => {
  loadOrders();
  loadStatistics();
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

.status-confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-inProgress {
  background-color: #f0f5ff;
  color: #2f54eb;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-delayed {
  background-color: #fff1f0;
  color: #f5222d;
}

.delay-alert {
  margin: 12px 0;
  border-radius: 4px;
}

.delay-alert :deep(.el-alert__content) {
  padding: 0;
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
  flex-wrap: wrap;
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

.detail-content {
  padding: 0 10px;
}

.detail-header {
  margin-bottom: 20px;
}

.detail-stats {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.detail-plans h4 {
  margin-bottom: 12px;
  color: #303133;
}

.compare-content,
.history-content {
  padding: 0 10px;
}

.change-item {
  margin-bottom: 4px;
  font-size: 13px;
}

.change-field {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

.change-old {
  color: #F56C6C;
}

.change-arrow {
  margin: 0 8px;
  color: #909399;
}

.change-new {
  color: #67C23A;
}

.compare-header {
  margin-bottom: 20px;
}

.version-selector {
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.selector-label {
  font-weight: 500;
  color: #606266;
  margin-right: 12px;
}

.compare-table-wrapper {
  margin-top: 16px;
}

.version-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.latest-version {
  font-weight: bold;
}

.version-cell {
  padding: 8px;
  font-size: 13px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.version-cell.empty {
  background-color: #f5f5f5;
  text-align: center;
  padding: 20px 8px;
}

.empty-text {
  color: #909399;
  font-style: italic;
}

.version-item {
  display: flex;
  margin-bottom: 4px;
}

.version-item:last-child {
  margin-bottom: 0;
}

.item-label {
  color: #909399;
  min-width: 40px;
}

.item-value {
  color: #303133;
  font-weight: 500;
}

.cell-changed {
  background-color: #fff7e6;
  border-left: 3px solid #fa8c16;
}

.cell-added {
  background-color: #f6ffed;
  border-left: 3px solid #52c41a;
}

.cell-empty {
  background-color: #fff1f0;
}

:deep(.row-changed) {
  background-color: #fafafa !important;
}

:deep(.row-changed:hover > td) {
  background-color: #f5f5f5 !important;
}

.change-details {
  font-size: 13px;
}

.change-details .change-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 4px 8px;
  background-color: #fafafa;
  border-radius: 4px;
}

.change-details .change-item:last-child {
  margin-bottom: 0;
}

.change-details .change-field {
  min-width: 70px;
}

.change-details .change-arrow {
  font-size: 12px;
}

.compare-legend {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  font-size: 13px;
}

.legend-title {
  font-weight: 500;
  color: #606266;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.added {
  background-color: #52c41a;
}

.legend-color.removed {
  background-color: #ff4d4f;
}

.legend-color.changed {
  background-color: #fa8c16;
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
