<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <h1>Добро пожаловать в FyneOn!</h1>
    <p>Платформа для выполнения задач</p>
    
    <div v-if="!isAuthenticated" class="auth-actions">
      <Button 
        label="Войти / Зарегистрироваться" 
        @click="goToAuth" 
        class="p-button-primary"
      />
    </div>
    
    <div v-else class="user-actions">
      <Button 
        label="Создать задание" 
        @click="createPost" 
        icon="pi pi-plus"
        class="p-button-primary mr-2"
      />
      <Button 
        label="Мой профиль" 
        @click="goToProfile" 
        icon="pi pi-user"
        class="p-button-secondary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  checkAuth()
})

const checkAuth = () => {
  const token = localStorage.getItem('auth_token')
  isAuthenticated.value = !!token
}

const goToAuth = () => {
  router.push('/auth')
}

const createPost = () => {
  router.push('/create-post')
}

const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.auth-actions, .user-actions {
  margin-top: 2rem;
}

h1 {
  color: var(--p-primary-500);
  margin-bottom: 1rem;
}

p {
  color: var(--p-gray-600);
  font-size: 1.2rem;
}
</style>