<template>
  <v-app-bar
    :style="{
      background: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderBottom: isDark
        ? '1px solid rgba(220, 38, 38, 0.3)'
        : '1px solid rgba(220, 38, 38, 0.2)',
      backdropFilter: 'blur(12px)',
    }"
    :elevation="8"
    app
    scroll-behavior="elevate"
    class="header-bar"
  >
    <v-container fluid class="px-4 px-sm-6 px-lg-16 px-xl-24 py-2">
      <v-row align="center" justify="space-between" no-gutters>
        <!-- Logo -->
        <v-col cols="auto" class="d-flex align-center">
          <RouterLink
            to="/usuario"
            class="d-flex align-center logo-link text-decoration-none"
            @click.native="reloadUsuario"
          >
            <div class="position-relative mr-2 mr-sm-3">
              <!-- Icon Background Glow -->
              <div class="glow-effect"></div>
              <!-- Icon -->
              <v-avatar
                :size="$vuetify.display.xs ? 40 : $vuetify.display.sm ? 44 : 48"
                class="logo-avatar"
                style="background: linear-gradient(135deg, rgb(220 38 38), rgb(185 28 28))"
              >
                <v-icon
                  color="white"
                  :size="$vuetify.display.xs ? 22 : $vuetify.display.sm ? 26 : 28"
                >
                  mdi-tune-variant
                </v-icon>
              </v-avatar>
            </div>
            <div class="d-flex flex-column">
              <h1
                :class="[
                  'logo-text',
                  $vuetify.display.xs ? 'text-h6' : $vuetify.display.sm ? 'text-h5' : 'text-h4',
                  'font-weight-black',
                  isDark ? 'text-white' : 'text-grey-darken-4',
                ]"
              >
                GarageConnect
              </h1>
              <span
                :class="[
                  'text-red font-weight-medium tracking-wide',
                  $vuetify.display.xs ? 'text-caption' : 'text-body-2',
                ]"
              >
                Sistema de Gestión
              </span>
            </div>
          </RouterLink>
        </v-col>

        <v-spacer></v-spacer>

        <!-- Notifications Button -->
        <v-col cols="auto" class="d-flex align-center mr-1 mr-sm-2">
          <NotificationBell />
        </v-col>

        <!-- Theme Toggle - Hidden on xs, shown on sm+ -->
        <v-col cols="auto" class="d-none d-sm-flex align-center mr-2 mr-sm-3">
          <ThemeToggle />
        </v-col>

        <!-- Navigation Buttons - Desktop -->
        <v-col cols="auto" class="d-none d-lg-flex align-center gap-2">
          <v-btn
            @click="$emit('navigate', 'orders')"
            variant="outlined"
            color="red"
            size="default"
            rounded="xl"
            class="auth-button font-weight-bold"
            :style="{
              borderWidth: '2px',
              backdropFilter: 'blur(4px)',
            }"
          >
            Ordenes de trabajo
          </v-btn>
          <v-btn
            @click="$emit('navigate', 'vehicles')"
            variant="outlined"
            color="red"
            size="default"
            rounded="xl"
            class="auth-button font-weight-bold"
            :style="{
              borderWidth: '2px',
              backdropFilter: 'blur(4px)',
            }"
          >
            Mis Vehículos
          </v-btn>
          <v-btn
            @click="$emit('navigate', 'appointments')"
            variant="outlined"
            color="red"
            size="default"
            rounded="xl"
            class="auth-button font-weight-bold"
            :style="{
              borderWidth: '2px',
              backdropFilter: 'blur(4px)',
            }"
          >
            Citas
          </v-btn>
          <v-btn
            @click="$emit('navigate', 'profile')"
            variant="outlined"
            color="red"
            size="default"
            rounded="xl"
            class="auth-button font-weight-bold"
            :style="{
              borderWidth: '2px',
              backdropFilter: 'blur(4px)',
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
              backdropFilter: 'blur(4px)',
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
              <v-list-item @click="$emit('navigate', 'orders')">
                <template v-slot:prepend>
                  <v-icon color="red">mdi-file-document</v-icon>
                </template>
                <v-list-item-title>Ordenes de trabajo</v-list-item-title>
              </v-list-item>

              <v-list-item @click="$emit('navigate', 'vehicles')">
                <template v-slot:prepend>
                  <v-icon color="red">mdi-car</v-icon>
                </template>
                <v-list-item-title>Mis Vehículos</v-list-item-title>
              </v-list-item>

              <v-list-item @click="$emit('navigate', 'appointments')">
                <template v-slot:prepend>
                  <v-icon color="red">mdi-calendar-clock</v-icon>
                </template>
                <v-list-item-title>Citas</v-list-item-title>
              </v-list-item>

              <v-list-item @click="$emit('navigate', 'profile')">
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
  <Modal
    :show="showModal"
    :title="modalConfig.title"
    :message="modalConfig.message"
    :type="modalConfig.type"
    :show-cancel="modalConfig.showCancel"
    @close="showModal = false"
    @confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'
import { RouterLink, useRouter } from 'vue-router'
import api from '@/services/garage-back-api'
import { ref } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import NotificationBell from '@/components/shared/NotificationBell.vue'

const { isDark } = useTheme()
const router = useRouter()

const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})
const reloadUsuario = (event: MouseEvent) => {
  event.preventDefault() // Bloquea el comportamiento normal del RouterLink

  router.push('/usuario').then(() => {
    window.location.reload() // Fuerza recarga real
  })
}
const handleConfirm = () => {
  if (modalConfig.value.action) {
    modalConfig.value.action()
  } else {
    showModal.value = false
  }
}

const handleLogout = () => {
  modalConfig.value = {
    title: 'Cerrar Sesión',
    message: '¿Estás seguro de que deseas cerrar sesión?',
    type: 'warning',
    showCancel: true,
    action: () => {
      api.logout()
      router.push('/')
    },
  }
  showModal.value = true
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
