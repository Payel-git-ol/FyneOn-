import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postsApi } from '@/service/postsApi'  
import type { Post, CreatePostRequest } from '@/types/posts'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPosts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const fetchedPosts = await postsApi.getPosts()
      console.log('Store received posts:', fetchedPosts)
      posts.value = fetchedPosts
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
      console.error('Error fetching posts:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createPost = async (postData: CreatePostRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newPost = await postsApi.createPost(postData)
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
      console.error('Error creating post:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    createPost
  }
})