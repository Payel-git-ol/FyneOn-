import { useAuthStore } from '@/stores/auth'
import { API_CONFIG } from '@/config/configApi'

const AUTH_BASE = API_CONFIG.AUTH.baseURL

export const authApi = {
  async requestCode(email: string): Promise<boolean> {
    const authStore = useAuthStore()
    authStore.setLoading(true)
    authStore.setError('')

    try {
      const formData = new URLSearchParams()
      formData.append('email', email)

      console.log('Sending request to:', `${AUTH_BASE}/request-code`)

      const response = await fetch(`${AUTH_BASE}/request-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error:', errorText)
        throw new Error(`Ошибка сервера: ${response.status} ${errorText}`)
      }

      authStore.setEmail(email)
      return true
    } catch (err) {
      console.error('Fetch error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка сети'
      authStore.setError(errorMessage)
      return false
    } finally {
      authStore.setLoading(false)
    }
  },

  async verifyCode(email: string, code: string): Promise<boolean> {
    const authStore = useAuthStore()
    authStore.setLoading(true)
    authStore.setError('')

    try {
      const formData = new URLSearchParams()
      formData.append('email', email)
      formData.append('code', code)

      console.log('Verifying code for email:', email)

      const response = await fetch(`${AUTH_BASE}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })

      console.log('Verify response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ошибка верификации: ${response.status} ${errorText}`)
      }

      const token = await response.text()
      console.log('Received token:', token.substring(0, 20) + '...')

      if (token && token.startsWith('eyJhbGciOi')) {
        localStorage.setItem('auth_token', token)
        authStore.setStep('register')
        return true
      }
      
      throw new Error('Неверный формат токена')
    } catch (err) {
      console.error('Verify error:', err)
      authStore.setError(err instanceof Error ? err.message : 'Неизвестная ошибка верификации')
      return false
    } finally {
      authStore.setLoading(false)
    }
  },

  async register(username: string): Promise<boolean> {
    const authStore = useAuthStore()
    authStore.setLoading(true)
    authStore.setError('')

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Токен не найден в localStorage')
      }

      const formData = new URLSearchParams()
      formData.append('name', username)

      console.log('FormData content:', formData.toString())

      const response = await fetch(`${AUTH_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      console.log('Register response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error response:', errorText)
        throw new Error(`Ошибка регистрации: ${response.status} ${errorText}`)
      }

      const resultText = await response.text()
      console.log('Registration successful! Response:', resultText)

      return true
    } catch (err) {
      console.error('Register error details:', err)
      authStore.setError(err instanceof Error ? err.message : 'Неизвестная ошибка регистрации')
      return false
    } finally {
      authStore.setLoading(false)
    }
  },
}