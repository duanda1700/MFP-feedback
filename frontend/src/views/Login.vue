<template>
  <div class="login-wrapper">
    <div class="login-header">
      <h2 class="login-title">
        欢迎回来
      </h2>
      <p class="login-subtitle">
        请登录您的账号以继续使用 MFP-Feedback 系统
      </p>
    </div>

    <el-form :model="loginForm" :rules="rules" ref="loginFormRef" :label-position="'top'">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      
      <div class="login-form-actions">
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
      </div>
      
      <el-form-item>
        <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref();
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        await userStore.login(loginForm.username, loginForm.password);
        if (loginForm.rememberMe) {
          localStorage.setItem('rememberedUsername', loginForm.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        ElMessage.success('登录成功');
        router.push('/app/dashboard');
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    loginForm.username = rememberedUsername;
    loginForm.rememberMe = true;
  }
});
</script>

<style scoped>
.login-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.login-header {
  margin-bottom: 30px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
