import type { Post, CreatePostRequest } from '@/types/posts'
import { API_CONFIG } from '@/config/configApi'

const POSTS_BASE = API_CONFIG.POSTS.baseURL

// Функция для fallback данных
function getFallbackPosts(): Post[] {
  console.log('⚠️ Using fallback test data')
  return [
    {
      id: 1,
      sender: "TestUser",
      content: "Это тестовый пост для проверки отображения",
      name: "Тестовый пост",
      receivedAt: new Date().toISOString(),
      title: "Тестовый пост",
      description: "Это тестовый пост для проверки отображения",
      price: 1000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "open",
      customer: {
        username: "TestUser",
        id: 1,
        email: "test@example.com",
        rating: 4.8
      }
    }
  ]
}

export const postsApi = {
  async getPosts(): Promise<Post[]> {
    try {
      const token = localStorage.getItem('auth_token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      console.log('🔍 Fetching posts from:', POSTS_BASE)
      console.log('🔑 Token exists:', !!token)

      const response = await fetch(`${POSTS_BASE}`, {
        method: 'GET',
        headers: headers
      })

      console.log('📊 Response status:', response.status)

      // Получаем сырой текст для диагностики
      const rawText = await response.text()
      console.log('📝 Raw response (first 500 chars):', rawText.substring(0, 500))

      if (!response.ok) {
        console.error('❌ Server error response:', rawText)
        throw new Error(`Ошибка при получении постов: ${response.status} - ${rawText}`)
      }

      // Парсим JSON
      let data: any
      try {
        data = JSON.parse(rawText)
        console.log('✅ Parsed JSON data:', data)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        return getFallbackPosts()
      }

      // Обрабатываем разные форматы ответа
      let posts: Post[] = []

      if (Array.isArray(data)) {
        console.log('📦 Response is array, length:', data.length)
        posts = data.map((item: any, index: number) => ({
          id: item.id || index + 1,
          sender: item.sender,
          content: item.content,
          name: item.name,
          receivedAt: item.receivedAt,
          title: item.name || item.title,
          description: item.content || item.description,
          price: item.price || 0,
          deadline: item.deadline || new Date().toISOString(),
          status: item.status || 'open',
          customer: item.customer || {
            username: item.sender || 'Неизвестен'
          }
        }))
      } else {
        console.warn('⚠️ Unexpected response format, using fallback')
        return getFallbackPosts()
      }

      console.log('🎯 Final posts to return:', posts)
      return posts

    } catch (error) {
      console.error('❌ Failed to fetch posts:', error)
      return getFallbackPosts()
    }
  },

  async createPost(postData: CreatePostRequest): Promise<Post> {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Требуется авторизация')
      }

      // Подготавливаем данные для бэкенда
      const requestData = {
        content: postData.content || postData.description,
        name: postData.name || postData.title,
        sender: postData.sender,
        // Добавляем дополнительные поля если бэкенд их поддерживает
        ...(postData.price && { price: postData.price }),
        ...(postData.deadline && { deadline: postData.deadline })
      }

      console.log('📤 Sending create post data:', requestData)

      const response = await fetch(`${POSTS_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })

      const responseText = await response.text()
      console.log('📥 Create post response:', responseText)

      if (!response.ok) {
        throw new Error(`Ошибка при создании поста: ${response.status} - ${responseText}`)
      }

      let newPost: any
      try {
        newPost = JSON.parse(responseText)
      } catch {
        newPost = {
          id: Date.now(),
          content: postData.content,
          name: postData.name,
          sender: postData.sender,
          receivedAt: new Date().toISOString()
        }
      }

      // Преобразуем в наш формат
      return {
        id: newPost.id || Date.now(),
        sender: newPost.sender,
        content: newPost.content,
        name: newPost.name,
        receivedAt: newPost.receivedAt || new Date().toISOString(),
        title: newPost.name || newPost.title,
        description: newPost.content || newPost.description,
        price: newPost.price || postData.price || 0,
        deadline: newPost.deadline || postData.deadline || new Date().toISOString(),
        status: newPost.status || 'open',
        customer: newPost.customer || {
          username: newPost.sender || 'Неизвестен'
        }
      }

    } catch (error) {
      console.error('Failed to create post:', error)
      throw error
    }
  }
}