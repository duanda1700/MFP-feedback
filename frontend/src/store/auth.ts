import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    loginLoading: false,
    logoutLoading: false,
    refreshLoading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    async login(username: string, password: string) {
      this.loginLoading = true;
      try {
        const response = await axios.post('/api/auth/login', {
          username,
          password
        });
        
        const { token, refreshToken } = response.data;
        
        this.token = token;
        this.refreshToken = refreshToken;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loginLoading = false;
      }
    },
    
    async logout() {
      this.logoutLoading = true;
      try {
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.token = '';
        this.refreshToken = '';
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        
        this.logoutLoading = false;
      }
    },
    
    async refreshToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      this.refreshLoading = true;
      try {
        const response = await axios.post('/api/auth/refresh', {
          refreshToken: this.refreshToken
        });
        
        const { token, refreshToken } = response.data;
        
        this.token = token;
        this.refreshToken = refreshToken;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        return token;
      } catch (error) {
        // 如果刷新失败，清除所有认证信息
        this.token = '';
        this.refreshToken = '';
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        
        throw error;
      } finally {
        this.refreshLoading = false;
      }
    },
    
    clearAuthInfo() {
      this.token = '';
      this.refreshToken = '';
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('permissions');
      localStorage.removeItem('roles');
    }
  }
});
