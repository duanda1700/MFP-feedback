import { createRouter, createWebHistory } from 'vue-router';
import { AuthLayout, BasicLayout } from './layouts';

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
        meta: { title: '仪表盘' }
      },
      {
        path: 'purchase-order',
        name: 'PurchaseOrder',
        component: () => import('./views/PurchaseOrder.vue'),
        meta: { title: '采购订单外发' }
      },
      {
        path: 'purchase-track',
        name: 'PurchaseTrack',
        component: () => import('./views/PurchaseTrack.vue'),
        meta: { title: '采购订单跟踪' }
      },

      {
        path: 'progress-feedback',
        name: 'ProgressFeedback',
        component: () => import('./views/ProgressFeedback.vue'),
        meta: { title: '计划进度反馈' }
      },
      {
        path: 'production-plan-confirmation',
        name: 'ProductionPlanConfirmation',
        component: () => import('./views/ProductionPlanConfirmation.vue'),
        meta: { title: '生产计划确认' }
      },
      {
        path: 'todo',
        name: 'Todo',
        component: () => import('./views/Todo.vue'),
        meta: { title: '待办事项' }
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('./views/Permission.vue'),
        meta: { title: '权限管理' }
      },
      {
        path: 'purchase-order/issue/:orderId',
        name: 'PurchaseOrderIssue',
        component: () => import('./views/PurchaseOrderIssue.vue'),
        meta: { title: '采购订单下发' }
      }
    ]
  },
  // 404 页面
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

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - MFP-Feedback`;
  } else {
    document.title = 'MFP-Feedback';
  }

  // 检查是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = localStorage.getItem('token');

  if (requiresAuth && !isLoggedIn) {
    // 未登录，跳转到登录页
    next('/auth/login');
  } else if (isLoggedIn && to.path === '/auth/login') {
      // 已登录，从登录页跳转到仪表盘
      next('/app/dashboard');
  } else {
    next();
  }
});

export default router;