export const API_CONFIG = {
  AUTH: {
    baseURL: import.meta.env.DEV ? '/api/auth' : 'http://localhost:8080/auth'
  },
  POSTS: {
    baseURL: import.meta.env.DEV ? '/api/posts' : 'http://localhost:7070/api/posts'
  }
} as const