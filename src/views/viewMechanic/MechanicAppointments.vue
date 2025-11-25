<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'
const { isDark } = useTheme()

interface Appointment {
  id: number
  date: string
  time: string
  status: string
  serviceType: string
  client: {
    name: string
    email: string
  }
  vehicle: {
    brand: string
    model: string
    plate: string
  }
}

const appointments = ref<Appointment[]>([])
const showModal = ref(false)
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
}

const confirmAccept = (appt: Appointment) => {
  modalConfig.value = {
    title: 'Aceptar Cita',
    message: `¿Confirmar cita para ${appt.client.name} el ${new Date(appt.date).toLocaleDateString()}?`,
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
  // For simplicity, using a prompt for reason, ideally a custom modal with input
  const reason = prompt('Ingrese motivo de rechazo:')
  if (!reason) return

  modalConfig.value = {
    title: 'Rechazar Cita',
    message: `¿Rechazar cita de ${appt.client.name}?`,
    type: 'warning',
    showCancel: true,
    action: async () => {
      const success = await api.rejectAppointment(appt.id, reason)
      if (success) {
        await loadAppointments()
        showModal.value = false
      }
    },
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
  loadAppointments()
})
</script>

<template>
  <div class="mechanic-appointments">
    <h2 class="section-title" :class="{ 'dark-text': isDark }">Gestión de Citas</h2>

    <div class="appointments-list">
      <div v-if="appointments.length === 0" class="no-data" :class="{ 'dark-text': isDark }">
        No hay citas pendientes.
      </div>

      <div v-for="appt in appointments" :key="appt.id" class="appt-card">
        <div class="appt-header">
          <span class="date">{{ new Date(appt.date).toLocaleDateString() }} - {{ appt.time }}</span>
          <span class="status" :class="appt.status.toLowerCase()">{{ appt.status }}</span>
        </div>

        <div class="appt-body">
          <div class="client-info">
            <h4>Cliente</h4>
            <p>{{ appt.client.name }}</p>
            <p class="sub-text">{{ appt.client.email }}</p>
          </div>
          <div class="vehicle-info">
            <h4>Vehículo</h4>
            <p>{{ appt.vehicle.brand }} {{ appt.vehicle.model }}</p>
            <span class="plate">{{ appt.vehicle.plate }}</span>
          </div>
          <div class="service-info">
            <h4>Servicio</h4>
            <p>{{ appt.serviceType }}</p>
          </div>
        </div>

        <div class="appt-actions" v-if="appt.status === 'PENDING'">
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
  </div>
</template>

<style scoped>
.mechanic-appointments {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.appointments-list {
  display: grid;
  gap: 20px;
}

.appt-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.appt-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.date {
  font-weight: bold;
  color: #2c3e50;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.status.pending {
  background: #f1c40f;
  color: white;
}
.status.approved {
  background: #2ecc71;
  color: white;
}
.status.rejected {
  background: #e74c3c;
  color: white;
}

.appt-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

h4 {
  margin: 0 0 5px 0;
  color: #7f8c8d;
  font-size: 0.9em;
}

p {
  margin: 0;
  color: #2c3e50;
}

.sub-text {
  font-size: 0.85em;
  color: #95a5a6;
}

.plate {
  background: #ecf0f1;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.appt-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.accept-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.reject-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: #292e2e;
  padding: 40px;
}
.dark-text {
  color: #ecf0f1;
}
</style>
