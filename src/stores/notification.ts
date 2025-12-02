import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/garage-back-api'
import socketService from '@/services/socket.service'
import type { NotificationPayload } from '@/types/garage'

export interface UINotification {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export const useNotificationStore = defineStore('notification', () => {
  // Notificaciones efímeras (Toasts)
  const toastNotifications = ref<UINotification[]>([])
  // Notificaciones persistentes (Campanita)
  const unreadNotifications = ref<NotificationPayload[]>([])
  const unreadCount = ref(0)

  let nextToastId = 1

  // Inicializar listeners y cargar no leídas
  async function initialize() {
    await fetchUnread()

    socketService.on('notification', (payload: NotificationPayload) => {
      // 1. Mostrar Toast
      showToast(payload.message, mapTypeToToast(payload.type))
      // 2. Agregar a la lista de no leídas
      unreadNotifications.value.unshift(payload)
      unreadCount.value++
    })
  }

  async function fetchUnread() {
    const data = await api.getUnreadNotifications()
    unreadNotifications.value = data
    unreadCount.value = data.length
  }

  async function markAsRead(id: number) {
    await api.markNotificationRead(id)
    unreadNotifications.value = unreadNotifications.value.filter(n => n.id !== id)
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  // --- Lógica de Toasts ---
  function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const id = nextToastId++
    toastNotifications.value.push({ id, message, type })
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  function removeToast(id: number) {
    toastNotifications.value = toastNotifications.value.filter(n => n.id !== id)
  }

  function mapTypeToToast(apiType: string): 'info' | 'success' | 'warning' | 'error' {
    if (apiType.includes('ERROR') || apiType.includes('FAIL')) return 'error'
    if (apiType.includes('SUCCESS') || apiType.includes('COMPLETED')) return 'success'
    if (apiType.includes('WARNING') || apiType.includes('LOW')) return 'warning'
    return 'info'
  }

  return {
    toastNotifications,
    unreadNotifications,
    unreadCount,
    show: showToast,
    remove: removeToast,
    initialize,
    fetchUnread,
    markAsRead
  }
})
