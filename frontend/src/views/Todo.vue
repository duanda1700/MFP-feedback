<template>
  <div class="todo-container">
    <h2>待办任务管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="search-filter-container">
      <el-card>
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="任务类型">
            <el-select v-model="searchForm.taskType" placeholder="请选择任务类型">
              <el-option label="审批" value="approval" />
              <el-option label="任务接收" value="task_receive" />
              <el-option label="进度反馈" value="progress_feedback" />
              <el-option label="预警处理" value="alert_handle" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="优先级">
            <el-select v-model="searchForm.priority" placeholder="请选择优先级">
              <el-option label="高" value="high" />
              <el-option label="中" value="medium" />
              <el-option label="低" value="low" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option label="待处理" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 待办任务列表 -->
    <div class="todo-list-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>待办任务列表</span>
            <el-button type="primary" @click="handleMarkAllAsDone">全部标记为已完成</el-button>
          </div>
        </template>
        
        <el-table :data="todoList" style="width: 100%" @row-click="handleTodoClick">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="任务ID" width="100" />
          <el-table-column prop="taskType" label="任务类型" />
          <el-table-column prop="taskContent" label="任务内容" />
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="scope">
              <el-tag :type="getPriorityType(scope.row.priority)">
                {{ scope.row.priority }}
              </el-tag>
            </template>
          </el-table-column>
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
              <el-button size="small" @click="handleViewDetail(scope.row)">详情</el-button>
              <el-button size="small" type="success" @click="handleMarkAsDone(scope.row.id)" v-if="scope.row.status !== 'completed'">标记完成</el-button>
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
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { todoApi } from '../api';

const searchForm = reactive({
  taskType: '',
  priority: '',
  status: ''
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 模拟数据
const todoList = ref([
  { id: '1', taskType: '审批', taskContent: '生产计划PP-2026-0001 审批', priority: '高', createTime: '2026-02-03 11:00:00', status: 'pending' },
  { id: '2', taskType: '任务接收', taskContent: '接收新任务 PO-2026-0001', priority: '中', createTime: '2026-02-03 10:00:00', status: 'pending' },
  { id: '3', taskType: '进度反馈', taskContent: '提交进度反馈 PP-2026-0002', priority: '中', createTime: '2026-02-03 09:30:00', status: 'processing' },
  { id: '4', taskType: '预警处理', taskContent: '处理进度预警 A001', priority: '高', createTime: '2026-02-03 09:00:00', status: 'pending' },
  { id: '5', taskType: '审批', taskContent: '采购订单PO-2026-0003 审批', priority: 'low', createTime: '2026-02-02 16:00:00', status: 'completed' }
]);

const getPriorityType = (priority: string) => {
  switch (priority) {
    case '高':
    case 'high':
      return 'danger';
    case '中':
    case 'medium':
      return 'warning';
    case '低':
    case 'low':
      return 'info';
    default:
      return 'info';
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'processing':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'info';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待处理';
    case 'processing':
      return '处理中';
    case 'completed':
      return '已完成';
    default:
      return status;
  }
};

const handleSearch = async () => {
  try {
    const response = await todoApi.getList({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    todoList.value = response.data || [];
    pagination.total = response.total || 0;
  } catch (error) {
    console.error('Search todo error:', error);
    ElMessage.error('搜索失败');
  }
};

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = '';
  });
  pagination.currentPage = 1;
  handleSearch();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  handleSearch();
};

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current;
  handleSearch();
};

const handleTodoClick = (row: any) => {
  console.log('Todo clicked:', row);
  // 跳转到任务详情页
};

const handleViewDetail = (row: any) => {
  console.log('View detail:', row);
  // 跳转到详情页
};

const handleMarkAsDone = async (id: string) => {
  try {
    await todoApi.markAsDone(id);
    ElMessage.success('标记成功');
    handleSearch();
  } catch (error) {
    console.error('Mark as done error:', error);
    ElMessage.error('标记失败');
  }
};

const handleMarkAllAsDone = () => {
  console.log('Mark all as done');
  // 批量标记为已完成
};
</script>

<style scoped>
.todo-container {
  padding: 20px;
}

.todo-container h2 {
  margin-bottom: 20px;
  color: #333;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>