<template>
  <div class="todo-container">
    <h2>待办任务管理</h2>
    
    <div class="stats-container">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-value">{{ statistics.total }}</div>
              <div class="stats-label">全部任务</div>
            </div>
            <el-icon class="stats-icon"><i-ep-document /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card pending" shadow="hover">
            <div class="stats-content">
              <div class="stats-value">{{ statistics.pending }}</div>
              <div class="stats-label">待处理</div>
            </div>
            <el-icon class="stats-icon"><i-ep-clock /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card processing" shadow="hover">
            <div class="stats-content">
              <div class="stats-value">{{ statistics.processing }}</div>
              <div class="stats-label">处理中</div>
            </div>
            <el-icon class="stats-icon"><i-ep-loading /></el-icon>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stats-card high-priority" shadow="hover">
            <div class="stats-content">
              <div class="stats-value">{{ statistics.highPriority }}</div>
              <div class="stats-label">高优先级</div>
            </div>
            <el-icon class="stats-icon"><i-ep-warning /></el-icon>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="任务类型">
            <el-select v-model="searchForm.taskType" placeholder="请选择任务类型" clearable style="width: 140px">
              <el-option label="审批" value="approval" />
              <el-option label="任务接收" value="task_receive" />
              <el-option label="进度反馈" value="progress_feedback" />
              <el-option label="预警处理" value="alert_handle" />
              <el-option label="订单确认" value="order_confirm" />
              <el-option label="计划确认" value="plan_confirm" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="优先级">
            <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable style="width: 120px">
              <el-option label="紧急" value="urgent" />
              <el-option label="高" value="high" />
              <el-option label="中" value="medium" />
              <el-option label="低" value="low" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="搜索标题/内容" clearable style="width: 180px" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <div class="todo-list-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>待办任务列表</span>
            <div class="header-actions">
              <el-button type="primary" @click="handleBatchComplete" :disabled="selectedIds.length === 0">
                批量完成 ({{ selectedIds.length }})
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="todoList" 
          style="width: 100%" 
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="taskType" label="任务类型" width="100">
            <template #default="scope">
              <el-tag :type="getTaskTypeStyle(scope.row.taskType)" size="small">
                {{ getTaskTypeText(scope.row.taskType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="任务标题" min-width="200" show-overflow-tooltip />
          <el-table-column prop="priority" label="优先级" width="80">
            <template #default="scope">
              <el-tag :type="getPriorityType(scope.row.priority)" size="small">
                {{ getPriorityText(scope.row.priority) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="90">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" width="100" />
          <el-table-column prop="createdAt" label="创建时间" width="160">
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="dueDate" label="截止时间" width="160">
            <template #default="scope">
              <span :class="{ 'overdue': isOverdue(scope.row) }">
                {{ scope.row.dueDate ? formatDate(scope.row.dueDate) : '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleViewDetail(scope.row)">详情</el-button>
              <el-button 
                size="small" 
                type="primary" 
                @click="handleStart(scope.row)" 
                v-if="scope.row.status === 'pending'"
              >开始</el-button>
              <el-button 
                size="small" 
                type="success" 
                @click="handleComplete(scope.row)" 
                v-if="scope.row.status !== 'completed' && scope.row.status !== 'cancelled'"
              >完成</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.page"
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
    
    <el-dialog v-model="detailDialogVisible" title="任务详情" width="600px">
      <el-descriptions :column="2" border v-if="currentTask">
        <el-descriptions-item label="任务ID">{{ currentTask.id }}</el-descriptions-item>
        <el-descriptions-item label="任务类型">
          <el-tag :type="getTaskTypeStyle(currentTask.taskType)" size="small">
            {{ getTaskTypeText(currentTask.taskType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="任务标题" :span="2">{{ currentTask.title }}</el-descriptions-item>
        <el-descriptions-item label="任务内容" :span="2">{{ currentTask.content || '-' }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(currentTask.priority)" size="small">
            {{ getPriorityText(currentTask.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentTask.status)" size="small">
            {{ getStatusText(currentTask.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentTask.creatorName }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ currentTask.assigneeName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(currentTask.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="截止时间">{{ currentTask.dueDate ? formatDate(currentTask.dueDate) : '-' }}</el-descriptions-item>
        <el-descriptions-item label="完成时间" :span="2">
          {{ currentTask.completedAt ? formatDate(currentTask.completedAt) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentTask.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button 
          type="primary" 
          @click="handleStart(currentTask)" 
          v-if="currentTask?.status === 'pending'"
        >开始处理</el-button>
        <el-button 
          type="success" 
          @click="handleComplete(currentTask)" 
          v-if="currentTask && currentTask.status !== 'completed' && currentTask.status !== 'cancelled'"
        >标记完成</el-button>
      </template>
    </el-dialog>
    
    <el-dialog v-model="completeDialogVisible" title="完成任务" width="400px">
      <el-form :model="completeForm" label-width="80px">
        <el-form-item label="备注">
          <el-input 
            v-model="completeForm.remark" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入完成备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="completeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmComplete" :loading="submitting">确认完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { todoApi } from '../api';

const loading = ref(false);
const submitting = ref(false);

const searchForm = reactive({
  taskType: '',
  priority: '',
  status: '',
  keyword: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const statistics = reactive({
  total: 0,
  pending: 0,
  processing: 0,
  completed: 0,
  highPriority: 0
});

const todoList = ref<any[]>([]);
const selectedIds = ref<number[]>([]);
const detailDialogVisible = ref(false);
const completeDialogVisible = ref(false);
const currentTask = ref<any>(null);
const completeForm = reactive({
  remark: ''
});

const taskTypeMap: Record<string, { text: string; type: string }> = {
  approval: { text: '审批', type: 'primary' },
  task_receive: { text: '任务接收', type: 'info' },
  progress_feedback: { text: '进度反馈', type: 'warning' },
  alert_handle: { text: '预警处理', type: 'danger' },
  order_confirm: { text: '订单确认', type: 'success' },
  plan_confirm: { text: '计划确认', type: 'success' }
};

const priorityMap: Record<string, { text: string; type: string }> = {
  urgent: { text: '紧急', type: 'danger' },
  high: { text: '高', type: 'warning' },
  medium: { text: '中', type: 'info' },
  low: { text: '低', type: '' }
};

const getTaskTypeText = (type: string) => taskTypeMap[type]?.text || type;
const getTaskTypeStyle = (type: string) => taskTypeMap[type]?.type || 'info';
const getPriorityText = (priority: string) => priorityMap[priority]?.text || priority;
const getPriorityType = (priority: string) => priorityMap[priority]?.type || 'info';

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    completed: 'success',
    cancelled: 'danger'
  };
  return map[status] || 'info';
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return map[status] || status;
};

const formatDate = (date: string | Date) => {
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

const isOverdue = (task: any) => {
  if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};

const loadStatistics = async () => {
  try {
    const res = await todoApi.getStatistics();
    Object.assign(statistics, res);
  } catch (error) {
    console.error('Load statistics error:', error);
  }
};

const loadTodoList = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize
    };
    
    if (searchForm.taskType) params.taskType = searchForm.taskType;
    if (searchForm.priority) params.priority = searchForm.priority;
    if (searchForm.status) params.status = searchForm.status;
    if (searchForm.keyword) params.keyword = searchForm.keyword;
    
    const res = await todoApi.getMyTasks(params) as any;
    todoList.value = res.data || [];
    pagination.total = res.total || 0;
  } catch (error) {
    console.error('Load todo list error:', error);
    ElMessage.error('加载待办任务失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.page = 1;
  loadTodoList();
};

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = '';
  });
  pagination.page = 1;
  loadTodoList();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  loadTodoList();
};

const handleCurrentChange = (current: number) => {
  pagination.page = current;
  loadTodoList();
};

const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleViewDetail = (row: any) => {
  currentTask.value = row;
  detailDialogVisible.value = true;
};

const handleStart = async (row: any) => {
  try {
    await todoApi.start(row.id);
    ElMessage.success('任务已开始处理');
    detailDialogVisible.value = false;
    loadTodoList();
    loadStatistics();
  } catch (error) {
    console.error('Start task error:', error);
    ElMessage.error('操作失败');
  }
};

const handleComplete = (row: any) => {
  currentTask.value = row;
  completeForm.remark = '';
  completeDialogVisible.value = true;
};

const confirmComplete = async () => {
  if (!currentTask.value) return;
  
  submitting.value = true;
  try {
    await todoApi.complete(currentTask.value.id, completeForm.remark);
    ElMessage.success('任务已完成');
    completeDialogVisible.value = false;
    detailDialogVisible.value = false;
    loadTodoList();
    loadStatistics();
  } catch (error) {
    console.error('Complete task error:', error);
    ElMessage.error('操作失败');
  } finally {
    submitting.value = false;
  }
};

const handleBatchComplete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要完成的任务');
    return;
  }
  
  try {
    const res = await todoApi.batchComplete(selectedIds.value) as any;
    ElMessage.success(`成功完成 ${res.success} 个任务${res.failed > 0 ? `，失败 ${res.failed} 个` : ''}`);
    selectedIds.value = [];
    loadTodoList();
    loadStatistics();
  } catch (error) {
    console.error('Batch complete error:', error);
    ElMessage.error('批量操作失败');
  }
};

onMounted(() => {
  loadStatistics();
  loadTodoList();
});
</script>

<style scoped>
.todo-container {
  padding: 20px;
}

.todo-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.stats-container {
  margin-bottom: 20px;
}

.stats-card {
  position: relative;
  overflow: hidden;
}

.stats-card .stats-content {
  position: relative;
  z-index: 1;
}

.stats-card .stats-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stats-card .stats-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.stats-card .stats-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  color: rgba(0, 0, 0, 0.1);
}

.stats-card.pending .stats-value {
  color: #909399;
}

.stats-card.processing .stats-value {
  color: #E6A23C;
}

.stats-card.high-priority .stats-value {
  color: #F56C6C;
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

.header-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.overdue {
  color: #F56C6C;
  font-weight: bold;
}
</style>
