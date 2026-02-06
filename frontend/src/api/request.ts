import axios from 'axios';
import { useUserStore } from '../store/user';

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
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
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
    const { data } = response;
    
    // 检查响应状态
    if (data.code && data.code !== 200) {
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
      const userStore = useUserStore();
      
      // 如果已经在刷新token，将请求加入队列
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
        // 尝试刷新token
        const refreshResponse = await axios.post('/api/auth/refresh');
        const newToken = refreshResponse.data.access_token || refreshResponse.data.token;
        
        // 更新store中的token
        userStore.token = newToken;
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
        userStore.logout();
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
