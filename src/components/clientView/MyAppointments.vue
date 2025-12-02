<template>
  <div class="my-appointments">
    <h2>Mis Citas</h2>

    <button @click="refreshAppointments">Actualizar</button>

    <div v-if="loading">Cargando citas...</div>

    <div v-else-if="appointments.length === 0">No tienes citas agendadas</div>

    <div v-else class="appointments-list">
      <div
        v-for="appointment in appointments"
        :key="appointment.id"
        :id="`appointment-${appointment.id}`"
        class="appointment-card"
        :class="getStatusClass(appointment.status)"
      >
        <div class="status-badge">
          {{ getStatusText(appointment.status) }}
        </div>

        <div class="appointment-details">
          <p><strong>Fecha:</strong> {{ formatDate(appointment.date) }}</p>
          <p><strong>Hora:</strong> {{ appointment.time || 'No especificada' }}</p>
          <p><strong>Mecánico:</strong> {{ appointment.mechanic?.name || 'Asignando...' }}</p>
          <p>
            <strong>Vehículo:</strong> {{ appointment.vehicle?.licensePlate }} -
            {{ appointment.vehicle?.brand }}
          </p>
          <p><strong>Servicio:</strong> {{ appointment.description || 'No especificado' }}</p>

          <!-- Mostrar razón de rechazo si aplica -->
          <div
            v-if="appointment.status === 'rejected' && appointment.rejectionReason"
            class="rejection-reason"
          >
            <strong>Razón del rechazo:</strong>
            <p>{{ appointment.rejectionReason }}</p>
          </div>
        </div>

        <div class="appointment-actions">
          <button
            v-if="appointment.status === 'pending' || appointment.status === 'accepted'"
            @click="cancelAppointment(appointment.id)"
            class="btn-cancel"
          >
            Cancelar Cita
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useRoute } from 'vue-router'
import type { Appointment } from '@/types/garage'

const appointments = ref<Appointment[]>([])
const loading = ref(true)
const route = useRoute()
let pollInterval: number | null = null

onMounted(async () => {
  await loadAppointments()
  checkDeepLink()

  // Polling cada 30 segundos para ver cambios de estado
  pollInterval = setInterval(async () => {
    await loadAppointments()
  }, 30000)
})

const checkDeepLink = async () => {
  const id = route.query.appointmentId
  if (id) {
    await nextTick()
    // Pequeño delay para asegurar renderizado
    setTimeout(() => {
      const element = document.getElementById(`appointment-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.classList.add('highlighted')
        setTimeout(() => element.classList.remove('highlighted'), 3000)
      }
    }, 500)
  }
}

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

const loadAppointments = async () => {
  try {
    const { data } = await api.getMyAppointments()
    appointments.value = data
  } catch (error) {
    console.error('Error cargando citas:', error)
  } finally {
    loading.value = false
  }
}

const refreshAppointments = async () => {
  loading.value = true
  await loadAppointments()
}

const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const handleConfirm = () => {
  if (modalConfig.value.action) {
    modalConfig.value.action()
  } else {
    showModal.value = false
  }
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

const cancelAppointment = async (id: number) => {
  modalConfig.value = {
    title: 'Cancelar Cita',
    message: '¿Estás seguro de cancelar esta cita?',
    type: 'warning',
    showCancel: true,
    action: async () => {
      try {
        const result = await api.cancelAppointment(id)
        if (result.success) {
          showModalMessage('Éxito', 'Cita cancelada exitosamente', 'success')
          await loadAppointments()
        } else {
          showModalMessage('Error', result.message, 'error')
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Error al cancelar la cita'
        showModalMessage('Error', errorMessage, 'error')
        console.error(error)
      }
    },
  }
  showModal.value = true
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: '🟡 Pendiente',
    accepted: '✅ Confirmada',
    rejected: '❌ Rechazada',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  return `status-${status}`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
  color: #2b7a78;
}

.my-appointments > button {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #c20808;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.my-appointments > button:hover {
  background: #2b7a78;
  transform: translateY(-2px);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.appointment-card.highlighted {
  animation: highlight-pulse 2s ease-in-out;
  border: 2px solid #2b7a78;
  box-shadow: 0 0 15px rgba(43, 122, 120, 0.5);
}

@keyframes highlight-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.appointment-card.status-pending {
  border-color: #ffa500;
  background: #fff9e6;
}

.appointment-card.status-accepted {
  border-color: #10b981;
  background: #ecfdf5;
}

.appointment-card.status-rejected {
  border-color: #ef4444;
  background: #fef2f2;
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #000000;
}

.appointment-details {
  margin-right: 150px;
}

.appointment-details p {
  margin: 0.5rem 0;
  color: #333;
}

.rejection-reason {
  margin-top: 1rem;
  padding: 1rem;
  background: #fee2e2;
  border-left: 4px solid #ef4444;
  border-radius: 4px;
}

.rejection-reason strong {
  color: #dc2626;
}

.appointment-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-cancel {
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #dc2626;
  transform: translateY(-2px);
}
</style>
