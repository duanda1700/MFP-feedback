<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-card">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth layout for login, register, etc.
</script>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

.auth-container {
  width: 100%;
  max-width: 480px;
  padding: 0 32px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: 40px;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .auth-layout {
    max-width: 100%;
  }
  
  .auth-container {
    padding: 0 24px;
  }
  
  .auth-card {
    padding: 32px;
  }
}

@media screen and (max-width: 480px) {
  .auth-container {
    padding: 0 16px;
  }
  
  .auth-card {
    padding: 24px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>