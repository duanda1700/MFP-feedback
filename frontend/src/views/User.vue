<template>
  <div class="user-container">
    <h2>用户管理</h2>
    
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="search-area">
            <el-input 
              v-model="searchForm.keyword" 
              placeholder="搜索用户名/姓名" 
              clearable 
              style="width: 200px; margin-right: 10px"
              @keyup.enter="handleSearch"
            />
            <el-select v-model="searchForm.status" placeholder="状态" clearable style="width: 120px; margin-right: 10px">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </div>
          <el-button type="primary" @click="handleCreateUser">创建用户</el-button>
        </div>
      </template>
      
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column label="角色" width="200">
          <template #default="scope">
            <el-tag 
              v-for="role in scope.row.roles" 
              :key="role.id" 
              size="small" 
              style="margin-right: 4px"
            >
              {{ role.displayName }}
            </el-tag>
            <span v-if="!scope.row.roles?.length">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEditUser(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleAssignRoles(scope.row)">分配角色</el-button>
            <el-button size="small" type="warning" @click="handleResetPassword(scope.row)">重置密码</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDeleteUser(scope.row)" 
              v-if="scope.row.username !== 'admin'"
            >删除</el-button>
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
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog 
      v-model="userDialogVisible" 
      :title="isEdit ? '编辑用户' : '创建用户'" 
      width="600px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username" v-if="!isEdit">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="userForm.department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-switch v-model="userForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="roleDialogVisible" 
      title="分配角色" 
      width="500px"
    >
      <div class="role-header">
        <span>用户：{{ currentUser?.name }} ({{ currentUser?.username }})</span>
      </div>
      <div class="role-content" v-loading="loadingRoles">
        <el-checkbox-group v-model="selectedRoleIds">
          <div v-for="role in allRoles" :key="role.id" class="role-item">
            <el-checkbox :value="role.id">
              {{ role.displayName }}
              <span class="role-desc">{{ role.description }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRoles" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="passwordDialogVisible" 
      title="重置密码" 
      width="400px"
    >
      <div class="password-header">
        <span>用户：{{ currentUser?.name }} ({{ currentUser?.username }})</span>
      </div>
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPassword" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { userApi, permissionApi } from '../api';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: number;
  roles: { id: number; name: string; displayName: string }[];
  createTime: string;
}

interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
}

const loading = ref(false);
const loadingRoles = ref(false);
const submitting = ref(false);
const userList = ref<User[]>([]);
const allRoles = ref<Role[]>([]);
const selectedRoleIds = ref<number[]>([]);

const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);
const passwordDialogVisible = ref(false);
const isEdit = ref(false);
const currentUser = ref<User | null>(null);
const userFormRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

const searchForm = reactive({
  keyword: '',
  status: undefined as number | undefined
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const userForm = reactive({
  username: '',
  name: '',
  password: '',
  email: '',
  phone: '',
  department: '',
  status: 1
});

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});

const userRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
};

const passwordRules: FormRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('zh-CN');
};

const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await userApi.getList({
      keyword: searchForm.keyword || undefined,
      status: searchForm.status,
      page: pagination.page,
      pageSize: pagination.pageSize
    });
    userList.value = response.data?.list || response.list || [];
    pagination.total = response.data?.total || response.total || 0;
  } catch (error) {
    console.error('Load users error:', error);
    ElMessage.error('加载用户列表失败');
  } finally {
    loading.value = false;
  }
};

const loadAllRoles = async () => {
  try {
    const response = await permissionApi.getRoles();
    allRoles.value = response.data || response || [];
  } catch (error) {
    console.error('Load roles error:', error);
  }
};

const handleSearch = () => {
  pagination.page = 1;
  loadUsers();
};

const resetSearch = () => {
  searchForm.keyword = '';
  searchForm.status = undefined;
  pagination.page = 1;
  loadUsers();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  loadUsers();
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  loadUsers();
};

const resetUserForm = () => {
  userForm.username = '';
  userForm.name = '';
  userForm.password = '';
  userForm.email = '';
  userForm.phone = '';
  userForm.department = '';
  userForm.status = 1;
};

const handleCreateUser = () => {
  isEdit.value = false;
  resetUserForm();
  userDialogVisible.value = true;
};

const handleEditUser = (row: User) => {
  isEdit.value = true;
  currentUser.value = row;
  userForm.username = row.username;
  userForm.name = row.name;
  userForm.email = row.email || '';
  userForm.phone = row.phone || '';
  userForm.department = row.department || '';
  userForm.status = row.status;
  userDialogVisible.value = true;
};

const submitUserForm = async () => {
  if (!userFormRef.value) return;
  
  await userFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    submitting.value = true;
    try {
      if (isEdit.value && currentUser.value) {
        await userApi.update(currentUser.value.id, {
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          department: userForm.department,
          status: userForm.status
        });
        ElMessage.success('用户更新成功');
      } else {
        await userApi.create({
          username: userForm.username,
          password: userForm.password,
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          department: userForm.department
        });
        ElMessage.success('用户创建成功');
      }
      userDialogVisible.value = false;
      loadUsers();
    } catch (error: any) {
      console.error('Submit user error:', error);
      ElMessage.error(error.response?.data?.message || '操作失败');
    } finally {
      submitting.value = false;
    }
  });
};

const handleDeleteUser = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${row.name}"吗？删除后不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    await userApi.delete(row.id);
    ElMessage.success('用户删除成功');
    loadUsers();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Delete user error:', error);
      ElMessage.error(error.response?.data?.message || '删除失败');
    }
  }
};

const handleAssignRoles = async (row: User) => {
  currentUser.value = row;
  roleDialogVisible.value = true;
  
  loadingRoles.value = true;
  try {
    selectedRoleIds.value = (row.roles || []).map(r => r.id);
  } finally {
    loadingRoles.value = false;
  }
};

const submitRoles = async () => {
  if (!currentUser.value) return;
  
  submitting.value = true;
  try {
    await userApi.assignRoles(currentUser.value.id, selectedRoleIds.value);
    ElMessage.success('角色分配成功');
    roleDialogVisible.value = false;
    loadUsers();
  } catch (error: any) {
    console.error('Assign roles error:', error);
    ElMessage.error(error.response?.data?.message || '角色分配失败');
  } finally {
    submitting.value = false;
  }
};

const handleResetPassword = (row: User) => {
  currentUser.value = row;
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordDialogVisible.value = true;
};

const submitPassword = async () => {
  if (!passwordFormRef.value || !currentUser.value) return;
  
  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    submitting.value = true;
    try {
      await userApi.resetPassword(currentUser.value.id, passwordForm.newPassword);
      ElMessage.success('密码重置成功');
      passwordDialogVisible.value = false;
    } catch (error: any) {
      console.error('Reset password error:', error);
      ElMessage.error(error.response?.data?.message || '密码重置失败');
    } finally {
      submitting.value = false;
    }
  });
};

onMounted(() => {
  loadUsers();
  loadAllRoles();
});
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.user-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.role-header,
.password-header {
  margin-bottom: 16px;
  font-weight: bold;
}

.role-content {
  max-height: 400px;
  overflow-y: auto;
}

.role-item {
  margin-bottom: 12px;
}

.role-desc {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}
</style>
