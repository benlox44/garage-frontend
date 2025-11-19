<template>
    <v-app-bar :style="{
        background: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderBottom: isDark ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(220, 38, 38, 0.2)',
        backdropFilter: 'blur(12px)'
    }" :elevation="8" app scroll-behavior="elevate" class="header-bar">
        <v-container fluid class="px-4 px-sm-6 px-lg-16 px-xl-24 py-2">
            <v-row align="center" justify="space-between" no-gutters>
                <!-- Logo -->
                <v-col cols="auto" class="d-flex align-center">
                    <div class="d-flex align-center logo-link text-decoration-none">
                        <div class="position-relative mr-2 mr-sm-3">
                            <!-- Icon Background Glow -->
                            <div class="glow-effect"></div>
                            <!-- Icon -->
                            <v-avatar :size="$vuetify.display.xs ? 40 : $vuetify.display.sm ? 44 : 48"
                                class="logo-avatar"
                                style="background: linear-gradient(135deg, rgb(220 38 38), rgb(185 28 28));">
                                <v-icon color="white" :size="$vuetify.display.xs ? 22 : $vuetify.display.sm ? 26 : 28">
                                    mdi-tune-variant
                                </v-icon>
                            </v-avatar>
                        </div>
                        <div class="d-flex flex-column">
                            <h1 :class="[
                                'logo-text',
                                $vuetify.display.xs ? 'text-h6' : $vuetify.display.sm ? 'text-h5' : 'text-h4',
                                'font-weight-black',
                                isDark ? 'text-white' : 'text-grey-darken-4'
                            ]">
                                GarageConnect
                            </h1>
                            <span :class="[
                                'text-red font-weight-medium tracking-wide',
                                $vuetify.display.xs ? 'text-caption' : 'text-body-2'
                            ]">
                                Sistema de Gestión
                            </span>
                        </div>
                    </div>
                </v-col>

                <v-spacer></v-spacer>

                <!-- Notifications Button -->
                <v-col cols="auto" class="d-flex align-center mr-1 mr-sm-2">
                    <v-menu 
                        :close-on-content-click="false" 
                        :max-width="$vuetify.display.xs ? 320 : 400"
                        location="bottom"
                    >
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                icon
                                variant="text"
                                :size="$vuetify.display.xs ? 'small' : 'default'"
                                class="notification-button"
                            >
                                <v-badge
                                    :content="unreadCount"
                                    :model-value="unreadCount > 0"
                                    color="red"
                                    overlap
                                >
                                    <v-icon 
                                        :size="$vuetify.display.xs ? 20 : 24"
                                        :color="isDark ? 'white' : 'grey-darken-2'"
                                    >
                                        mdi-bell
                                    </v-icon>
                                </v-badge>
                            </v-btn>
                        </template>

                        <v-card :style="{ background: isDark ? '#1a1a1a' : '#ffffff' }">
                            <v-card-title 
                                :class="[
                                    'd-flex justify-space-between align-center',
                                    $vuetify.display.xs ? 'pa-3' : 'pa-4'
                                ]"
                            >
                                <span :class="$vuetify.display.xs ? 'text-subtitle-1' : 'text-h6'" class="font-weight-bold">
                                    Notificaciones
                                </span>
                                <v-btn
                                    v-if="unreadCount > 0"
                                    size="x-small"
                                    variant="text"
                                    color="red"
                                    @click="markAllAsRead"
                                    :class="$vuetify.display.xs ? 'text-caption' : 'text-body-2'"
                                >
                                    {{ $vuetify.display.xs ? 'Leer todas' : 'Marcar todas como leídas' }}
                                </v-btn>
                            </v-card-title>
                            
                            <v-divider></v-divider>

                            <v-list 
                                :style="{ 
                                    background: isDark ? '#1a1a1a' : '#ffffff', 
                                    maxHeight: $vuetify.display.xs ? '300px' : '400px', 
                                    overflowY: 'auto' 
                                }"
                            >
                                <template v-if="notifications.length > 0">
                                    <template v-for="(notification, index) in notifications" :key="notification.id">
                                        <v-list-item
                                            :class="{ 'notification-unread': !notification.read }"
                                            @click="markAsRead(notification.id)"
                                            class="notification-item"
                                            :density="$vuetify.display.xs ? 'compact' : 'default'"
                                        >
                                            <template v-slot:prepend>
                                                <v-avatar 
                                                    :color="getNotificationColor(notification.type)" 
                                                    :size="$vuetify.display.xs ? 32 : 40"
                                                >
                                                    <v-icon color="white" :size="$vuetify.display.xs ? 16 : 20">
                                                        {{ getNotificationIcon(notification.type) }}
                                                    </v-icon>
                                                </v-avatar>
                                            </template>

                                            <v-list-item-title 
                                                :class="[
                                                    'font-weight-medium mb-1',
                                                    $vuetify.display.xs ? 'text-body-2' : 'text-body-1'
                                                ]"
                                            >
                                                {{ notification.title }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle 
                                                :class="[
                                                    'text-wrap',
                                                    $vuetify.display.xs ? 'text-caption' : 'text-body-2'
                                                ]"
                                            >
                                                {{ notification.message }}
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle class="text-caption mt-1">
                                                {{ formatTime(notification.time) }}
                                            </v-list-item-subtitle>

                                            <template v-slot:append>
                                                <v-icon v-if="!notification.read" color="red" size="8">
                                                    mdi-circle
                                                </v-icon>
                                            </template>
                                        </v-list-item>
                                        <v-divider v-if="index < notifications.length - 1"></v-divider>
                                    </template>
                                </template>
                                <v-list-item v-else :density="$vuetify.display.xs ? 'compact' : 'default'">
                                    <v-list-item-title class="text-center text-grey">
                                        No tienes notificaciones
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>

                            <v-divider></v-divider>

                            <v-card-actions :class="$vuetify.display.xs ? 'pa-2' : 'pa-3'">
                                <v-btn
                                    block
                                    variant="text"
                                    color="red"
                                    :size="$vuetify.display.xs ? 'x-small' : 'small'"
                                    @click="viewAllNotifications"
                                >
                                    Ver todas
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </v-col>

                <!-- Theme Toggle - Hidden on xs, shown on sm+ -->
                <v-col cols="auto" class="d-none d-sm-flex align-center mr-2 mr-sm-3">
                    <ThemeToggle />
                </v-col>

                <!-- Navigation Buttons - Desktop -->
                <v-col cols="auto" class="d-none d-lg-flex align-center gap-2">
                    <v-btn 
                        variant="outlined" 
                        color="red"
                        size="default"
                        rounded="xl"
                        class="auth-button font-weight-bold" 
                        :style="{
                            borderWidth: '2px',
                            backdropFilter: 'blur(4px)'
                        }"
                    >
                        Ordenes de trabajo
                    </v-btn>
                    <v-btn 
                        variant="outlined" 
                        color="red"
                        size="default"
                        rounded="xl"
                        class="auth-button font-weight-bold" 
                        :style="{
                            borderWidth: '2px',
                            backdropFilter: 'blur(4px)'
                        }"
                    >
                        Citas
                    </v-btn>
                    <v-btn 
                        variant="outlined" 
                        color="red"
                        size="default"
                        rounded="xl"
                        class="auth-button font-weight-bold" 
                        :style="{
                            borderWidth: '2px',
                            backdropFilter: 'blur(4px)'
                        }"
                    >
                        Perfil
                    </v-btn>
                    <v-btn 
                        @click="handleLogout" 
                        variant="outlined" 
                        color="red"
                        size="default"
                        rounded="xl"
                        class="auth-button font-weight-bold" 
                        :style="{
                            borderWidth: '2px',
                            backdropFilter: 'blur(4px)'
                        }"
                    >
                        Cerrar Sesión
                    </v-btn>
                </v-col>

                <!-- Navigation Menu - Mobile/Tablet -->
                <v-col cols="auto" class="d-flex d-lg-none align-center">
                    <v-menu location="bottom">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                icon
                                variant="text"
                                :size="$vuetify.display.xs ? 'small' : 'default'"
                            >
                                <v-icon 
                                    :size="$vuetify.display.xs ? 24 : 28"
                                    :color="isDark ? 'white' : 'grey-darken-2'"
                                >
                                    mdi-menu
                                </v-icon>
                            </v-btn>
                        </template>

                        <v-list :style="{ background: isDark ? '#1a1a1a' : '#ffffff' }">
                            <v-list-item @click="() => {}">
                                <template v-slot:prepend>
                                    <v-icon color="red">mdi-file-document</v-icon>
                                </template>
                                <v-list-item-title>Ordenes de trabajo</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item @click="() => {}">
                                <template v-slot:prepend>
                                    <v-icon color="red">mdi-calendar-clock</v-icon>
                                </template>
                                <v-list-item-title>Citas</v-list-item-title>
                            </v-list-item>
                            
                            <v-list-item @click="() => {}">
                                <template v-slot:prepend>
                                    <v-icon color="red">mdi-account</v-icon>
                                </template>
                                <v-list-item-title>Perfil</v-list-item-title>
                            </v-list-item>

                            <v-divider class="my-2"></v-divider>
                            
                            <v-list-item @click="handleLogout">
                                <template v-slot:prepend>
                                    <v-icon color="red">mdi-logout</v-icon>
                                </template>
                                <v-list-item-title>Cerrar Sesión</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>

                <!-- Theme Toggle - Only visible on xs -->
                <v-col cols="auto" class="d-flex d-sm-none align-center ml-2">
                    <ThemeToggle />
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>


