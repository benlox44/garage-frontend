<script setup lang="ts">
  import { ref } from 'vue'
  import { useTheme } from '@/composables/useTheme'
  import HeaderClient from '@/components/clientView/headerClient.vue'
  import ScheduleCalendar from '@/components/clientView/SheduleCalendar.vue'
  import MyAppointments from '@/components/clientView/MyAppointments.vue'
  import Orders from '@/components/clientView/Orders.vue'
  import Profile from '@/components/clientView/Profile.vue'
  import MyVehicles from './MyVehicles.vue'

  const { isDark } = useTheme()
  const currentSection = ref<'home' | 'orders' | 'appointments' | 'vehicles' | 'profile'>('home')
  const activeTab = ref<'calendar' | 'appointments'>('calendar')

  const handleNavigation = (section: 'orders' | 'appointments' | 'vehicles' | 'profile') => {
    currentSection.value = section
  }
</script>

<template>
  <div class="user-view" :class="{ 'dark-mode': isDark }">
    <HeaderClient @navigate="handleNavigation" />
    
    <div class="container">
      <!-- Home / Default View -->
      <div v-if="currentSection === 'home'" class="welcome-section">
        <div class="welcome-card">
          <h1 class="welcome-title">¡Bienvenido a GarageConnect!</h1>
          <p class="welcome-text">Gestiona tus citas y servicios de manera fácil y rápida</p>
          
          <div class="quick-actions">
            <button @click="currentSection = 'appointments'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-calendar-clock</v-icon>
              <h3>Agendar Cita</h3>
              <p>Reserva tu próxima visita al taller</p>
            </button>
            
            <button @click="currentSection = 'orders'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-file-document</v-icon>
              <h3>Ver Órdenes</h3>
              <p>Revisa el estado de tus servicios</p>
            </button>

            <button @click="currentSection = 'vehicles'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-car</v-icon>
              <h3>Mis Vehículos</h3>
              <p>Gestiona tus vehículos registrados</p>
            </button>
            
            <button @click="currentSection = 'profile'" class="action-card">
              <v-icon size="48" color="#D90000">mdi-account</v-icon>
              <h3>Mi Perfil</h3>
              <p>Actualiza tu información</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Section -->
      <div v-else-if="currentSection === 'orders'" class="section-content">
        <Orders />
      </div>

      <!-- Vehicles Section -->
      <div v-else-if="currentSection === 'vehicles'" class="section-content">
        <MyVehicles />
      </div>

      <!-- Appointments Section -->
      <div v-else-if="currentSection === 'appointments'" class="section-content">
        <!-- Navigation Tabs -->
        <div class="tabs">
          <button 
            @click="activeTab = 'calendar'" 
            :class="{ active: activeTab === 'calendar' }"
            class="tab-button"
          >
            📅 Agendar Cita
          </button>
          <button 
            @click="activeTab = 'appointments'" 
            :class="{ active: activeTab === 'appointments' }"
            class="tab-button"
          >
            📋 Mis Citas
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <ScheduleCalendar v-if="activeTab === 'calendar'" />
          <MyAppointments v-if="activeTab === 'appointments'" />
        </div>
      </div>

      <!-- Profile Section -->
      <div v-else-if="currentSection === 'profile'" class="section-content">
        <Profile />
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  transition: background 0.3s;
}

.user-view.dark-mode {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.welcome-card {
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  color: #e02626;
  margin-bottom: 1rem;
  animation: fadeInUp 0.6s ease-out;
}

.dark-mode .welcome-title {
  color: #b11212;
}

.welcome-text {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out;
}

.dark-mode .welcome-text {
  color: #9ca3af;
}

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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(217, 0, 0, 0.3); /* Cambiado a rojo */
  border-color: #D90000; /* Cambiado a rojo */
}

.dark-mode .action-card {
  background: #2d2d2d;
  border-color: #374151;
}

.dark-mode .action-card:hover {
  background: #333;
  border-color: #D90000; /* Cambiado a rojo */
  box-shadow: 0 8px 24px rgba(217, 0, 0, 0.3); /* Cambiado a rojo */
}

.action-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ac1c1c;
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
}

/* Placeholder Section */
.placeholder-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 1rem;
}

.placeholder-section h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #D90000;
  margin-top: 1rem;
}

.dark-mode .placeholder-section h2 {
  color: #D90000;
}

.placeholder-section p {
  font-size: 1.2rem;
  color: #666;
}

.dark-mode .placeholder-section p {
  color: #9ca3af;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  position: relative;
  top: 2px;
}

.tab-button:hover {
  color: #af3a3a;
}

.tab-button.active {
  color: #7a2b2b;
  border-bottom-color: #af3a3a;
  background: rgba(175, 58, 58, 0.315);
}

.dark-mode .tab-button {
  color: #af9c9c;
}

.dark-mode .tab-button.active {
  color: #af3a3a;
  background: rgba(148, 18, 18, 0.226);
}

.dark-mode .tabs {
  border-bottom-color: #374151;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

/* Animations */
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

/* Responsive */
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

  .tabs {
    flex-direction: column;
    gap: 0;
  }

  .tab-button {
    border-bottom: 1px solid #e5e7eb;
    border-left: 3px solid transparent;
  }

  .tab-button.active {
    border-bottom-color: #e5e7eb;
    border-left-color: #3AAFA9;
  }
}
</style>
