import request from './request';

export const authApi = {
  login: (data: { username: string; password: string }) => request.post('/auth/login', data),
  logout: () => request.post('/auth/logout'),
  refresh: () => request.post('/auth/refresh'),
  getUserInfo: () => request.get('/auth/user')
};

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
  updateRemarks: (data: { materialCode: string; remarks: string }) => request.put('/order/update-remarks', data),
  getOrderById: (id: number) => request.get(`/order/detail/${id}`),
  previewOrderSplit: (data: any) => request.post('/order-split/preview', data),
  executeOrderSplit: (data: any) => request.post('/order-split/execute', data),
  getSplitHistory: (orderId: number) => request.get(`/order-split/history/${orderId}`),
  cancelSplit: (splitRecordId: number) => request.post(`/order-split/cancel/${splitRecordId}`),
  getSubOrders: (orderId: number) => request.get(`/order-split/sub-orders/${orderId}`),
  getSplitDetail: (splitRecordId: number) => request.get(`/order-split/detail/${splitRecordId}`)
};

export const productionPlanApi = {
  getList: (params: any) => request.get('/plan/list', { params }),
  getDetail: (id: string) => request.get(`/plan/detail/${id}`),
  create: (data: any) => request.post('/plan/create', data),
  update: (id: string, data: any) => request.put(`/plan/update/${id}`, data),
  delete: (id: string) => request.delete(`/plan/delete/${id}`),
  import: (data: any) => request.post('/plan/import', data),
  export: (params: any) => request.get('/plan/export', { params, responseType: 'blob' }),
  submitApproval: (id: string) => request.post(`/plan/submit-approval/${id}`)
};

export const progressFeedbackApi = {
  getList: (params: any) => request.get('/feedback/list', { params }),
  getDetail: (id: string) => request.get(`/feedback/detail/${id}`),
  submit: (data: any) => request.post('/feedback/submit', data),
  getStatistics: (params: any) => request.get('/feedback/statistics', { params }),
  getConfirmedPlans: (params: any) => request.get('/feedback/confirmed-plans', { params }),
  getOrdersWithPlans: (params: any) => request.get('/feedback/orders-with-plans', { params })
};

export const todoApi = {
  getList: (params: any) => request.get('/todo/list', { params }),
  getMyTasks: (params: any) => request.get('/todo/my', { params }),
  getStatistics: (userId?: number) => request.get('/todo/statistics', { params: { userId } }),
  getOverdue: (userId?: number) => request.get('/todo/overdue', { params: { userId } }),
  getById: (id: number) => request.get(`/todo/${id}`),
  getByRelated: (type: string, id: string) => request.get(`/todo/related/${type}/${id}`),
  create: (data: any) => request.post('/todo/create', data),
  start: (id: number) => request.put(`/todo/${id}/start`),
  complete: (id: number, remark?: string) => request.put(`/todo/${id}/complete`, { remark }),
  cancel: (id: number, remark?: string) => request.put(`/todo/${id}/cancel`, { remark }),
  updateStatus: (id: number, status: string, remark?: string) => request.put(`/todo/${id}/status`, { status, remark }),
  batchComplete: (ids: number[], remark?: string) => request.post('/todo/batch/complete', { ids, remark }),
};

