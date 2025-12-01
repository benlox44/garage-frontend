<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

interface Schedule {
  id: number
  date: string
  availableHours: string[]
}

const schedules = ref<Schedule[]>([])
const loading = ref(true)
const showCreateModal = ref(false)

// Form data
const newDate = ref('')
const selectedHours = ref<string[]>([])

// Modal config
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const availableTimeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

const loadSchedules = async () => {
  loading.value = true
  try {
    const data = await api.getMySchedules()
    schedules.value = data || []
  } catch (error) {
    console.error('Error loading schedules:', error)
    showModalMessage('Error', 'No se pudieron cargar los horarios.', 'error')
  } finally {
    loading.value = false
  }
}

const toggleHour = (hour: string) => {
  if (selectedHours.value.includes(hour)) {
    selectedHours.value = selectedHours.value.filter((h) => h !== hour)
  } else {
    selectedHours.value.push(hour)
  }
  selectedHours.value.sort()
}

const openCreateModal = () => {
  newDate.value = ''
  selectedHours.value = []
  showCreateModal.value = true
}

const createSchedule = async () => {
  if (!newDate.value || selectedHours.value.length === 0) return

  try {
    const success = await api.createSchedule({
      date: newDate.value,
      availableHours: selectedHours.value,
    })

    if (success) {
      showModalMessage('Éxito', 'Horario creado correctamente.', 'success')
      showCreateModal.value = false
      await loadSchedules()
    } else {
      showModalMessage(
        'Error',
        'No se pudo crear el horario. Verifica que no exista ya para esa fecha.',
        'error',
      )
    }
  } catch (error) {
    showModalMessage('Error', 'Error al crear el horario.', 'error')
  }
}

const confirmDelete = (scheduleId: number) => {
  modalConfig.value = {
    title: 'Eliminar Horario',
    message:
      '¿Estás seguro de que deseas eliminar este día de tu agenda? Se cancelarán las citas pendientes.',
    type: 'warning',
    showCancel: true,
    action: async () => {
      const success = await api.deleteSchedule(scheduleId)
      if (success) {
        showModalMessage('Eliminado', 'Horario eliminado correctamente.', 'success')
        await loadSchedules()
      } else {
        showModalMessage('Error', 'No se pudo eliminar el horario.', 'error')
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

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  loadSchedules()
})
</script>

<template>
  <div class="mechanic-schedule" :class="{ 'dark-theme': isDark }">
    <div class="header">
      <h2>Mi Agenda</h2>
      <button @click="openCreateModal" class="add-btn">
        <v-icon>mdi-plus</v-icon> Agregar Disponibilidad
      </button>
    </div>

    <div v-if="loading" class="loading">
      <v-progress-circular indeterminate color="#D90000"></v-progress-circular>
      <p>Cargando agenda...</p>
    </div>

    <div v-else-if="schedules.length === 0" class="no-data">
      <v-icon size="64" color="#ccc">mdi-calendar-blank</v-icon>
      <p>No tienes horarios configurados.</p>
      <button @click="openCreateModal" class="link-btn">Configurar ahora</button>
    </div>

    <div v-else class="schedules-list">
      <div v-for="schedule in schedules" :key="schedule.id" class="schedule-card">
        <div class="card-header">
          <span class="date">{{ formatDate(schedule.date) }}</span>
          <button @click="confirmDelete(schedule.id)" class="delete-btn" title="Eliminar día">
            <v-icon>mdi-delete</v-icon>
          </button>
        </div>
        <div class="hours-list">
          <span v-for="hour in schedule.availableHours" :key="hour" class="hour-badge">
            {{ hour }}
          </span>
        </div>
      </div>
    </div>

    <!-- Create Schedule Modal (Custom Overlay) -->
    <div v-if="showCreateModal" class="overlay">
      <div class="modal-card">
        <h3>Agregar Disponibilidad</h3>

        <div class="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            v-model="newDate"
            class="form-input"
            :min="new Date().toISOString().split('T')[0]"
          />
        </div>

        <div class="form-group">
          <label>Horas Disponibles:</label>
          <div class="hours-selector">
            <button
              v-for="hour in availableTimeSlots"
              :key="hour"
              @click="toggleHour(hour)"
              class="hour-toggle"
              :class="{ active: selectedHours.includes(hour) }"
            >
              {{ hour }}
            </button>
          </div>
        </div>

        <div class="actions">
          <button @click="showCreateModal = false" class="cancel-btn">Cancelar</button>
          <button
            @click="createSchedule"
            class="save-btn"
            :disabled="!newDate || selectedHours.length === 0"
          >
            Guardar
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
.mechanic-schedule {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  color: #2c3e50;
  transition: background-color 0.3s, color 0.3s;
}

.mechanic-schedule.dark-theme {
  background: transparent !important;
  background-color: transparent !important;
  color: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.mechanic-schedule.dark-theme .header h2 {
  color: #ffffff;
}

.add-btn {
  background: #d90000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  background: #b30000;
}

.loading,
.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.mechanic-schedule.dark-theme .loading,
.mechanic-schedule.dark-theme .no-data {
  color: #aaa;
}

.link-btn {
  background: none;
  border: none;
  color: #d90000;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
}

.schedules-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.schedule-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.mechanic-schedule.dark-theme .schedule-card {
  background: #1a1a1a;
  border: 1px solid #333;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.mechanic-schedule.dark-theme .card-header {
  border-bottom: 1px solid #333;
}

.date {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1em;
}

.mechanic-schedule.dark-theme .date {
  color: #ffffff;
}

.delete-btn {
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
}

.delete-btn:hover {
  color: #e74c3c;
}

.hours-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hour-badge {
  background: #f1f2f6;
  color: #2c3e50;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.9em;
}

.mechanic-schedule.dark-theme .hour-badge {
  background: #333;
  color: #ffffff;
}

/* Overlay & Modal Styles */
.overlay {
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

.modal-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.mechanic-schedule.dark-theme .modal-card {
  background: #1a1a1a;
  border: 1px solid #333;
}

.modal-card h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 20px;
}

.mechanic-schedule.dark-theme .modal-card h3 {
  color: #ffffff;
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

.mechanic-schedule.dark-theme .form-group label {
  color: #ffffff;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.mechanic-schedule.dark-theme .form-input {
  background: #333;
  color: #ffffff;
  border: 1px solid #555;
}

.hours-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
}

.hour-toggle {
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mechanic-schedule.dark-theme .hour-toggle {
  background: #333;
  color: #ffffff;
  border: 1px solid #555;
}

.hour-toggle:hover {
  border-color: #d90000;
}

.hour-toggle.active {
  background: #d90000;
  color: white;
  border-color: #d90000;
}

.mechanic-schedule.dark-theme .hour-toggle.active {
  background: #d90000;
  color: white;
  border-color: #d90000;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
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

.mechanic-schedule.dark-theme .cancel-btn {
  background: #333;
  color: #ffffff;
}

.save-btn {
  padding: 10px 20px;
  border: none;
  background: #d90000;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn:disabled {
  background: #ffcccc;
  cursor: not-allowed;
}

.mechanic-schedule.dark-theme .save-btn:disabled {
  background: #550000;
  color: #aaa;
}
</style>
