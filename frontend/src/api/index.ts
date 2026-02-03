import request from './request';

// 认证相关API
export const authApi = {
  login: (data: { username: string; password: string }) => request.post('/auth/login', data),
  logout: () => request.post('/auth/logout'),
  refresh: () => request.post('/auth/refresh'),
  getUserInfo: () => request.get('/auth/user')
};

// 采购订单相关API
export const purchaseOrderApi = {
  getList: (params: any) => request.get('/order/list', { params }),
  getDetail: (id: string) => request.get(`/order/detail/${id}`),
  markKeyMaterial: (data: { orderDetailId: string; isKeyMaterial: boolean }) => request.post('/order/mark-key-material', data),
  issueTask: (data: { orderId: number; supplierId: number }) => request.post('/order/issue-task', data)
};

// 生产计划相关API
export const productionPlanApi = {
  getList: (params: any) => request.get('/plan/list', { params }),
  create: (data: any) => request.post('/plan/create', data),
  update: (id: string, data: any) => request.put(`/plan/update/${id}`, data),
  delete: (id: string) => request.delete(`/plan/delete/${id}`),
  import: (data: { plans: any[]; createdBy: number; createdName: string }) => request.post('/plan/import', data),
  export: (params: any) => request.get('/plan/export', { params, responseType: 'blob' }),
  submitApproval: (id: string) => request.post(`/plan/submit-approval/${id}`)
};

// 进度反馈相关API
export const progressFeedbackApi = {
  getList: (params: any) => request.get('/progress-feedback/list', { params }),
  getDetail: (id: string) => request.get(`/progress-feedback/detail/${id}`),
  update: (id: string, data: any) => request.put(`/progress-feedback/update/${id}`, data),
  submit: (data: any) => request.post('/progress-feedback/submit', data)
};

// 待办任务相关API
export const todoApi = {
  getList: (params: any) => request.get('/todo/list', { params }),
  markAsDone: (id: string) => request.put(`/todo/mark-as-done/${id}`),
  getCount: () => request.get('/todo/count')
};

// 权限管理相关API
export const permissionApi = {
  getRoles: () => request.get('/permission/roles'),
  createRole: (data: any) => request.post('/permission/roles', data),
  updateRole: (id: string, data: any) => request.put(`/permission/roles/${id}`, data),
  deleteRole: (id: string) => request.delete(`/permission/roles/${id}`),
  getPermissions: () => request.get('/permission/list'),
  assignPermission: (data: { roleId: string; permissions: string[] }) => request.post('/permission/assign', data)
};

// 数据监控相关API
export const monitorApi = {
  getDashboard: () => request.get('/monitor/dashboard'),
  getOrderStats: (params: any) => request.get('/monitor/order-stats', { params }),
  getDeliveryStats: (params: any) => request.get('/monitor/delivery-stats', { params }),
  getAlertStats: (params: any) => request.get('/monitor/alert-stats', { params }),
  getAlerts: (params: any) => request.get('/monitor/alerts', { params }),
  handleAlert: (id: string, data: any) => request.put(`/monitor/alerts/${id}/handle`, data)
};

// 通知相关API
export const notificationApi = {
  getList: (params: any) => request.get('/notification/list', { params }),
  getUnreadCount: () => request.get('/notification/unread-count'),
  markAsRead: (id: string) => request.put(`/notification/mark-as-read/${id}`),
  markAllAsRead: () => request.put('/notification/mark-all-as-read')
};