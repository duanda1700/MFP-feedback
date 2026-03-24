import { createRouter, createWebHistory } from 'vue-router';
import { AuthLayout, BasicLayout } from './layouts';
import { useUserStore } from './store/user';

const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('./views/Login.vue'),
        meta: { title: '登录' }
      }
    ]
  },
  {
    path: '/app',
    component: BasicLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('./views/Dashboard.vue'),
        meta: { title: '仪表盘', permissions: ['dashboard:read'] }
      },
      {
        path: 'purchase-order',
        name: 'PurchaseOrder',
        component: () => import('./views/PurchaseOrder.vue'),
        meta: { title: '采购订单外发', permissions: ['purchase_order:read'] }
      },
      {
        path: 'purchase-track',
        name: 'PurchaseTrack',
        component: () => import('./views/PurchaseTrack.vue'),
        meta: { title: '采购订单跟踪', permissions: ['purchase_order:read'] }
      },

      {
        path: 'progress-feedback',
        name: 'ProgressFeedback',
        component: () => import('./views/ProgressFeedback.vue'),
        meta: { title: '计划进度反馈', permissions: ['feedback:read'] }
      },
      {
        path: 'production-plan-confirmation',
        name: 'ProductionPlanConfirmation',
        component: () => import('./views/ProductionPlanConfirmation.vue'),
        meta: { title: '生产计划确认', permissions: ['production_plan:read'] }
      },
      {
        path: 'todo',
        name: 'Todo',
        component: () => import('./views/Todo.vue'),
        meta: { title: '待办事项', permissions: ['todo:read'] }
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('./views/Permission.vue'),
        meta: { title: '权限管理', permissions: ['role:read', 'permission:assign'] }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('./views/User.vue'),
        meta: { title: '用户管理', permissions: ['user:read'] }
      },
      {
        path: 'purchase-order/issue/:orderId',
        name: 'PurchaseOrderIssue',
        component: () => import('./views/PurchaseOrderIssue.vue'),
        meta: { title: '采购订单下发', permissions: ['purchase_order:issue'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/Login.vue'),
    meta: { title: '页面不存在' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - MFP-Feedback`;
  } else {
    document.title = 'MFP-Feedback';
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('token');

  if (requiresAuth && !token) {
    next('/auth/login');
    return;
  }

  if (token && to.path === '/auth/login') {
    next('/app/dashboard');
    return;
  }

  if (requiresAuth && token) {
    const userStore = useUserStore();
    
    if (!userStore.userInfo) {
      try {
        await userStore.getUserInfo();
      } catch (error) {
        console.error('Failed to get user info:', error);
        userStore.logout();
        next('/auth/login');
        return;
      }
    }

    const requiredPermissions = to.meta.permissions as string[] | undefined;
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (!userStore.hasPermission(requiredPermissions)) {
        next('/app/dashboard');
        return;
      }
    }
  }

  next();
});

export default router;