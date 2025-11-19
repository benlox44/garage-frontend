<template>
  <v-app-bar
    :style="{ 
      background: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderBottom: isDark ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(220, 38, 38, 0.2)',
      backdropFilter: 'blur(12px)'
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
          <div class="d-flex align-center logo-link text-decoration-none">
            <div class="position-relative mr-2 mr-sm-3">
              <!-- Icon Background Glow -->
              <div class="glow-effect"></div>
              <!-- Icon -->
              <v-avatar
                :size="$vuetify.display.xs ? 40 : $vuetify.display.sm ? 44 : 48"
                class="logo-avatar"
                style="background: linear-gradient(135deg, rgb(220 38 38), rgb(185 28 28));"
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
                  isDark ? 'text-white' : 'text-grey-darken-4'
                ]"
              >
                GarageConnect
              </h1>
              <span 
                :class="[
                  'text-red font-weight-medium tracking-wide',
                  $vuetify.display.xs ? 'text-caption' : 'text-body-2'
                ]"
              >
                Sistema de Gestión
              </span>
            </div>
          </div>
        </v-col>

        <v-spacer></v-spacer>

        <!-- Theme Toggle - Hidden on xs, shown on sm+ -->
        <v-col cols="auto" class="d-none d-sm-flex align-center mr-2 mr-sm-3">
          <ThemeToggle />
        </v-col>

        <!-- Navigation Button -->
        <v-col cols="auto">
          <v-btn
            to="/login"
            variant="outlined"
            color="red"
            :size="$vuetify.display.xs ? 'small' : $vuetify.display.sm ? 'default' : 'large'"
            rounded="xl"
            class="auth-button font-weight-bold"
            :style="{ 
              borderWidth: '2px',
              backdropFilter: 'blur(4px)'
            }"
          >
            <span class="d-none d-sm-inline">Iniciar Sesión/Registrarse</span>
            <span class="d-inline d-sm-none">Iniciar Sesión</span>
          </v-btn>
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
import { RouterLink } from 'vue-router'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
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

/* Responsive adjustments */
@media (max-width: 599px) {
  .logo-text {
    font-size: 1.1rem !important;
  }
}
</style>