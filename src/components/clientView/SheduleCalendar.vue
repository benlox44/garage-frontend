<template>
  <div class="schedule-calendar">
    <h2>📅 Horarios Disponibles</h2>
    
    <div v-if="loading">Cargando horarios...</div>
    
    <div v-else-if="schedules.length === 0">
      No hay horarios disponibles
    </div>
    
    <div v-else class="schedules-grid">
      <div 
        v-for="schedule in schedules" 
        :key="schedule.id"
        class="schedule-card"
      >
        <div class="mechanic-info">
          <strong>{{ schedule.mechanic.name }}</strong>
        </div>
        <div class="date">📆 {{ formatDate(schedule.date) }}</div>
        
        <div class="hours-grid">
          <button
            v-for="hour in schedule.availableHours"
            :key="hour"
            @click="selectSlot(schedule, hour)"
            class="hour-button"
            :class="{ 'selected': isSelected(schedule.id, hour) }"
          >
            🕐 {{ hour }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar cita -->
    <div v-if="selectedSlot" class="modal">
      <div class="modal-content">
        <h3>Confirmar Cita</h3>
        <p>Mecánico: {{ selectedSlot.mechanicName }}</p>
        <p>Fecha: {{ formatDate(selectedSlot.date) }}</p>
        <p>Hora: {{ selectedSlot.hour }}</p>
        
        <label>
          Vehículo:
          <select v-model="selectedVehicleId">
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.licensePlate }} - {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
        </label>

        <label>
          Descripción del servicio:
          <textarea v-model="description" placeholder="Ej: Revisión de frenos, cambio de aceite..."></textarea>
        </label>

        <button @click="confirmAppointment" :disabled="!selectedVehicleId">
          ✅ Confirmar
        </button>
        <button @click="selectedSlot = null">❌ Cancelar</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'

interface Mechanic {
  id: number
  name: string
}

interface Schedule {
  id: number
  mechanicId: number
  date: string
  availableHours: string[]
  mechanic: Mechanic
}

interface Vehicle {
  id: number
  licensePlate: string
  brand: string
  model: string
  year: number
  color: string
}

interface SelectedSlot {
  scheduleId: number
  mechanicId: number
  mechanicName: string
  date: string
  hour: string
}

const schedules = ref<Schedule[]>([])
const loading = ref(true)
const selectedSlot = ref<SelectedSlot | null>(null)
const selectedVehicleId = ref<number | null>(null)
const description = ref('')
const vehicles = ref<Vehicle[]>([])

onMounted(async () => {
  try {
    // Cargar horarios disponibles
    const schedulesData = await api.getAvailableSchedules()
    schedules.value = schedulesData.data
    
    // Cargar vehículos del cliente
    const vehiclesData = await api.getMyVehicles()
    vehicles.value = vehiclesData.data
  } catch (error) {
    console.error('Error cargando horarios:', error)
  } finally {
    loading.value = false
  }
})

const selectSlot = (schedule: any, hour: string) => {
  selectedSlot.value = {
    scheduleId: schedule.id,
    mechanicId: schedule.mechanicId,
    mechanicName: schedule.mechanic.name,
    date: schedule.date,
    hour: hour
  }
}

const isSelected = (scheduleId: number, hour: string) => {
  return selectedSlot.value?.scheduleId === scheduleId && selectedSlot.value?.hour === hour
}

const confirmAppointment = async () => {
  if (!selectedSlot.value || !selectedVehicleId.value) return

  try {
    await api.createAppointment({
      mechanicId: selectedSlot.value.mechanicId,
      vehicleId: selectedVehicleId.value,
      scheduleId: selectedSlot.value.scheduleId,
      date: selectedSlot.value.date,
      hour: selectedSlot.value.hour,
      description: description.value
    })

    alert('✅ Cita agendada! Esperando confirmación del mecánico.')
    selectedSlot.value = null
    description.value = ''
    selectedVehicleId.value = null
    
    // Recargar horarios (la hora seleccionada ya no estará disponible)
    const schedulesData = await api.getAvailableSchedules()
    schedules.value = schedulesData.data
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al agendar la cita'
    alert(`❌ ${errorMessage}`)
    console.error(error)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.my-appointments {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.my-appointments h2 {
  margin-bottom: 1.5rem;
  color: #2B7A78;
}

.my-appointments button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: #3AAFA9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.my-appointments button:hover {
  background: #2B7A78;
}

.schedules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.schedule-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.mechanic-info {
  font-size: 1.1rem;
  color: #2B7A78;
  margin-bottom: 0.5rem;
}

.date {
  color: #666;
  margin-bottom: 1rem;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.hour-button {
  padding: 0.5rem;
  border: 1px solid #3AAFA9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.hour-button:hover {
  background: #3AAFA9;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(58, 175, 169, 0.3);
}

.hour-button.selected {
  background: #2B7A78;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.modal-content h3 {
  margin-top: 0;
  color: #2B7A78;
  margin-bottom: 1.5rem;
}

.modal-content p {
  margin: 0.5rem 0;
  color: #666;
}

.modal-content label {
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.modal-content select,
.modal-content textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  margin-bottom: 1rem;
}

.modal-content textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-content button {
  margin-top: 1rem;
  margin-right: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.modal-content button:first-of-type {
  background: #3AAFA9;
  color: white;
}

.modal-content button:first-of-type:hover:not(:disabled) {
  background: #2B7A78;
}

.modal-content button:first-of-type:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.modal-content button:last-of-type {
  background: #EF4444;
  color: white;
}

.modal-content button:last-of-type:hover {
  background: #DC2626;
}
</style>