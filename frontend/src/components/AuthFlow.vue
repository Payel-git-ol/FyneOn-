<!-- src/components/auth/AuthFlow.vue -->
<template>
  <div class="auth-container">
    <h2>Вход / Регистрация</h2>
    
    <!-- Шаг 1: Email -->
    <div v-if="currentStep === 'email'">
      <label>Email</label>
      <input 
        v-model="email" 
        type="email" 
        autocomplete="email" 
        :disabled="isLoading"
      />
      <button :disabled="isLoading" @click="handleRequestCode">
        {{ isLoading ? 'Отправка...' : 'Получить код' }}
      </button>
    </div>
    
    <!-- Шаг 1.5: Email + Код (после отправки) -->
    <div v-else-if="currentStep === 'email_sent'">
      <label>Email</label>
      <input 
        v-model="email" 
        type="email" 
        autocomplete="email" 
        readonly 
      />
      
      <label>Код из почты</label>
      <input 
        v-model="code" 
        autocomplete="one-time-code" 
        :disabled="isLoading"
        placeholder="Введите 6-значный код"
      />
      
      <div class="button-group">
        <button :disabled="isLoading" @click="handleVerifyCode">
          {{ isLoading ? 'Проверка...' : 'Подтвердить код' }}
        </button>
        <button class="secondary" @click="currentStep = 'email'">
          Изменить email
        </button>
      </div>
    </div>
    
    <!-- Шаг 2: Регистрация (только ник) -->
    <div v-else-if="currentStep === 'register'">
      <label>Ваш никнейм</label>
      <input 
        v-model="username" 
        :disabled="isLoading"
        placeholder="Придумайте уникальный ник"
        @keypress.enter="handleRegister"
      />
      
      <button :disabled="isLoading" @click="handleRegister">
        {{ isLoading ? 'Регистрация...' : 'Завершить регистрацию' }}
      </button>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="currentStep === 'email_sent' && !error" class="success">
      Код отправлен на вашу почту!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../service/authApi'

const authStore = useAuthStore()
const email = ref(authStore.currentEmail)
const code = ref('')
const username = ref('')

const currentStep = ref(authStore.currentStep)
const isLoading = ref(authStore.isLoading)
const error = ref(authStore.error)

watch(() => authStore.currentStep, (newStep) => {
  currentStep.value = newStep
})

watch(() => authStore.isLoading, (newLoading) => {
  isLoading.value = newLoading
})

watch(() => authStore.error, (newError) => {
  error.value = newError
})

watch(email, (val) => {
  authStore.setEmail(val)
})

const handleRequestCode = async () => {
  if (!email.value) {
    authStore.setError('Введите email')
    return
  }
  
  const success = await authApi.requestCode(email.value)
  if (success) {
    currentStep.value = 'email_sent'
    error.value = ''
  }
}

const handleVerifyCode = async () => {
  if (!code.value) {
    authStore.setError('Введите код подтверждения')
    return
  }
  
  await authApi.verifyCode(email.value, code.value)
}

const handleRegister = async () => {
  if (!username.value) {
    authStore.setError('Введите никнейм')
    return
  }
  
  // Передаем только username, а второй параметр не нужен
  const success = await authApi.register(username.value)
  if (success) {
    window.location.href = '/'
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #111;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #eee;
  position: relative;
  left: 160px;
}

h2 {
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

label {
  margin-top: 12px;
  margin-bottom: 4px;
  display: block;
  font-weight: 500;
  color: #ddd;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #222;
  color: #eee;
}

input:read-only {
  background: #333;
  color: #888;
}

input:disabled {
  background: #2a2a2a;
  color: #666;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 10px;
  background: #f4511e;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 8px;
}

button:hover:not(:disabled) {
  background: #ff7043;
}

button:disabled {
  background: #666;
  color: #888;
  cursor: not-allowed;
}

button.secondary {
  background: #444;
  color: #ddd;
}

button.secondary:hover {
  background: #555;
}

.button-group {
  margin-top: 16px;
}

.error {
  color: #ffb74d;
  margin-top: 12px;
  text-align: center;
  padding: 8px;
  background: rgba(255, 183, 77, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 183, 77, 0.3);
}

.success {
  color: #66bb6a;
  margin-top: 12px;
  text-align: center;
  padding: 8px;
  background: rgba(102, 187, 106, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(102, 187, 106, 0.3);
}
</style>