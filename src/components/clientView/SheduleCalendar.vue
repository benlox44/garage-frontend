<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'
const { isDark } = useTheme()

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
const vehicles = ref<Vehicle[]>([])
const loading = ref(true)
const selectedSlot = ref<SelectedSlot | null>(null)
const selectedVehicleId = ref<number | null>(null)
const description = ref('')

const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const loadData = async () => {
  loading.value = true
  const [schedulesData, vehiclesData] = await Promise.all([
    api.getAvailableSchedules(),
    api.getMyVehicles(),
  ])

  schedules.value = schedulesData.data || []
  vehicles.value = vehiclesData.data || []
  loading.value = false
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const selectSlot = (schedule: Schedule, hour: string) => {
  selectedSlot.value = {
    scheduleId: schedule.id,
    mechanicId: schedule.mechanicId,
    mechanicName: schedule.mechanic.name,
    date: schedule.date,
    hour: hour,
  }
  // Reset form
  selectedVehicleId.value = null
  description.value = ''
}

const isSelected = (scheduleId: number, hour: string) => {
  return selectedSlot.value?.scheduleId === scheduleId && selectedSlot.value?.hour === hour
}

const confirmAppointment = async () => {
  if (!selectedSlot.value || !selectedVehicleId.value) return

  modalConfig.value = {
    title: 'Confirmar Cita',
    message: `¿Agendar cita con ${selectedSlot.value.mechanicName} el ${formatDate(selectedSlot.value.date)} a las ${selectedSlot.value.hour}?`,
    type: 'info',
    showCancel: true,
    action: async () => {
      const result = await api.createAppointment({
        mechanicId: selectedSlot.value!.mechanicId,
        vehicleId: selectedVehicleId.value!,
        scheduleId: selectedSlot.value!.scheduleId,
        hour: selectedSlot.value!.hour,
        date: selectedSlot.value!.date,
        description: description.value,
      })

      if (result.success) {
        showModalMessage(
          'Éxito',
          'Cita agendada correctamente. Espera la confirmación del mecánico.',
          'success',
        )
        selectedSlot.value = null
        await loadData() // Refresh availability
      } else {
        showModalMessage('Error', result.message, 'error')
      }
    },
  }
  showModal.value = true
}

const showModalMessage = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
) => {
  modalConfig.value = {
    title,
    message,
    type,
    showCancel: false,
    action: null,
  }
  showModal.value = true
}

const handleConfirm = () => {
  if (modalConfig.value.action) {
    modalConfig.value.action()
  } else {
    showModal.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="schedule-calendar">
    <h2>Horarios Disponibles</h2>

    <div v-if="loading" class="loading">
      <v-progress-circular indeterminate color="#D90000"></v-progress-circular>
      <p>Cargando horarios...</p>
    </div>

    <div v-else-if="schedules.length === 0" class="no-data">
      <v-icon size="64" color="#ccc">mdi-calendar-remove</v-icon>
      <p>No hay horarios disponibles en este momento.</p>
    </div>

    <div v-else class="schedules-grid">
      <div v-for="schedule in schedules" :key="schedule.id" class="schedule-card">
        <div class="mechanic-info">
          <v-icon color="#D90000">mdi-account-wrench</v-icon>
          <strong>{{ schedule.mechanic.name }}</strong>
        </div>
        <div class="date">{{ formatDate(schedule.date) }}</div>

        <div class="hours-grid">
          <button
            v-for="hour in schedule.availableHours"
            :key="hour"
            @click="selectSlot(schedule, hour)"
            class="hour-button"
            :class="{ selected: isSelected(schedule.id, hour) }"
          >
            {{ hour }}
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Form Section (replaces modal for better UX on mobile) -->
    <div v-if="selectedSlot" class="booking-form-overlay">
      <div class="booking-form">
        <div class="form-header">
          <h3>Confirmar Cita</h3>
          <button @click="selectedSlot = null" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </button>
        </div>

        <div class="summary">
          <p><strong>Mecánico:</strong> {{ selectedSlot.mechanicName }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(selectedSlot.date) }}</p>
          <p><strong>Hora:</strong> {{ selectedSlot.hour }}</p>
        </div>

        <div class="form-group">
          <label>Selecciona tu Vehículo:</label>
          <select v-model="selectedVehicleId" class="form-select" :class="{ 'dark-theme': isDark }">
            <option :value="null" disabled>-- Seleccionar --</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.licensePlate }} - {{ vehicle.brand }} {{ vehicle.model }}
            </option>
          </select>
          <p v-if="vehicles.length === 0" class="error-text">
            No tienes vehículos registrados. Por favor registra uno primero.
          </p>
        </div>

        <div class="form-group" :class="{ 'dark-theme': isDark }">
          <label>Descripción del servicio (Opcional):</label>
          <textarea
            v-model="description"
            placeholder="Ej: Revisión de frenos, cambio de aceite..."
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-actions">
          <button @click="selectedSlot = null" class="cancel-btn">Cancelar</button>
          <button @click="confirmAppointment" class="confirm-btn" :disabled="!selectedVehicleId">
            Agendar Cita
          </button>
        </div>
      </div>
    </div>

    <Modal
      :show="showModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :type="modalConfig.type"
      :show-cancel="modalConfig.showCancel"
      @close="showModal = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.schedule-calendar {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.loading,
.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.schedules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.schedule-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.schedule-card:hover {
  transform: translateY(-2px);
}

.mechanic-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1em;
  margin-bottom: 10px;
  color: #2c3e50;
}

.date {
  color: #7f8c8d;
  margin-bottom: 15px;
  font-weight: 500;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
}

.hour-button {
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  color: #2c3e50;
}

.hour-button:hover {
  border-color: #d90000;
  color: #d90000;
}

.hour-button.selected {
  background-color: #d90000;
  color: white;
  border-color: #d90000;
}

/* Booking Form Overlay */
.booking-form-overlay {
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
  padding: 20px;
}

.booking-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
}

.summary {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary p {
  margin: 5px 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}
.dark-theme {
  color: #333;
}

.error-text {
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 10px 20px;
  border: none;
  background: #f1f1f1;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.confirm-btn {
  padding: 10px 20px;
  border: none;
  background: #d90000;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.confirm-btn:disabled {
  background: #ffcccc;
  cursor: not-allowed;
}
</style>
