import { createPinia } from 'pinia';
import { useUserStore } from './user';
import { useAuthStore } from './auth';

const pinia = createPinia();

export default pinia;
export { useUserStore, useAuthStore };