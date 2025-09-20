<template>
  <div class="posts-container">
    <div v-if="isLoading" class="loading">Загрузка постов...</div>
    
    <div v-else-if="error" class="error">
      Ошибка загрузки постов: {{ error }}
      <button @click="fetchPosts" class="retry-btn">Попробовать снова</button>
    </div>

    <div v-else-if="posts.length === 0" class="empty">
      Постов пока нет. Будьте первым!
    </div>

    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <!-- Используем новые поля -->
        <h3>{{ post.name || 'Без названия' }}</h3>
        <p>{{ post.content }}</p>
        <div class="post-meta">
          <span>От: {{ post.sender || 'Неизвестен' }}</span>
          <span>Дата: {{ formatDate(post.receivedAt) }}</span>
          <!-- Старые поля (если есть) -->
          <span v-if="post.price">Цена: {{ post.price }} ₽</span>
          <span v-if="post.deadline">Дедлайн: {{ formatDate(post.deadline) }}</span>
          <span v-if="post.status">Статус: {{ getStatusText(post.status) }}</span>
        </div>
        <!-- Старое поле автора (если есть) -->
        <div v-if="post.customer?.username" class="post-author">
          Автор: {{ post.customer.username }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePostsStore } from '../stores/posts'

const postsStore = usePostsStore()
const { posts, isLoading, error, fetchPosts } = postsStore

onMounted(() => {
  if (posts.length === 0) {
    fetchPosts()
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'open': 'Открыт',
    'in_progress': 'В работе',
    'completed': 'Завершен',
    'closed': 'Закрыт'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.posts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-card {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #1a1a1a;
}

.post-card h3 {
  color: #f4511e;
  margin-bottom: 8px;
}

.post-meta {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  font-size: 14px;
  color: #888;
  flex-wrap: wrap;
}

.post-author {
  font-style: italic;
  color: #666;
  margin-top: 8px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888;
}

.error {
  text-align: center;
  padding: 40px;
  color: #ff6b6b;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #888;
  position: relative;
  left: 150px;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #f4511e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #e64a19;
}
</style>