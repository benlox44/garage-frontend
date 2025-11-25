<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import HeaderMechanic from '@/components/mechanicView/HeaderMechanic.vue'
import MechanicAppointments from './MechanicAppointments.vue'
import MechanicOrders from './MechanicOrders.vue'
import MechanicSchedule from './MechanicSchedule.vue'
import Profile from '@/components/clientView/Profile.vue' // Reusing Profile component

const { isDark } = useTheme()
const currentSection = ref<'home' | 'orders' | 'appointments' | 'schedule' | 'profile'>('home')

const handleNavigation = (section: 'orders' | 'appointments' | 'schedule' | 'profile') => {
  currentSection.value = section
}
</script>

<template>
  <div class="mechanic-view" :class="{ 'dark-mode': isDark }">
    <HeaderMechanic @navigate="handleNavigation" />
    
    <div class="container">
      <!-- Home / Default View -->
      <div v-if="currentSection === 'home'" class="welcome-section">
        <div class="welcome-card">
          <h1 class="welcome-title">Panel de Mecánico</h1>
          <p class="welcome-text">Gestiona tus trabajos y citas asignadas</p>
          
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

      <!-- Orders Section -->
      <div v-else-if="currentSection === 'orders'" class="section-content">
        <MechanicOrders />
      </div>

      <!-- Appointments Section -->
      <div v-else-if="currentSection === 'appointments'" class="section-content">
        <MechanicAppointments />
      </div>

      <!-- Schedule Section -->
      <div v-else-if="currentSection === 'schedule'" class="section-content">
        <MechanicSchedule />
      </div>

      <!-- Profile Section -->
      <div v-else-if="currentSection === 'profile'" class="section-content">
        <Profile />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mechanic-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  transition: background 0.3s;
}

.mechanic-view.dark-mode {
  background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
  color: white;
}

.container {
  padding-top: 80px; /* Space for fixed header */
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.welcome-card {
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.welcome-title {
  font-size: 2.5em;
  color: #D90000;
  margin-bottom: 10px;
}

.welcome-text {
  font-size: 1.2em;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: none;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(217, 0, 0, 0.2);
}

.action-card h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2em;
}

.action-card p {
  margin: 0;
  color: #95a5a6;
  font-size: 0.9em;
}

.section-content {
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
