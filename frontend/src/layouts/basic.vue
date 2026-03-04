<template>
  <div class="basic-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2>MFP-Feedback</h2>
      </div>
      <nav class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
          :collapse="sidebarCollapsed"
        >
          <el-sub-menu index="dashboard">
            <template #title>
              <i class="el-icon-s-home"></i>
              <span>仪表盘</span>
            </template>
            <el-menu-item index="/app/dashboard">
              <template #title>
                <span>仪表盘</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="purchase">
            <template #title>
              <i class="el-icon-s-shop"></i>
              <span>采购管理</span>
            </template>
            <el-menu-item index="/app/purchase-order">
              <template #title>
                <span>采购订单外发</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/app/purchase-track">
              <template #title>
                <span>采购订单跟踪</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="production">
            <template #title>
              <i class="el-icon-s-grid"></i>
              <span>生产协同</span>
            </template>
            <el-menu-item index="/app/production-plan">
              <template #title>
                <span>生产计划分解</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/app/production-plan-confirmation">
              <template #title>
                <span>生产计划确认</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/app/progress-feedback">
              <template #title>
                <span>计划进度反馈</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="todo">
            <template #title>
              <i class="el-icon-check"></i>
              <span>待办事项</span>
            </template>
            <el-menu-item index="/app/todo">
              <template #title>
                <span>待办事项</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="permission">
            <template #title>
              <i class="el-icon-lock"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/app/permission">
              <template #title>
                <span>权限管理</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </nav>
    </aside>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="top-bar">
        <div class="top-bar-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="el-icon-menu"></i>
          </button>
        </div>
        <div class="top-bar-right">
          <el-dropdown>
            <span class="user-info">
              <i class="el-icon-user"></i>
              <span>{{ userInfo?.name || '管理员' }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      
      <!-- 页面内容 -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 侧边栏状态
const sidebarCollapsed = ref(false);

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path;
});

// 用户信息
const userInfo = computed(() => {
  return userStore.userInfo;
});

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

// 菜单选择
const handleMenuSelect = (key: string, keyPath: string[]) => {
  console.log('Menu selected:', key, keyPath);
  try {
    // 确保key是有效的路由路径
    if (!key) {
      console.error('Invalid navigation key:', key);
      ElMessage.error('无效的导航路径');
      return;
    }
    
    console.log('Attempting to navigate to:', key);
    
    // 使用router.push的promise形式，以便更好地处理错误
    router.push(key).then(() => {
      console.log('Navigation successful to:', key);
    }).catch((error) => {
      console.error('Navigation error:', error);
      ElMessage.error('导航失败: ' + (error.message || '未知错误'));
    });
  } catch (error) {
    console.error('Navigation error:', error);
    ElMessage.error('导航失败: ' + (error.message || '未知错误'));
  }
};

// 个人中心
const handleProfile = () => {
  ElMessage.info('个人中心功能开发中');
};

// 退出登录
const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.basic-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  background-color: white;
  border-right: 1px solid #e6e8eb;
  transition: width 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e6e8eb;
  text-align: center;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: bold;
  color: #1E88E5;
  margin: 0;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .sidebar-header h2 {
  opacity: 0;
}

.sidebar-menu {
  padding: 16px 0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* 顶部导航栏 */
.top-bar {
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #e6e8eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  margin-right: 24px;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background-color: #f0f2f5;
  color: #1E88E5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #666;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f0f2f5;
  color: #1E88E5;
}

/* 页面内容 */
.page-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .basic-layout {
    max-width: 100%;
  }
  
  .sidebar {
    width: 200px;
  }
  
  .sidebar.collapsed {
    width: 64px;
  }
  
  .top-bar {
    padding: 0 24px;
  }
  
  .page-content {
    padding: 24px;
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.collapsed {
    left: -64px;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .top-bar {
    padding: 0 16px;
  }
  
  .page-content {
    padding: 16px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>