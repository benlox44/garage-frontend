<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

const notificationStore = useNotificationStore()
const { unreadCount, unreadNotifications } = storeToRefs(notificationStore)
const router = useRouter()
const route = useRoute()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = (e: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

const handleNotificationClick = (id?: number, type?: string) => {
  if (id) {
    notificationStore.markAsRead(id)
  }

  if (!type) return

  // Redirección para Admin
  if (type.includes('USER') || type.includes('CLIENT') || type.includes('MECHANIC')) {
    router.push({ path: route.path, query: { section: 'users' } })
  }
}

const markAllRead = () => {
  unreadNotifications.value.forEach(n => {
    if (n.id) notificationStore.markAsRead(n.id)
  })
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
  notificationStore.initialize()
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

const getIcon = (type: string) => {
  if (type.includes('WORK') || type.includes('ORDER')) return 'mdi-file-document-edit'
  if (type.includes('APPOINTMENT')) return 'mdi-calendar-clock'
  if (type.includes('USER') || type.includes('CLIENT')) return 'mdi-account'
  if (type.includes('VEHICLE')) return 'mdi-car'
  return 'mdi-information'
}
</script>

<template>
  <div class="relative" ref="menuRef">
    <!-- Bell Button -->
    <button
      @click.stop="toggleMenu"
      class="relative p-2 text-[#DEF2F1] hover:text-white transition-colors rounded-full hover:bg-[#3AAFA9]/20 focus:outline-none"
    >
      <i class="mdi mdi-bell text-2xl"></i>

      <!-- Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-[#17252A]"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-[#17252A] border border-[#3AAFA9]/30 rounded-xl shadow-2xl overflow-hidden z-50"
      >
        <div class="p-4 border-b border-[#3AAFA9]/20 flex justify-between items-center bg-[#2B7A78]/20">
          <h3 class="text-[#DEF2F1] font-bold flex items-center gap-2">
            <i class="mdi mdi-bell-ring"></i> Notificaciones
          </h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllRead"
            class="text-xs text-[#3AAFA9] hover:text-[#DEF2F1] font-medium transition-colors"
          >
            Marcar todas leídas
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto custom-scrollbar">
          <div v-if="unreadNotifications.length === 0" class="p-8 text-center text-[#3AAFA9]/60 flex flex-col items-center gap-3">
            <i class="mdi mdi-bell-sleep-outline text-5xl opacity-50"></i>
            <p>No tienes notificaciones nuevas</p>
          </div>

          <ul v-else class="divide-y divide-[#3AAFA9]/10">
            <li
              v-for="notification in unreadNotifications"
              :key="notification.id"
              @click="handleNotificationClick(notification.id, notification.type)"
              class="p-4 hover:bg-[#3AAFA9]/10 transition-colors cursor-pointer flex gap-3 items-start group"
            >
              <div class="shrink-0 mt-1 text-[#3AAFA9] group-hover:text-[#DEF2F1] transition-colors">
                <i class="mdi text-2xl" :class="getIcon(notification.type)"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[#DEF2F1] truncate">
                  {{ notification.title }}
                </p>
                <p class="text-xs text-[#3AAFA9] mt-0.5 line-clamp-2">
                  {{ notification.message }}
                </p>
                <p class="text-[10px] text-[#3AAFA9]/60 mt-1 flex items-center gap-1">
                  <i class="mdi mdi-clock-outline text-[10px]"></i>
                  {{ new Date(notification.createdAt || Date.now()).toLocaleString() }}
                </p>
              </div>
              <div class="shrink-0 flex flex-col items-end gap-2">
                <div class="w-2 h-2 bg-[#3AAFA9] rounded-full shadow-[0_0_5px_#3AAFA9]"></div>
              </div>
            </li>
          </ul>
        </div>

        <div class="p-2 bg-[#2B7A78]/10 border-t border-[#3AAFA9]/20 text-center">
          <button class="text-xs text-[#3AAFA9] hover:text-[#DEF2F1] font-medium py-1 w-full">
            Ver historial completo
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #17252A;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #3AAFA9;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2B7A78;
}
</style>
