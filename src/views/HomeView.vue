<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
// @ts-ignore: Vue SFC module declaration missing for Footer.vue
import Footer from '@/components/shared/Footer.vue'
import HeaderHomeView from '@/components/homeView/headerHomeView.vue';
import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();

const bgGradient = computed(() => {
  return isDark.value 
    ? '#000000'
    : 'linear-gradient(135deg, #ffffff 0%, #fef2f2 50%, #fee2e2 100%)';
});

const cardBg = computed(() => {
  return isDark.value
    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)';
});

const featureCardBg = computed(() => {
  return isDark.value
    ? 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #fef2f2 50%, #fee2e2 100%)';
});

const stats = [
  { title: 'Organizado', subtitle: 'Control Total' },
  { title: 'Eficiente', subtitle: 'Ahorra Tiempo' },
  { title: 'Profesional', subtitle: 'Mejor Servicio' }
];

const features = [
  {
    title: 'Para Clientes',
    icon: 'mdi-account',
    items: [
      'Agenda citas de manera rápida y sencilla',
      'Recibe notificaciones sobre el estado de tu vehículo',
      'Consulta el historial de servicios de tu vehículo',
      'Accede a la disponibilidad del taller en tiempo real'
    ]
  },
  {
    title: 'Para Mecánicos',
    icon: 'mdi-wrench',
    items: [
      'Gestiona tu agenda y citas de forma eficiente',
      'Registra y actualiza el estado de los vehículos',
      'Mantén un historial completo de todos los servicios',
      'Administra tu base de datos de clientes'
    ]
  }
];

const steps = [
  {
    number: 1,
    title: 'Regístrate',
    description: 'Crea tu cuenta como cliente o administrador del taller'
  },
  {
    number: 2,
    title: 'Agenda o Gestiona',
    description: 'Los clientes agendan citas y el taller las organiza'
  },
  {
    number: 3,
    title: 'Realiza Seguimiento',
    description: 'Monitorea el estado de cada vehículo y servicio'
  }
];
</script>

