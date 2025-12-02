import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/garage-back-api'
import socketService from '@/services/socket.service'
import type { User } from '@/types/garage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = computed(() => !!token.value)

  function initialize() {
    if (token.value) {
      socketService.connect(token.value)
      fetchUserProfile()
    }
  }

  async function login(email: string, pass: string) {
    const response = await api.login(email, pass)
    if (response.success && response.data) {
      // Ajuste según nueva documentación: access_token
      token.value = response.data.access_token
      user.value = response.data.user

      localStorage.setItem('token', token.value)
      socketService.connect(token.value)

      return true
    }
    return false
  }
  async function fetchUserProfile() {
    const profile = await api.getProfile()
    if (profile) {
      user.value = profile
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    socketService.disconnect()
    window.location.href = '/login'
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initialize,
    fetchUserProfile
  }
})
