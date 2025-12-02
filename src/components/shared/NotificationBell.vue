<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const notificationStore = useNotificationStore()
const { unreadCount, unreadNotifications } = storeToRefs(notificationStore)

onMounted(() => {
  notificationStore.initialize()
})

const handleNotificationClick = (id?: number) => {
  if (id) notificationStore.markAsRead(id)
}

const markAllRead = () => {
  unreadNotifications.value.forEach(n => {
    if (n.id) notificationStore.markAsRead(n.id)
  })
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
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // Menos de 24 horas
  if (diff < 86400000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString()
}
</script>

<template>
  <v-menu location="bottom end" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" class="mr-2">
        <v-badge :content="unreadCount" color="error" v-if="unreadCount > 0">
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>mdi-bell-outline</v-icon>
      </v-btn>
    </template>

    <v-card width="350" max-height="400" class="overflow-y-auto">
      <v-card-title class="d-flex justify-space-between align-center py-3 px-4">
        <span class="text-subtitle-1 font-weight-bold">Notificaciones</span>
        <v-btn
          v-if="unreadCount > 0"
          variant="text"
          density="compact"
          color="primary"
          size="small"
          @click="markAllRead"
        >
          Marcar leídas
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-list v-if="unreadNotifications.length > 0" lines="three" class="pa-0">
        <v-list-item
          v-for="item in unreadNotifications"
          :key="item.id"
          @click="handleNotificationClick(item.id)"
          link
        >
          <template v-slot:prepend>
            <v-avatar :color="getColor(item.type || '')" size="32" class="mr-2">
              <v-icon color="white" size="18">{{ getIcon(item.type || '') }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="text-body-2 font-weight-bold mb-1">
            {{ item.title }}
          </v-list-item-title>

          <v-list-item-subtitle class="text-caption text-medium-emphasis mb-1">
            {{ item.message }}
          </v-list-item-subtitle>

          <v-list-item-subtitle class="text-caption text-disabled">
            {{ formatDate(item.createdAt) }}
          </v-list-item-subtitle>

          <template v-slot:append>
             <v-icon size="x-small" color="primary" class="mt-2">mdi-circle-medium</v-icon>
          </template>
        </v-list-item>
      </v-list>

      <div v-else class="pa-8 text-center text-medium-emphasis text-body-2">
        <v-icon size="large" color="grey-lighten-1" class="mb-2">mdi-bell-sleep</v-icon>
        <div>No tienes notificaciones nuevas</div>
      </div>
    </v-card>
  </v-menu>
</template>
