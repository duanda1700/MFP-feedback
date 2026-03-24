<template>
  <div class="permission-container">
    <h2>权限管理</h2>
    
    <div class="role-management-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>角色管理</span>
            <el-button type="primary" @click="handleCreateRole">创建角色</el-button>
          </div>
        </template>
        
        <el-table :data="roles" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="角色标识" width="150" />
          <el-table-column prop="displayName" label="角色名称" width="150" />
          <el-table-column prop="description" label="角色描述" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEditRole(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleAssignPermission(scope.row)">分配权限</el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDeleteRole(scope.row)" 
                v-if="scope.row.name !== 'admin'"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <div class="permission-list-container">
      <el-card>
        <template #header>
          <span>权限列表</span>
        </template>
        
        <el-table :data="permissionsByModule" style="width: 100%" v-loading="loadingPermissions">
          <el-table-column prop="module" label="所属模块" width="120" />
          <el-table-column prop="name" label="权限名称" width="150" />
          <el-table-column prop="code" label="权限编码" width="200" />
          <el-table-column prop="description" label="权限描述" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog 
      v-model="roleDialogVisible" 
      :title="isEdit ? '编辑角色' : '创建角色'" 
      width="500px"
    >
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色标识" prop="name" v-if="!isEdit">
          <el-input v-model="roleForm.name" placeholder="请输入角色标识（英文）" />
        </el-form-item>
        <el-form-item label="角色名称" prop="displayName">
          <el-input v-model="roleForm.displayName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-switch v-model="roleForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRoleForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="permissionDialogVisible" 
      title="分配权限" 
      width="600px"
    >
      <div class="permission-header">
        <span>角色：{{ currentRole?.displayName }}</span>
      </div>
      <div class="permission-content" v-loading="loadingPermissions">
        <div v-for="(perms, module) in permissionsGrouped" :key="module" class="permission-module">
          <div class="module-header">
            <el-checkbox 
              :model-value="isModuleAllSelected(module)"
              :indeterminate="isModuleIndeterminate(module)"
              @change="(val: boolean) => handleModuleSelectAll(module, val)"
            >
              {{ module }}
            </el-checkbox>
          </div>
          <div class="module-permissions">
            <el-checkbox 
              v-for="perm in perms" 
              :key="perm.id"
              :model-value="selectedPermissions.includes(perm.id)"
              @change="(val: boolean) => handlePermissionSelect(perm.id, val)"
            >
              {{ perm.name }}
            </el-checkbox>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPermissions" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { permissionApi } from '../api';

interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  status: number;
  createTime: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  module: string;
  description: string;
  status: number;
}

const loading = ref(false);
const loadingPermissions = ref(false);
const submitting = ref(false);
const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const selectedPermissions = ref<number[]>([]);

const roleDialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const isEdit = ref(false);
const currentRole = ref<Role | null>(null);
const roleFormRef = ref<FormInstance>();

const roleForm = reactive({
  name: '',
  displayName: '',
  description: '',
  status: 1
});

const roleRules: FormRules = {
  name: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-z_]+$/, message: '角色标识只能包含小写字母和下划线', trigger: 'blur' }
  ],
  displayName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ]
};

const permissionsByModule = computed(() => {
  return permissions.value;
});

