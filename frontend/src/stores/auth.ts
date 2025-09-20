// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentEmail = ref('')
  const currentStep = ref<'email' | 'email_sent' | 'code' | 'register'>('email')
  const isLoading = ref(false)
  const error = ref('')

  const setEmail = (email: string) => {
    currentEmail.value = email
  }

  const setStep = (step: 'email' | 'email_sent' | 'code' | 'register') => {
    currentStep.value = step
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (message: string) => {
    error.value = message
  }

  return {
    currentEmail,
    currentStep,
    isLoading,
    error,
    setEmail,
    setStep,
    setLoading,
    setError
  }
})