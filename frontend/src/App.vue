<!-- src/App.vue -->
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Проверяем аутентификацию и редиректим при необходимости
  const token = localStorage.getItem('auth_token')
  if (!token && !window.location.pathname.includes('/auth')) {
    router.push('/auth')
  }
})
</script>

<style>
/* Глобальные стили */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #111; /* Тёмный фон для всего приложения */
  color: #eee;
}
</style>