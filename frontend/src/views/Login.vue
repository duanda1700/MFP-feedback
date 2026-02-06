<template>
  <div class="login-wrapper">
    <!-- 登录标题 -->
    <div class="login-header">
      <h2 class="login-title">
        欢迎回来 👋🏻
      </h2>
      <p class="login-subtitle">
        请登录您的账号以继续使用 MFP-Feedback 系统
      </p>
    </div>

    <!-- 登录方式切换 -->
    <el-tabs v-model="activeTab" class="login-tabs">
      <el-tab-pane label="账号密码登录" name="password">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" :label-position="'top'">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          
          <div class="login-form-actions">
            <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
            <el-link type="primary" @click="showForgotPasswordDialog = true">忘记密码？</el-link>
          </div>
          
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="验证码登录" name="captcha">
        <el-form :model="captchaForm" :rules="captchaRules" ref="captchaFormRef" :label-position="'top'">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="captchaForm.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="验证码" prop="captcha">
            <div class="captcha-container">
              <el-input v-model="captchaForm.captcha" placeholder="请输入验证码" style="width: 60%" />
              <div class="captcha-image" @click="refreshCaptcha">
                <img :src="captchaImage" alt="验证码" style="width: 100%; height: 100%" />
              </div>
              <el-button type="text" @click="sendCaptcha" :disabled="sendButtonDisabled" style="width: 120px">
                {{ sendButtonText }}
              </el-button>
            </div>
          </el-form-item>
          
          <div class="login-form-actions">
            <el-checkbox v-model="captchaForm.rememberMe">记住密码</el-checkbox>
          </div>
          
          <el-form-item>
            <el-button type="primary" @click="handleCaptchaLogin" :loading="loading" style="width: 100%">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 第三方登录 -->
    <div class="third-party-login">
      <div class="third-party-divider">
        <span>其他登录方式</span>
      </div>
      <div class="third-party-buttons">
        <el-button type="default" size="small" class="third-party-btn">
          <i class="el-icon-chat-dot-round"></i>
          <span>企业微信</span>
        </el-button>
        <el-button type="default" size="small" class="third-party-btn">
          <i class="el-icon-message"></i>
          <span>短信登录</span>
        </el-button>
      </div>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog v-model="showForgotPasswordDialog" title="忘记密码" width="500px">
      <el-form :model="forgotPasswordForm" :rules="forgotPasswordRules" ref="forgotPasswordFormRef" :label-position="'top'">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="forgotPasswordForm.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="forgotPasswordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="forgotPasswordForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
        </el-form-item>
        
        <el-form-item label="验证码" prop="resetCaptcha">
          <div class="captcha-container">
            <el-input v-model="forgotPasswordForm.resetCaptcha" placeholder="请输入验证码" style="width: 60%" />
            <el-button type="text" @click="sendResetCaptcha" :disabled="resetSendButtonDisabled" style="width: 120px">
              {{ resetSendButtonText }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showForgotPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="handleResetPassword">确认重置</el-button>
        </span>
      </template>
    </el-dialog>
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
const captchaFormRef = ref();
const forgotPasswordFormRef = ref();
const loading = ref(false);

// 登录方式切换
const activeTab = ref('password');

// 账号密码登录表单
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// 验证码登录表单
const captchaForm = reactive({
  username: '',
  captcha: '',
  rememberMe: false
});

// 忘记密码表单
const forgotPasswordForm = reactive({
  username: '',
  newPassword: '',
  confirmPassword: '',
  resetCaptcha: ''
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

const captchaRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
};

const forgotPasswordRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== forgotPasswordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  resetCaptcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
};

// 验证码相关
const captchaImage = ref('');
const sendButtonDisabled = ref(false);
const sendButtonText = ref('发送验证码');
const resetSendButtonDisabled = ref(false);
const resetSendButtonText = ref('发送验证码');
const showForgotPasswordDialog = ref(false);

// 生成验证码图片
const refreshCaptcha = () => {
  // 使用内部文本模拟验证码，避免依赖外部服务
  captchaImage.value = '';
};

// 发送登录验证码
const sendCaptcha = async () => {
  if (!captchaForm.username) {
    ElMessage.warning('请输入用户名');
    return;
  }
  
  try {
    // 这里应该调用后端API发送验证码
    // await userStore.sendLoginCaptcha(captchaForm.username);
    ElMessage.success('验证码发送成功');
    
    // 倒计时
    let count = 60;
    sendButtonDisabled.value = true;
    sendButtonText.value = `${count}秒后重发`;
    
    const timer = setInterval(() => {
      count--;
      sendButtonText.value = `${count}秒后重发`;
      if (count <= 0) {
        clearInterval(timer);
        sendButtonDisabled.value = false;
        sendButtonText.value = '发送验证码';
      }
    }, 1000);
  } catch (error: any) {
    ElMessage.error(error.message || '验证码发送失败');
  }
};

// 发送重置密码验证码
const sendResetCaptcha = async () => {
  if (!forgotPasswordForm.username) {
    ElMessage.warning('请输入用户名');
    return;
  }
  
  try {
    // 这里应该调用后端API发送验证码
    // await userStore.sendResetPasswordCaptcha(forgotPasswordForm.username);
    ElMessage.success('验证码发送成功');
    
    // 倒计时
    let count = 60;
    resetSendButtonDisabled.value = true;
    resetSendButtonText.value = `${count}秒后重发`;
    
    const timer = setInterval(() => {
      count--;
      resetSendButtonText.value = `${count}秒后重发`;
      if (count <= 0) {
        clearInterval(timer);
        resetSendButtonDisabled.value = false;
        resetSendButtonText.value = '发送验证码';
      }
    }, 1000);
  } catch (error: any) {
    ElMessage.error(error.message || '验证码发送失败');
  }
};

// 账号密码登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        // 使用真实的登录API
        await userStore.login(loginForm.username, loginForm.password);
        // 记住密码
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

// 验证码登录
const handleCaptchaLogin = async () => {
  if (!captchaFormRef.value) return;
  
  await captchaFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        // 这里应该调用后端API进行验证码登录
        // await userStore.loginWithCaptcha(captchaForm.username, captchaForm.captcha);
        // 记住密码
        if (captchaForm.rememberMe) {
          localStorage.setItem('rememberedUsername', captchaForm.username);
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

// 重置密码
const handleResetPassword = async () => {
  if (!forgotPasswordFormRef.value) return;
  
  await forgotPasswordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        // 这里应该调用后端API重置密码
        // await userStore.resetPassword(forgotPasswordForm);
        ElMessage.success('密码重置成功');
        showForgotPasswordDialog.value = false;
      } catch (error: any) {
        ElMessage.error(error.message || '密码重置失败');
      } finally {
        loading.value = false;
      }
    }
  });
};

// 页面加载时初始化
onMounted(() => {
  // 刷新验证码
  refreshCaptcha();
  // 读取记住的用户名
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    loginForm.username = rememberedUsername;
    captchaForm.username = rememberedUsername;
    loginForm.rememberMe = true;
    captchaForm.rememberMe = true;
  }
});
</script>

<style scoped>
.login-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* 登录标题 */
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

/* 登录表单 */
.login-tabs {
  margin-bottom: 24px;
}

.login-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 验证码容器 */
.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-image {
  width: 120px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

/* 第三方登录 */
.third-party-login {
  margin-top: 24px;
}

.third-party-divider {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.third-party-divider::before,
.third-party-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e4e7ed;
}

.third-party-divider span {
  padding: 0 12px;
  font-size: 12px;
  color: #909399;
}

.third-party-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.third-party-btn {
  flex: 1;
}

/* 对话框 */
.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>