<script setup lang="ts">
  import { ref } from 'vue'
  import { useTheme } from '@/composables/useTheme'
  import HeaderClient from '@/components/clientView/headerClient.vue'
  import ScheduleCalendar from '@/components/clientView/SheduleCalendar.vue'
  import MyAppointments from '@/components/clientView/MyAppointments.vue'

  const { isDark } = useTheme()
  const activeTab = ref<'calendar' | 'appointments'>('calendar')
</script>

<template>
  <div class="user-view" :class="{ 'dark-mode': isDark }">
    <HeaderClient />
    
    <div class="container">
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
  color: #3AAFA9;
}

.tab-button.active {
  color: #2B7A78;
  border-bottom-color: #3AAFA9;
  background: rgba(58, 175, 169, 0.05);
}

.dark-mode .tab-button {
  color: #9ca3af;
}

.dark-mode .tab-button.active {
  color: #3AAFA9;
  background: rgba(58, 175, 169, 0.1);
}

.dark-mode .tabs {
  border-bottom-color: #374151;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

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

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
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
