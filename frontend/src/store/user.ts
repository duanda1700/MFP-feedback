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
    hasPermission: (state) => (permission: string | string[]) => {
      if (state.permissions.includes('*')) {
        return true;
      }
      if (Array.isArray(permission)) {
        return permission.some(p => state.permissions.includes(p));
      }
      return state.permissions.includes(permission);
    },
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
        
        const { access_token, user } = response;
        
        const token = access_token;
        const userInfo = user;
        
        this.token = token;
        this.userInfo = userInfo;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        try {
          const permResponse = await request.get('/permission/me/permissions');
          const roleResponse = await request.get('/permission/me/roles');
          
          const permissions = permResponse || [];
          const roles = (roleResponse || []).map((r: any) => r.name);
          
          this.permissions = permissions;
          this.roles = roles;
          
          localStorage.setItem('permissions', JSON.stringify(permissions));
          localStorage.setItem('roles', JSON.stringify(roles));
        } catch (permError) {
          console.warn('Failed to fetch permissions, using defaults:', permError);
          this.permissions = [];
          this.roles = [];
          localStorage.setItem('permissions', '[]');
          localStorage.setItem('roles', '[]');
        }
        
        return { token, userInfo, permissions: this.permissions, roles: this.roles };
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
        
        this.userInfo = userInfo;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        try {
          const permResponse = await request.get('/permission/me/permissions');
          const roleResponse = await request.get('/permission/me/roles');
          
          const permissions = permResponse || [];
          const roles = (roleResponse || []).map((r: any) => r.name);
          
          this.permissions = permissions;
          this.roles = roles;
          
          localStorage.setItem('permissions', JSON.stringify(permissions));
          localStorage.setItem('roles', JSON.stringify(roles));
          
          return { userInfo, permissions, roles };
        } catch (permError) {
          console.warn('Failed to fetch permissions:', permError);
          return { userInfo, permissions: this.permissions, roles: this.roles };
        }
      } catch (error) {
        throw error;
      }
    }
  }
});