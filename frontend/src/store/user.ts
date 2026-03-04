import { defineStore } from 'pinia';
import request from '../api/request';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
    roles: JSON.parse(localStorage.getItem('roles') || '[]'),
    loading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permission: string) => state.permissions.includes(permission),
    hasRole: (state) => (role: string) => state.roles.includes(role)
  },
  
  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      try {
        const response = await request.post('/auth/login', {
          username,
          password
        });
        
        // 处理后端返回的数据结构
        const { access_token, user } = response;
        
        // 确保数据结构正确
        const token = access_token;
        const userInfo = user;
        const permissions = ['all'];
        const roles = [user.role];
        
        this.token = token;
        this.userInfo = userInfo;
        this.permissions = permissions;
        this.roles = roles;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('permissions', JSON.stringify(permissions));
        localStorage.setItem('roles', JSON.stringify(roles));
        
        return { token, userInfo, permissions, roles };
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      try {
        await request.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.token = '';
        this.userInfo = null;
        this.permissions = [];
        this.roles = [];
        
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
      }
    },
    
    async refreshToken() {
      try {
        const response = await request.post('/auth/refresh');
        const { access_token } = response;
        const token = access_token;
        this.token = token;
        localStorage.setItem('token', token);
        return token;
      } catch (error) {
        throw error;
      }
    },
    
    async getUserInfo() {
      try {
        const response = await request.get('/auth/profile');
        const userInfo = response;
        const permissions = ['all'];
        const roles = [userInfo.role];
        
        this.userInfo = userInfo;
        this.permissions = permissions;
        this.roles = roles;
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('permissions', JSON.stringify(permissions));
        localStorage.setItem('roles', JSON.stringify(roles));
        
        return { userInfo, permissions, roles };
      } catch (error) {
        throw error;
      }
    }
  }
});