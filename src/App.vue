<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import NotificationToast from '@/components/shared/NotificationToast.vue'
import socketService from '@/services/socket.service'

const { initTheme } = useTheme()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Inicializar tema y auth al montar la app
onMounted(() => {
  initTheme()
  authStore.initialize()

  // Configurar listeners globales de Socket.io
  socketService.on('APPOINTMENT_CREATED', (data: any) => {
    notificationStore.show(`Nueva cita creada: ${data.date || ''}`, 'info')
  })

  socketService.on('WORK_ORDER_STATUS_CHANGED', (data: any) => {
    notificationStore.show(`Orden de trabajo actualizada: ${data.status}`, 'success')
  })

  socketService.on('INVENTORY_LOW_STOCK', (data: any) => {
    notificationStore.show(`Alerta de inventario: ${data.item} bajo stock`, 'warning')
  })
})
</script>

<template>
  <v-app class="app-global">
    <NotificationToast />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-global {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>

