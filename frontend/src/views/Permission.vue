<template>
  <div class="permission-container">
    <h2>权限管理</h2>
    
    <!-- 角色管理 -->
    <div class="role-management-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>角色管理</span>
            <el-button type="primary" @click="handleCreateRole">创建角色</el-button>
          </div>
        </template>
        
        <el-table :data="roles" style="width: 100%">
          <el-table-column prop="id" label="角色ID" width="100" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="roleDesc" label="角色描述" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEditRole(scope.row)">编辑</el-button>
              <el-button size="small" type="primary" @click="handleAssignPermission(scope.row)">分配权限</el-button>
              <el-button size="small" type="danger" @click="handleDeleteRole(scope.row.id)" v-if="scope.row.roleName !== 'admin'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 权限列表 -->
    <div class="permission-list-container">
      <el-card>
        <template #header>
          <span>权限列表</span>
        </template>
        
        <el-table :data="permissions" style="width: 100%">
          <el-table-column prop="id" label="权限ID" width="100" />
          <el-table-column prop="permissionName" label="权限名称" />
          <el-table-column prop="permissionCode" label="权限编码" />
          <el-table-column prop="description" label="权限描述" />
          <el-table-column prop="module" label="所属模块" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { permissionApi } from '../api';

const roles = ref([
  { id: '1', roleName: 'admin', roleDesc: '系统管理员', createTime: '2026-01-01 00:00:00' },
  { id: '2', roleName: 'purchase_manager', roleDesc: '采购主管', createTime: '2026-01-01 00:00:00' },
  { id: '3', roleName: 'supplier_manager', roleDesc: '供应商负责人', createTime: '2026-01-01 00:00:00' },
  { id: '4', roleName: 'supplier_operate', roleDesc: '供应商操作人员', createTime: '2026-01-01 00:00:00' },
  { id: '5', roleName: 'company_leader', roleDesc: '公司领导', createTime: '2026-01-01 00:00:00' }
]);

const permissions = ref([
  { id: '1', permissionName: '采购订单查看', permissionCode: 'purchase_order:read', description: '查看采购订单列表和详情', module: '采购管理' },
  { id: '2', permissionName: '采购订单编辑', permissionCode: 'purchase_order:update', description: '编辑采购订单信息', module: '采购管理' },
  { id: '3', permissionName: '生产计划查看', permissionCode: 'production_plan:read', description: '查看生产计划列表和详情', module: '生产管理' },
  { id: '4', permissionName: '生产计划编辑', permissionCode: 'production_plan:update', description: '编辑生产计划信息', module: '生产管理' },
  { id: '5', permissionName: '进度反馈查看', permissionCode: 'progress_feedback:read', description: '查看进度反馈列表和详情', module: '进度管理' },
  { id: '6', permissionName: '进度反馈编辑', permissionCode: 'progress_feedback:update', description: '编辑进度反馈信息', module: '进度管理' },
  { id: '7', permissionName: '待办任务查看', permissionCode: 'todo:read', description: '查看待办任务列表和详情', module: '任务管理' },
  { id: '8', permissionName: '待办任务编辑', permissionCode: 'todo:update', description: '编辑待办任务信息', module: '任务管理' },
  { id: '9', permissionName: '权限管理查看', permissionCode: 'permission:read', description: '查看权限管理列表', module: '系统管理' },
  { id: '10', permissionName: '权限管理编辑', permissionCode: 'permission:update', description: '编辑权限管理信息', module: '系统管理' }
]);

const loadRoles = async () => {
  try {
    const response = await permissionApi.getRoles();
    roles.value = response.data || [];
  } catch (error) {
    console.error('Load roles error:', error);
    ElMessage.error('加载角色失败');
  }
};

const loadPermissions = async () => {
  try {
    const response = await permissionApi.getPermissions();
    permissions.value = response.data || [];
  } catch (error) {
    console.error('Load permissions error:', error);
    ElMessage.error('加载权限失败');
  }
};

const handleCreateRole = () => {
  console.log('Create role');
  // 跳转到创建角色页面
};

const handleEditRole = (row: any) => {
  console.log('Edit role:', row);
  // 跳转到编辑角色页面
};

const handleAssignPermission = (row: any) => {
  console.log('Assign permission:', row);
  // 跳转到分配权限页面
};

const handleDeleteRole = async (id: string) => {
  try {
    await permissionApi.deleteRole(id);
    ElMessage.success('删除角色成功');
    loadRoles();
  } catch (error) {
    console.error('Delete role error:', error);
    ElMessage.error('删除角色失败');
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
</style>