export const permissionApi = {
  getRoles: () => request.get('/permission/roles'),
  getRoleById: (id: number) => request.get(`/permission/roles/${id}`),
  getRoleWithPermissions: (id: number) => request.get(`/permission/roles/${id}/with-permissions`),
  createRole: (data: { name: string; displayName: string; description?: string }) => 
    request.post('/permission/roles', data),
  updateRole: (id: number, data: { displayName?: string; description?: string; status?: number }) => 
    request.put(`/permission/roles/${id}`, data),
  deleteRole: (id: number) => request.delete(`/permission/roles/${id}`),
  getPermissions: () => request.get('/permission/permissions'),
  getPermissionsByModule: () => request.get('/permission/permissions/by-module'),
  getRolePermissions: (roleId: number) => request.get(`/permission/roles/${roleId}/permissions`),
  assignPermissions: (roleId: number, permissionIds: number[]) => 
    request.post(`/permission/roles/${roleId}/permissions`, { permissionIds }),
  getUserRoles: (userId: number) => request.get(`/permission/users/${userId}/roles`),
  getUserPermissions: (userId: number) => request.get(`/permission/users/${userId}/permissions`),
  assignUserRoles: (userId: number, roleIds: number[]) => 
    request.post(`/permission/users/${userId}/roles`, { roleIds }),
  getMyPermissions: () => request.get('/permission/me/permissions'),
  getMyRoles: () => request.get('/permission/me/roles'),
  checkPermission: (userId: number, permissionCode: string) => 
    request.post('/permission/check', { userId, permissionCode })
};

export const userApi = {
  getList: (params?: { keyword?: string; status?: number; page?: number; pageSize?: number }) => 
    request.get('/user', { params }),
  getMe: () => request.get('/user/me'),
  getById: (id: number) => request.get(`/user/${id}`),
  create: (data: {
    username: string;
    password: string;
    name: string;
    email?: string;
    phone?: string;
    department?: string;
    supplierId?: number;
    roleIds?: number[];
  }) => request.post('/user', data),
  update: (id: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    supplierId?: number;
    status?: number;
  }) => request.put(`/user/${id}`, data),
  updatePassword: (id: number, oldPassword: string, newPassword: string) => 
    request.put(`/user/${id}/password`, { oldPassword, newPassword }),
  resetPassword: (id: number, newPassword: string) => 
    request.put(`/user/${id}/reset-password`, { newPassword }),
  delete: (id: number) => request.delete(`/user/${id}`),
  assignRoles: (id: number, roleIds: number[]) => 
    request.post(`/user/${id}/roles`, { roleIds })
};

export const notificationApi = {
  getList: (params: any) => request.get('/notification/list', { params }),
  getUnreadCount: () => request.get('/notification/unread-count'),
  markAsRead: (id: string) => request.put(`/notification/mark-as-read/${id}`),
  markAllAsRead: () => request.put('/notification/mark-all-as-read')
};

export const supplierApi = {
  getOrders: () => request.get('/supplier/orders'),
  getOrderDetails: (orderId: string) => request.get(`/supplier/orders/${orderId}`),
  getOrderPlans: (orderId: string, params: any) => request.get('/supplier/production-plans', { params: { ...params, orderId } }),
  updatePlanStatus: (planId: string, status: string) => request.put(`/supplier/production-plans/${planId}/status`, { status }),
  batchUpdatePlanStatus: (planIds: string[], status: string) => request.put('/supplier/production-plans/batch-status', { planIds, status })
};

export const orderTrackingApi = {
  getOrders: () => request.get('/order-tracking/orders'),
  getStatistics: () => request.get('/order-tracking/statistics'),
  getDetail: (djbH: string) => request.get(`/order-tracking/detail/${djbH}`),
  comparePlans: (djbH: string) => request.get(`/order-tracking/compare/${djbH}`)
};

export const dashboardApi = {
  getStatistics: () => request.get('/order-tracking/statistics'),
  getRecentAlerts: (params?: { limit?: number }) => request.get('/alert/list', { params }),
  getRecentTodos: (params?: { limit?: number }) => request.get('/todo/my', { params }),
  getTodoStatistics: (userId?: number) => request.get('/todo/statistics', { params: { userId } }),
  getDashboardData: () => request.get('/dashboard'),
};

export const getSupplierOrders = () => supplierApi.getOrders();
export const getSupplierOrderDetails = (orderId: string) => supplierApi.getOrderDetails(orderId);
export const getSupplierOrderPlans = (orderId: string, params: any) => supplierApi.getOrderPlans(orderId, params);
export const updatePlanStatus = (planId: string, status: string) => supplierApi.updatePlanStatus(planId, status);