<script setup lang="ts">
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'
import { RouterLink, useRouter } from 'vue-router'
import api from '@/services/garage-back-api'
import { ref, computed } from 'vue'

const { isDark } = useTheme()

const router = useRouter()

// Notifications state
interface Notification {
  id: number
  type: 'appointment' | 'status' | 'reminder' | 'info'
  title: string
  message: string
  time: Date
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'appointment',
    title: 'Cita Confirmada',
    message: 'Tu cita para mantenimiento ha sido confirmada para mañana a las 10:00 AM',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false
  },
  {
    id: 2,
    type: 'status',
    title: 'Vehículo Listo',
    message: 'Tu vehículo Toyota Corolla 2020 está listo para recoger',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Recordatorio de Mantenimiento',
    message: 'Es tiempo de realizar el cambio de aceite de tu vehículo',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'Nueva Promoción',
    message: '20% de descuento en servicios de frenos este mes',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    appointment: 'mdi-calendar-check',
    status: 'mdi-car-wrench',
    reminder: 'mdi-bell-alert',
    info: 'mdi-information'
  }
  return icons[type] || 'mdi-bell'
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    appointment: 'green',
    status: 'blue',
    reminder: 'orange',
    info: 'purple'
  }
  return colors[type] || 'grey'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Justo ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const viewAllNotifications = () => {
  // Navegar a una página de notificaciones completa
  console.log('Ver todas las notificaciones')
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    api.logout()
    router.push('/')
  }
}
</script>

