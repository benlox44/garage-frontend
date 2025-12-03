<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'
import { useRoute } from 'vue-router'
import type { Appointment } from '@/types/garage'

const { isDark } = useTheme()
const route = useRoute()

const appointments = ref<Appointment[]>([])
const showModal = ref(false)
const showRejectModal = ref(false)
const rejectionReason = ref('')
const selectedAppt = ref<Appointment | null>(null)

const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const loadAppointments = async () => {
  const data = await api.getMechanicAppointments()
  appointments.value = data
  checkDeepLink()
}

const checkDeepLink = async () => {
  const id = route.query.appointmentId
  if (id) {
    await nextTick()
    setTimeout(() => {
      const element = document.getElementById(`appt-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.classList.add('highlighted')
        setTimeout(() => element.classList.remove('highlighted'), 3000)
      }
    }, 500)
  }
}

const confirmAccept = (appt: Appointment) => {
  modalConfig.value = {
    title: 'Aceptar Cita',
    message: `¿Confirmar cita para ${appt.client?.name || 'Cliente'} el ${new Date(appt.date).toLocaleDateString()}?`,
    type: 'info',
    showCancel: true,
    action: async () => {
      const success = await api.acceptAppointment(appt.id)
      if (success) {
        await loadAppointments()
        showModal.value = false
      } else {
        // Handle error
      }
    },
  }
  showModal.value = true
}

const confirmReject = (appt: Appointment) => {
  selectedAppt.value = appt
  rejectionReason.value = ''
  showRejectModal.value = true
}

const handleReject = async () => {
  if (!selectedAppt.value) return
  if (!rejectionReason.value.trim()) {
    modalConfig.value = {
      title: 'Atención',
      message: 'Debe ingresar un motivo para rechazar la cita.',
      type: 'warning',
      showCancel: false,
      action: null,
    }
    showModal.value = true
    return
  }

  const success = await api.rejectAppointment(selectedAppt.value.id, rejectionReason.value)
  if (success) {
    await loadAppointments()
    showRejectModal.value = false
    modalConfig.value = {
      title: 'Éxito',
      message: 'Cita rechazada correctamente.',
      type: 'success',
      showCancel: false,
      action: null,
    }
    showModal.value = true
  } else {
    modalConfig.value = {
      title: 'Error',
      message: 'No se pudo rechazar la cita. Intente nuevamente.',
      type: 'error',
      showCancel: false,
      action: null,
    }
    showModal.value = true
  }
}

const handleConfirm = () => {
  if (modalConfig.value.action) {
    modalConfig.value.action()
  } else {
    showModal.value = false
  }
}

const formatStatus = (status: string) => {
  switch (status) {
    case 'PENDING':
    case 'pending':
      return 'Pendiente'
    case 'ACCEPTED':
    case 'accepted':
      return 'Aceptada'
    case 'REJECTED':
    case 'rejected':
      return 'Rechazada'
    default:
      return status
  }
}

onMounted(() => {
  loadAppointments()
})
</script>

<template>
  <div :class="{ 'dark-theme': isDark }">
    <h2 class="section-title">Gestión de Citas</h2>

    <div class="appointments-list">
      <div v-if="appointments.length === 0" class="no-data">No hay citas pendientes.</div>

      <div v-for="appt in appointments" :key="appt.id" :id="`appt-${appt.id}`" class="appt-card">
        <div class="appt-header">
          <v-row align="center" justify="space-between">
            <v-col cols="auto" md="auto">
              <span class="date">{{ new Date(appt.date).toLocaleDateString() }}</span>
            </v-col>
            <v-col cols="2" md="2">
              <span class="status" :class="appt.status.toLowerCase()">
                {{ formatStatus(appt.status) }}
              </span>
            </v-col>
          </v-row>
        </div>

        <div class="appt-body">
          <div class="client-info">
            <h4>Cliente</h4>
            <p>{{ appt.client?.name || 'N/A' }}</p>
            <p class="sub-text">{{ appt.client?.email || 'N/A' }}</p>
          </div>
          <div class="vehicle-info">
            <h4>Vehículo</h4>
            <p>{{ appt.vehicle?.brand }} {{ appt.vehicle?.model }}</p>
            <span class="plate">{{ appt.vehicle?.licensePlate }}</span>
          </div>
          <div class="service-info">
            <h4>Servicio</h4>
            <p>{{ appt.description }}</p>
          </div>
        </div>

        <div class="appt-actions" v-if="appt.status === 'pending'">
          <button @click="confirmReject(appt)" class="reject-btn">Rechazar</button>
          <button @click="confirmAccept(appt)" class="accept-btn">Aceptar</button>
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

    <Modal
      :show="showRejectModal"
      title="Rechazar Cita"
      type="warning"
      :show-cancel="true"
      @close="showRejectModal = false"
      @confirm="handleReject"
    >
      <template #body>
        <p>Ingrese el motivo del rechazo para {{ selectedAppt?.client?.name }}:</p>
        <textarea
          v-model="rejectionReason"
          class="reject-input"
          placeholder="Motivo..."
        ></textarea>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.reject-input {
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 80px;
  resize: vertical;
  color: #333;
}
.dark-theme .reject-input {
  background-color: #333;
  color: #fff;
  border-color: #555;
}

.status-select {
  max-width: 150px;
}
.mechanic-appointments {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.mechanic-appointments.dark-theme {
  background-color: #000000;
  color: #ffffff;
}

.section-title {
  margin-bottom: 20px;
  border-bottom: 2px solid #d90000;
  padding-bottom: 10px;
}

.no-data {
  text-align: center;
  font-size: 1.2em;
  margin-top: 40px;
  color: #666;
}

.dark-theme .no-data {
  color: #aaa;
}

.appt-card {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-theme .appt-card {
  background: #1a1a1a;
  border: 1px solid #333;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.05);
}

.appt-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.appt-card.highlighted {
  animation: highlight-pulse 2s ease-in-out;
  border: 2px solid #d90000;
  box-shadow: 0 0 15px rgba(217, 0, 0, 0.5);
}

@keyframes highlight-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.appt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.dark-theme .appt-header {
  border-bottom: 1px solid #333;
}

.date {
  font-weight: bold;
  font-size: 1.1em;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: bold;
  text-transform: uppercase;
}

.status.pending {
  background-color: #f1c40f;
  color: #000;
}
.status.accepted {
  background-color: #2ecc71;
  color: #fff;
}
.status.rejected {
  background-color: #e74c3c;
  color: #fff;
}

.appt-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 15px;
}

h4 {
  margin: 0 0 5px 0;
  color: #d90000;
  font-size: 0.9em;
  text-transform: uppercase;
}

.sub-text {
  font-size: 0.9em;
  color: #666;
}

.dark-theme .sub-text {
  color: #aaa;
}

.plate {
  display: inline-block;
  background: #eee;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  font-family: monospace;
  border: 1px solid #ccc;
}

.dark-theme .plate {
  background: #333;
  border: 1px solid #555;
  color: #fff;
}

.appt-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.dark-theme .appt-actions {
  border-top: 1px solid #333;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.accept-btn {
  background-color: #2ecc71;
  color: white;
}

.reject-btn {
  background-color: #e74c3c;
  color: white;
}
</style>