const permissionsGrouped = computed(() => {
  const grouped: Record<string, Permission[]> = {};
  for (const perm of permissions.value) {
    if (!grouped[perm.module]) {
      grouped[perm.module] = [];
    }
    grouped[perm.module].push(perm);
  }
  return grouped;
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('zh-CN');
};

const loadRoles = async () => {
  loading.value = true;
  try {
    const response = await permissionApi.getRoles();
    roles.value = response.data || response || [];
  } catch (error) {
    console.error('Load roles error:', error);
    ElMessage.error('加载角色失败');
  } finally {
    loading.value = false;
  }
};

const loadPermissions = async () => {
  loadingPermissions.value = true;
  try {
    const response = await permissionApi.getPermissions();
    permissions.value = response.data || response || [];
  } catch (error) {
    console.error('Load permissions error:', error);
    ElMessage.error('加载权限失败');
  } finally {
    loadingPermissions.value = false;
  }
};

const resetRoleForm = () => {
  roleForm.name = '';
  roleForm.displayName = '';
  roleForm.description = '';
  roleForm.status = 1;
};

const handleCreateRole = () => {
  isEdit.value = false;
  resetRoleForm();
  roleDialogVisible.value = true;
};

const handleEditRole = (row: Role) => {
  isEdit.value = true;
  currentRole.value = row;
  roleForm.name = row.name;
  roleForm.displayName = row.displayName;
  roleForm.description = row.description || '';
  roleForm.status = row.status;
  roleDialogVisible.value = true;
};

const submitRoleForm = async () => {
  if (!roleFormRef.value) return;
  
  await roleFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    submitting.value = true;
    try {
      if (isEdit.value && currentRole.value) {
        await permissionApi.updateRole(currentRole.value.id, {
          displayName: roleForm.displayName,
          description: roleForm.description,
          status: roleForm.status
        });
        ElMessage.success('角色更新成功');
      } else {
        await permissionApi.createRole({
          name: roleForm.name,
          displayName: roleForm.displayName,
          description: roleForm.description
        });
        ElMessage.success('角色创建成功');
      }
      roleDialogVisible.value = false;
      loadRoles();
    } catch (error: any) {
      console.error('Submit role error:', error);
      ElMessage.error(error.response?.data?.message || '操作失败');
    } finally {
      submitting.value = false;
    }
  });
};

const handleDeleteRole = async (row: Role) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${row.displayName}"吗？删除后不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    await permissionApi.deleteRole(row.id);
    ElMessage.success('角色删除成功');
    loadRoles();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Delete role error:', error);
      ElMessage.error(error.response?.data?.message || '删除失败');
    }
  }
};

const handleAssignPermission = async (row: Role) => {
  currentRole.value = row;
  permissionDialogVisible.value = true;
  
  try {
    const response = await permissionApi.getRolePermissions(row.id);
    selectedPermissions.value = response.data || response || [];
  } catch (error) {
    console.error('Load role permissions error:', error);
    selectedPermissions.value = [];
  }
};

const isModuleAllSelected = (module: string) => {
  const modulePerms = permissionsGrouped.value[module] || [];
  return modulePerms.length > 0 && modulePerms.every(p => selectedPermissions.value.includes(p.id));
};

const isModuleIndeterminate = (module: string) => {
  const modulePerms = permissionsGrouped.value[module] || [];
  const selectedCount = modulePerms.filter(p => selectedPermissions.value.includes(p.id)).length;
  return selectedCount > 0 && selectedCount < modulePerms.length;
};

const handleModuleSelectAll = (module: string, val: boolean) => {
  const modulePerms = permissionsGrouped.value[module] || [];
  if (val) {
    const newIds = modulePerms.map(p => p.id).filter(id => !selectedPermissions.value.includes(id));
    selectedPermissions.value = [...selectedPermissions.value, ...newIds];
  } else {
    const removeIds = modulePerms.map(p => p.id);
    selectedPermissions.value = selectedPermissions.value.filter(id => !removeIds.includes(id));
  }
};

const handlePermissionSelect = (permId: number, val: boolean) => {
  if (val) {
    if (!selectedPermissions.value.includes(permId)) {
      selectedPermissions.value.push(permId);
    }
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(id => id !== permId);
  }
};

const submitPermissions = async () => {
  if (!currentRole.value) return;
  
  submitting.value = true;
  try {
    await permissionApi.assignPermissions(currentRole.value.id, selectedPermissions.value);
    ElMessage.success('权限分配成功');
    permissionDialogVisible.value = false;
  } catch (error: any) {
    console.error('Assign permissions error:', error);
    ElMessage.error(error.response?.data?.message || '权限分配失败');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadRoles();
  loadPermissions();
});
</script>

<style scoped>
.permission-container {
  padding: 20px;
}

.permission-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.role-management-container {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-header {
  margin-bottom: 16px;
  font-weight: bold;
}

.permission-content {
  max-height: 400px;
  overflow-y: auto;
}

.permission-module {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.module-header {
  margin-bottom: 8px;
  font-weight: bold;
}

.module-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-left: 24px;
}
</style>
