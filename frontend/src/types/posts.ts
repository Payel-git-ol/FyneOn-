export interface Post {
  id: number
  sender: string | null
  content: string
  name: string | null
  receivedAt: string
  // Опциональные поля для совместимости со старым кодом
  title?: string
  description?: string
  price?: number
  deadline?: string
  status?: string
  customer?: {
    username?: string
    id?: number
    email?: string
    rating?: number
    createdAt?: string
  }
}

export interface CreatePostRequest {
  content: string
  name?: string
  sender?: string
  // Для совместимости со старым кодом
  title?: string
  description?: string
  price?: number
  deadline?: string
}