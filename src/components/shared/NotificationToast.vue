<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { toastNotifications } = storeToRefs(notificationStore)

const getTypeClasses = (type: string) => {
  switch (type) {
    case 'success': return 'bg-green-500 text-white'
    case 'error': return 'bg-red-500 text-white'
    case 'warning': return 'bg-yellow-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="notification in toastNotifications"
        :key="notification.id"
        class="px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[300px] pointer-events-auto"
        :class="getTypeClasses(notification.type)"
      >
        <span>{{ notification.message }}</span>
        <button
          @click="notificationStore.remove(notification.id)"
          class="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template><style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