<style scoped>
.header-bar {
    transition: all 0.3s ease-in-out;
}

.logo-link {
    text-decoration: none;
    transition: all 0.3s ease;
}

.glow-effect {
    position: absolute;
    inset: 0;
    background-color: rgba(220, 38, 38, 0.3);
    border-radius: 12px;
    filter: blur(12px);
    transition: all 0.3s;
}

.logo-link:hover .glow-effect {
    background-color: rgba(220, 38, 38, 0.5);
}

.logo-avatar {
    position: relative;
    transition: transform 0.3s ease;
}

.logo-link:hover .logo-avatar {
    transform: scale(1.1);
}

.logo-text {
    transition: color 0.3s ease;
    line-height: 1.2;
}

.logo-link:hover .logo-text {
    opacity: 0.8;
}

.auth-button {
    transition: all 0.3s ease;
    white-space: nowrap;
}

.auth-button:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(220, 38, 38, 0.3);
    background-color: rgba(220, 38, 38, 0.1) !important;
}

.tracking-wide {
    letter-spacing: 0.05em;
}

.notification-button {
    transition: all 0.3s ease;
}

.notification-button:hover {
    transform: scale(1.1);
}

.notification-item {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.notification-item:hover {
    background-color: rgba(220, 38, 38, 0.05) !important;
}

.notification-unread {
    background-color: rgba(220, 38, 38, 0.03) !important;
}

/* Responsive adjustments */
@media (max-width: 599px) {
    .logo-text {
        font-size: 1.1rem !important;
    }
}
</style>
