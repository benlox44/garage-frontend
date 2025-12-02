<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import type { NotificationPayload } from '@/types/garage'

const notificationStore = useNotificationStore()
const { allNotifications } = storeToRefs(notificationStore)
const router = useRouter()
const route = useRoute()
const { isDark } = useTheme()

onMounted(() => {
  notificationStore.fetchAll()
})

const handleNotificationClick = (notification: NotificationPayload) => {
  if (!notification.read && notification.id) {
    notificationStore.markAsRead(notification.id)
  }

  const query: Record<string, string | number> = {}

  // Determinar la ruta base (usuario o mecanico)
  let basePath = route.path
  if (basePath.includes('/notificaciones')) {
    // Si estamos en la vista de notificaciones, necesitamos saber a dónde ir
    // Asumimos que el usuario tiene un rol y redirigimos a su home
    // Esto es un poco hacky, idealmente sabríamos el rol del usuario
    // Pero podemos inferirlo o redirigir a una ruta genérica que redirija
    if (basePath.includes('/usuario')) basePath = '/usuario'
    else if (basePath.includes('/mechanic')) basePath = '/mechanic'
    else basePath = '/usuario' // Default
  }

  if (notification.type.includes('APPOINTMENT')) {
    query.section = 'appointments'
    if (notification.metadata?.appointmentId) {
      query.appointmentId = notification.metadata.appointmentId as number
    }
  } else if (notification.type.includes('WORK') || notification.type.includes('ORDER')) {
    query.section = 'orders'
    if (notification.metadata?.workOrderId) {
      query.workOrderId = notification.metadata.workOrderId as number
    }
  } else if (notification.type.includes('VEHICLE')) {
    query.section = 'vehicles'
  }

  router.push({ path: basePath, query })
}

const deleteNotification = async (id: number, event: Event) => {
  event.stopPropagation() // Evitar que se dispare el click del item
  await notificationStore.deleteNotification(id)
}

const getIcon = (type: string) => {
  if (!type) return 'mdi-information'
  if (type.includes('WORK') || type.includes('ORDER')) return 'mdi-wrench'
  if (type.includes('APPOINTMENT')) return 'mdi-calendar-clock'
  if (type.includes('COMPLETED') || type.includes('SUCCESS')) return 'mdi-check-circle'
  if (type.includes('WARNING') || type.includes('ALERT')) return 'mdi-alert'
  return 'mdi-information'
}

const getColor = (type: string) => {
  if (!type) return 'info'
  if (type.includes('WORK') || type.includes('ORDER')) return 'primary'
  if (type.includes('APPOINTMENT')) return 'secondary'
  if (type.includes('COMPLETED') || type.includes('SUCCESS')) return 'success'
  if (type.includes('WARNING') || type.includes('ALERT')) return 'warning'
  return 'info'
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString()
}
</script>

<template>
  <v-container :class="{ 'dark-theme': isDark }">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4" :class="{ 'text-white': isDark }">Mis Notificaciones</h1>
    </div>

    <v-card v-if="allNotifications.length > 0" :class="{ 'bg-grey-darken-4': isDark }">
      <v-list lines="two" :bg-color="isDark ? '#1e1e1e' : 'white'">
        <template v-for="(item, index) in allNotifications" :key="item.id">
          <v-list-item
            @click="handleNotificationClick(item)"
            class="notification-item"
            :class="{ 'unread': !item.read, 'dark-item': isDark }"
            link
          >
            <template v-slot:prepend>
              <v-avatar :color="getColor(item.type || '')" class="mr-3 elevation-2">
                <v-icon color="white">{{ getIcon(item.type || '') }}</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold mb-1">
              {{ item.title }}
              <v-chip v-if="!item.read" size="x-small" color="primary" class="ml-2" variant="elevated">Nueva</v-chip>
            </v-list-item-title>

            <v-list-item-subtitle :class="{ 'text-grey-lighten-1': isDark }">
              {{ item.message }}
            </v-list-item-subtitle>

            <v-list-item-subtitle class="text-caption mt-2 d-flex align-center">
              <v-icon size="small" class="mr-1" :color="isDark ? 'grey' : 'grey-darken-1'">mdi-clock-outline</v-icon>
              <span :class="{ 'text-grey': isDark }">{{ formatDate(item.createdAt) }}</span>
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
                @click="deleteNotification(item.id!, $event)"
                title="Eliminar notificación"
                class="delete-btn"
              ></v-btn>
            </template>
          </v-list-item>
          <v-divider v-if="index < allNotifications.length - 1" :color="isDark ? 'grey-darken-2' : undefined"></v-divider>
        </template>
      </v-list>
    </v-card>

    <div v-else class="text-center py-16">
      <v-icon size="80" :color="isDark ? 'grey-darken-2' : 'grey-lighten-1'" class="mb-4">mdi-bell-off</v-icon>
      <h3 class="text-h5" :class="{ 'text-grey': isDark, 'text-grey-darken-1': !isDark }">No tienes notificaciones</h3>
      <p class="text-body-1 mt-2" :class="{ 'text-grey-darken-1': isDark, 'text-grey': !isDark }">Te avisaremos cuando haya novedades importantes.</p>
    </div>
  </v-container>
</template>

<style scoped>
.notification-item {
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
  padding-top: 16px;
  padding-bottom: 16px;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.02) !important;
  transform: translateX(4px);
}

.notification-item.dark-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.notification-item.unread {
  background-color: #f0f7ff;
  border-left-color: #1976D2;
}

.notification-item.unread.dark-item {
  background-color: #1e2a38;
  border-left-color: #64B5F6;
}

.delete-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.notification-item:hover .delete-btn {
  opacity: 1;
}
</style>
