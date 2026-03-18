import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 标记是否正在刷新token
let isRefreshing = false;
// 存储需要重试的请求
let retryQueue: Array<(token: string) => void> = [];

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    const { data } = response;
    
    // 检查响应状态
    if (data.code !== undefined && data.code !== 200) {
      // 处理错误
      console.error('Response error:', data.message);
      return Promise.reject(new Error(data.message || 'Request failed'));
    }
    
    return data;
  },
  async (error) => {
    console.error('Response error:', error);
    
    // 处理401错误
    if (error.response && error.response.status === 401) {
      // 如果是refresh接口本身返回401，直接跳转登录页
      if (error.config.url === '/auth/refresh') {
        console.error('Refresh token failed, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
      
      // 标记是否正在刷新token
      if (isRefreshing) {
        return new Promise((resolve) => {
          retryQueue.push((token) => {
            error.config.headers.Authorization = `Bearer ${token}`;
            resolve(service(error.config));
          });
        });
      }
      
      // 开始刷新token
      isRefreshing = true;
      
      try {
        // 使用axios直接调用refresh接口，避免无限循环
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Refresh failed');
        }
        
        const refreshResponse = await response.json();
        const newToken = refreshResponse.access_token || refreshResponse.token;
        
        if (!newToken) {
          throw new Error('No token in refresh response');
        }
        
        // 更新localStorage中的token
        localStorage.setItem('token', newToken);
        
        // 重试队列中的请求
        retryQueue.forEach((callback) => callback(newToken));
        retryQueue = [];
        
        // 重试当前请求
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return service(error.config);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        // 刷新token失败，跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default service;