<template>
  <v-app :style="{ background: bgGradient }">
    <!-- Header -->
    <HeaderHomeView />

    <!-- Hero Section -->
    <v-main>
      <v-container fluid class="py-12 py-sm-16 py-lg-24 position-relative">
        <!-- Background decoration -->
        <div class="position-absolute w-100 h-100" style="top: 0; left: 0; overflow: hidden; pointer-events: none;">
          <div class="position-absolute bg-decoration"></div>
          <div class="position-absolute bg-decoration-delayed"></div>
        </div>

        <v-container class="position-relative" style="z-index: 10;">
          <!-- Hero Content -->
          <v-row class="text-center mb-16 mb-sm-20 mb-lg-24">
            <v-col cols="12">
              <!-- Badge -->
              <v-chip
                class="mb-4 animate-fade-in"
                :color="isDark ? 'rgb(254, 242, 242)' : 'rgba(0, 0, 0, 0.95)'"
                variant="outlined"
                style="border-color: rgba(220, 38, 38, 0.5);"
              >
                <span class="pulse-dot mr-2"></span>
                <span class="text-subtitle-2 font-weight-medium">Sistema de Gestión para tu Taller Automotriz</span>
              </v-chip>

              <!-- Hero Title -->
              <h1 class="text-h2 text-sm-h1 text-md-display-1 font-weight-black mb-8 animate-slide-up">
                <span class="gradient-text">
                  Gestiona tu Taller
                </span>
                <br />
                <span :class="isDark ? 'text-white' : 'text-black'">y tus Clientes</span>
              </h1>

              <!-- Hero Subtitle -->
              <p class="text-body-1 text-sm-h6 mx-auto mb-8 animate-slide-up" 
                 :class="isDark ? 'text-white' : 'text-black'"
                 style="max-width: 768px; animation-delay: 0.2s;">
                La solución completa para administrar citas, vehículos y clientes de tu servicio técnico de manera 
                <span class="text-red font-weight-bold">eficiente</span>, 
                <span class="text-red font-weight-bold">organizada</span> y 
                <span class="text-red font-weight-bold">profesional</span>.
              </p>

              <!-- CTA Buttons -->
              <div class="d-flex align-center justify-center animate-slide-up" style="animation-delay: 0.4s; height: 160px;">
                <v-btn
                  to="/login"
                  size="x-large"
                  rounded="xl"
                  elevation="8"
                  class="cta-button px-8 py-6 text-white font-weight-bold d-flex align-center justify-center"
                >
                  <span style="display:inline-block; text-align:center; width:100%;">Comienza Ahora</span>
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <!-- Stats Section -->
          <v-row class="animate-fade-in mb-8" style="animation-delay: 0.6s;" justify="center">
            <v-col cols="12" sm="4" md="4" v-for="stat in stats" :key="stat.title">
              <v-card
                class="stat-card pa-6 text-center"
                :style="{ 
                  background: cardBg,
                  border: '4px solid rgba(220, 38, 38, 0.3)',
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.2)'
                }"
                elevation="0"
              >
                <div
                  :class="isDark ? 'text-white' : 'text-red'"
                  style="font-size: clamp(1.1rem, 3.2vw, 1.75rem); line-height: 1.05; font-weight: 700; margin-bottom: 0.25rem; word-break: break-word;"
                >
                  {{ stat.title }}
                </div>
                <div
                  :class="isDark ? 'text-white' : 'text-black'"
                  style="font-size: clamp(0.85rem, 2.2vw, 1rem); opacity: 0.95; word-break: break-word;"
                >
                  {{ stat.subtitle }}
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Features Grid -->
          <v-row class="animate-slide-up mt-8" style="animation-delay: 0.8s;">
            <v-col cols="12" md="6" v-for="feature in features" :key="feature.title">
              <v-card
                class="feature-card pa-8"
                :style="{
                  background: featureCardBg,
                  border: '3px solid rgba(220, 38, 38, 0.3)',
                  boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)'
                }"
                elevation="0"
              >
                <div class="text-center mb-6">
                  <v-avatar
                    size="80"
                    class="mb-4 icon-avatar"
                    style="background-color: rgba(220, 38, 38, 0.2);"
                  >
                    <v-icon size="48" color="red">{{ feature.icon }}</v-icon>
                  </v-avatar>
                  <h3 class="text-h5 font-weight-bold mb-2" :class="isDark ? 'text-white' : 'text-black'">
                    {{ feature.title }}
                  </h3>
                  <v-divider 
                    class="mx-auto" 
                    style="max-width: 64px; height: 4px; background: linear-gradient(90deg, rgb(239 68 68), transparent);"
                  ></v-divider>
                </div>
                <v-list bg-color="transparent">
                  <v-list-item
                    v-for="(item, idx) in feature.items"
                    :key="idx"
                    class="feature-list-item px-5"
                  >
                    <template v-slot:prepend>
                      <span class="text-red text-h6 mr-3">✓</span>
                    </template>
                    <v-list-item-title :class="isDark ? 'text-white' : 'text-black'">
                      {{ item }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>

          <!-- How it works section -->
          <v-row class="text-center mt-16 animate-fade-in" style="animation-delay: 1s;">
            <v-col cols="12">
              <h2 class="text-h3 text-sm-h2 font-weight-bold mb-12">¿Cómo Funciona?</h2>
            </v-col>
            <v-col cols="12" md="4" v-for="step in steps" :key="step.number">
              <v-card
                class="step-card pa-6"
                :style="{
                  background: cardBg,
                  border: '2px solid rgba(220, 38, 38, 0.3)',
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.2)'
                }"
                elevation="0"
              >
                <v-avatar
                  size="64"
                  class="mx-auto mb-4 step-number"
                  :style="{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'
                      : 'linear-gradient(135deg, rgb(220 38 38), rgb(185 28 28))',
                    border: isDark
                      ? '1px solid rgba(255,255,255,0.06)'
                      : 'none',
                    boxShadow: isDark
                      ? '0 6px 18px rgba(0,0,0,0.6), 0 0 10px rgba(185,28,28,0.08)'
                      : '0 0 20px rgba(220, 38, 38, 0.5)'
                  }"
                >
                  <span class="text-h5 font-weight-bold" :class="isDark ? 'text-white' : 'text-white'">
                    {{ step.number }}
                  </span>
                </v-avatar>
                <h3 class="text-h6 font-weight-semibold mb-3" :class="isDark ? 'text-white' : 'text-red'">
                  {{ step.title }}
                </h3>
                <p :class="isDark ? 'text-white' : 'text-black'">
                  {{ step.description }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>

    <!-- Footer -->
    <Footer companyName="GarageConnect" class="mt-16" />
  </v-app>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-animation {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.gradient-text {
  background: linear-gradient(90deg, rgb(239 68 68), rgb(248 113 113), rgb(239 68 68));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pulse-dot {
  position: relative;
  display: inline-flex;
  width: 12px;
  height: 12px;
}

.pulse-dot::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(239 68 68);
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.pulse-dot::after {
  content: '';
  position: relative;
  display: inline-flex;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgb(239 68 68);
}

.bg-decoration {
  top: 25%;
  left: 25%;
  width: 256px;
  height: 256px;
  background-color: rgb(220 38 38);
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(60px);
  animation: pulse-animation 3s ease-in-out infinite;
}

.bg-decoration-delayed {
  bottom: 25%;
  right: 25%;
  width: 384px;
  height: 384px;
  background-color: rgb(185 28 28);
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(60px);
  animation: pulse-animation 3s ease-in-out infinite;
  animation-delay: 1s;
}

.cta-button {
  background: linear-gradient(90deg, rgb(220 38 38), rgb(185 28 28)) !important;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.stat-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.stat-card:hover {
  transform: scale(1.05);
}

.feature-card {
  transition: all 0.5s ease;
  border-radius: 16px;
}

.feature-card:hover {
  transform: scale(1.05);
}

.icon-avatar {
  transition: all 0.3s ease;
}

.feature-card:hover .icon-avatar {
  transform: scale(1.1) rotate(3deg);
}

.feature-list-item {
  transition: all 0.2s ease;
}

.feature-list-item:hover {
  transform: translateX(8px);
}

.feature-list-item:hover .text-red {
  transform: scale(1.25);
}

.step-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.step-card:hover {
  transform: scale(1.05);
}

.step-number {
  transition: all 0.3s ease;
}

html {
  scroll-behavior: smooth;
}
</style>
