<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useRoute, useRouter } from 'vue-router'
import HeaderMechanic from '@/components/mechanicView/HeaderMechanic.vue'
import MechanicAppointments from './MechanicAppointments.vue'
import MechanicOrders from './MechanicOrders.vue'
import MechanicSchedule from './MechanicSchedule.vue'
import Profile from '@/components/clientView/Profile.vue' // Reusing Profile component
import NotificationsView from '@/views/viewsUser/NotificationsView.vue'

const { isDark } = useTheme()
const route = useRoute()
const router = useRouter()
const currentSection = ref<'home' | 'orders' | 'appointments' | 'schedule' | 'profile' | 'notifications'>('home')

// Watch for query param changes
watch(
  () => route.query.section,
  (newSection) => {
    if (
      newSection &&
      ['home', 'orders', 'appointments', 'schedule', 'profile', 'notifications'].includes(newSection as string)
    ) {
      currentSection.value = newSection as any
    }
  },
  { immediate: true },
)

const handleNavigation = (section: 'orders' | 'appointments' | 'schedule' | 'profile' | 'notifications') => {
  currentSection.value = section
  router.replace({ query: { ...route.query, section } })
}
</script>

<template>
  <div class="mechanic-view" :class="{ 'dark-mode': isDark }">
    <HeaderMechanic @navigate="handleNavigation" />

    <div class="container">
      <div v-if="currentSection === 'home'" class="welcome-section">
        <div class="welcome-card">
          <h1 class="welcome-title">Panel de Mecánico</h1>
          <p class="welcome-text">Bienvenido. Gestiona tus trabajos y citas asignadas</p>

          <div class="quick-actions">
            <button @click="currentSection = 'appointments'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-calendar-check</v-icon>
              <h3>Gestionar Citas</h3>
              <p>Acepta o rechaza solicitudes</p>
            </button>

            <button @click="currentSection = 'orders'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-wrench</v-icon>
              <h3>Órdenes de Trabajo</h3>
              <p>Administra reparaciones y servicios</p>
            </button>

            <button @click="currentSection = 'schedule'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-calendar-edit</v-icon>
              <h3>Mi Agenda</h3>
              <p>Gestiona tu disponibilidad</p>
            </button>

            <button @click="currentSection = 'profile'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-account-cog</v-icon>
              <h3>Mi Perfil</h3>
              <p>Configuración de cuenta</p>
            </button>
          </div>
        </div>
      </div>

      <div v-else :class="['section-content', { 'has-tabs': currentSection === 'appointments' }]">
        <MechanicOrders v-if="currentSection === 'orders'" />
        <MechanicAppointments v-else-if="currentSection === 'appointments'" />
        <MechanicSchedule v-else-if="currentSection === 'schedule'" />
        <Profile v-else-if="currentSection === 'profile'" />
        <NotificationsView v-else-if="currentSection === 'notifications'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ======================================================= */
/* ESTILOS DE FONDO Y ESTRUCTURA (COPIADOS DE HOMEUSER.VUE) */
/* ======================================================= */

.mechanic-view {
  min-height: 100vh;
  /* Fondo degradado de blanco/gris a negro/gris oscuro */
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  transition: background 0.3s;
}

.mechanic-view.dark-mode {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); /* Fondo oscuro */
}

.container {
  /* Alineación y padding general, asegura espacio para el header */
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 80px; /* Asegura espacio si el HeaderMechanic es fijo */
}

/* Welcome Section - Centro de la pantalla para la vista 'home' */
.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  /* Ajuste para centrar el contenido en el espacio disponible */
  min-height: calc(100vh - 120px);
}

.welcome-card {
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

/* Títulos y textos */
.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  color: #e02626; /* Rojo brillante */
  margin-bottom: 1rem;
  animation: fadeInUp 0.6s ease-out;
}

.dark-mode .welcome-title {
  color: #b11212; /* Rojo más apagado en modo oscuro */
}

.welcome-text {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out;
}

.dark-mode .welcome-text {
  color: #9ca3af; /* Gris claro para modo oscuro */
}

/* Estilos de las tarjetas de acción (quick-actions) */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  animation: fadeInUp 1s ease-out;
}

.action-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center; /* Asegura que el contenido esté centrado */
}

/* Efecto Hover: Elevación y Sombra Roja */
.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(217, 0, 0, 0.3);
  border-color: #d90000;
}

.dark-mode .action-card {
  background: #2d2d2d;
  border-color: #374151;
}

.dark-mode .action-card:hover {
  background: #333;
  border-color: #d90000;
  box-shadow: 0 8px 24px rgba(217, 0, 0, 0.3);
}

.action-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ac1c1c; /* Color de encabezado en la tarjeta */
  margin: 1rem 0 0.5rem;
}

.dark-mode .action-card h3 {
  color: #af3a3a;
}

.action-card p {
  color: #666;
  font-size: 1rem;
}

.dark-mode .action-card p {
  color: #af9c9c;
}

/* Section Content */
.section-content {
  animation: fadeIn 0.3s ease-in;
  /* Padding top para asegurar que no quede detrás del HeaderMechanic */
  padding-top: 1rem;
}

/* === ANIMATIONS (Mantenidas del componente original) === */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-text {
    font-size: 1.2rem;
  }

  .quick-actions {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
