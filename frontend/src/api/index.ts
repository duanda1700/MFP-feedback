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
  getDetail: (id: number) => request.get(`/order/detail/${id}`),
  getWideTableData: (id: number) => request.get(`/order/wide-table/${id}`),
  getSuppliers: () => request.get('/order/suppliers'),
  generateTemplate: (orderId: number) => request.get(`/order/generate-template/${orderId}`),
  markKeyMaterial: (data: { orderDetailId: string; isKeyMaterial: boolean }) => request.post('/order/mark-key-material', data),
  markComplianceMaterial: (data: { orderDetailId: string; isComplianceMaterial: boolean }) => request.post('/order/mark-compliance-material', data),
  issueTask: (data: { orderId: number; supplierId: number }) => request.post('/order/issue-task', data),
  issueOrder: (data: any) => request.post('/order/issue', data),
  updateStatus: (id: number, status: string) => request.put(`/order/update-status/${id}`, { status }),
  updatePlanStatus: (data: { materialCode: string; planStatus: string }) => request.put('/order/update-plan-status', data),
  updateRemarks: (data: { materialCode: string; remarks: string }) => request.put('/order/update-remarks', data)
};

// 生产计划相关API
export const productionPlanApi = {
  getList: (params: any) => request.get('/plan/list', { params }),
  getDetail: (id: string) => request.get(`/plan/detail/${id}`),
  create: (data: any) => request.post('/plan/create', data),
  update: (id: string, data: any) => request.put(`/plan/update/${id}`, data),
  delete: (id: string) => request.delete(`/plan/delete/${id}`),
  import: (data: { plans: any[]; createdBy: number; createdName: string }) => request.post('/plan/import', data),
  export: (params: any) => request.get('/plan/export', { params, responseType: 'blob' }),
  submitApproval: (id: string) => request.post(`/plan/submit-approval/${id}`)
};

// 进度反馈相关API
export const progressFeedbackApi = {
  getList: (params: any) => request.get('/feedback/list', { params }),
  getDetail: (id: string) => request.get(`/feedback/detail/${id}`),
  update: (id: string, data: any) => request.put(`/feedback/update/${id}`, data),
  submit: (data: any) => request.post('/feedback/submit', data)
};

// 待办任务相关API
export const todoApi = {
  getList: (params: any) => request.get('/task/list', { params }),
  markAsDone: (id: string) => request.put(`/task/cancel/${id}`),
  getCount: () => request.get('/task/count')
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

// 通知相关API
export const notificationApi = {
  getList: (params: any) => request.get('/notification/list', { params }),
  getUnreadCount: () => request.get('/notification/unread-count'),
  markAsRead: (id: string) => request.put(`/notification/mark-as-read/${id}`),
  markAllAsRead: () => request.put('/notification/mark-all-as-read')
};

// 供应商相关API
export const supplierApi = {
  getOrders: () => request.get('/supplier/orders'),
  getOrderDetails: (orderId: string) => request.get(`/supplier/orders/${orderId}`),
  getOrderPlans: (orderId: string, params: any) => request.get('/supplier/production-plans', { params: { ...params, orderId } }),
  updatePlanStatus: (planId: string, status: string) => request.put(`/supplier/production-plans/${planId}/status`, { status }),
  batchUpdatePlanStatus: (planIds: string[], status: string) => request.put('/supplier/production-plans/batch-status', { planIds, status })
};

// 导出单独的函数以便在组件中直接使用
export const getSupplierOrders = () => supplierApi.getOrders();
export const getSupplierOrderDetails = (orderId: string) => supplierApi.getOrderDetails(orderId);
export const getSupplierOrderPlans = (orderId: string, params: any) => supplierApi.getOrderPlans(orderId, params);
export const updatePlanStatus = (planId: string, status: string) => supplierApi.updatePlanStatus(planId, status);