<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'
interface WorkOrderItem {
  id: number
  description: string
  cost: number
  isApproved: boolean
}

interface WorkOrder {
  id: number
  status: string
  vehicle: {
    licensePlate: string
    brand: string
    model: string
  }
  items: WorkOrderItem[]
  createdAt: string
}
const { isDark } = useTheme()

const orders = ref<WorkOrder[]>([])
const selectedOrder = ref<WorkOrder | null>(null)
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const loadOrders = async () => {
  const data = await api.getClientWorkOrders()
  orders.value = data
}

const viewDetails = (order: WorkOrder) => {
  selectedOrder.value = order
}

const closeDetails = () => {
  selectedOrder.value = null
}

const approveItem = async (item: WorkOrderItem) => {
  modalConfig.value = {
    title: 'Aprobar Ítem',
    message: `¿Estás seguro de aprobar "${item.description}" por $${item.cost}?`,
    type: 'warning',
    showCancel: true,
    action: async () => {
      const success = await api.approveWorkOrderItem(item.id)
      if (success) {
        item.isApproved = true
        showModal.value = false
        // Refresh orders to ensure sync
        await loadOrders()
        // Update selected order reference
        if (selectedOrder.value) {
          selectedOrder.value = orders.value.find((o) => o.id === selectedOrder.value!.id) || null
        }
      } else {
        // Fallback if modal fails or just close
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '#f1c40f'
    case 'IN_PROGRESS':
      return '#3498db'
    case 'COMPLETED':
      return '#2ecc71'
    case 'CANCELLED':
      return '#e74c3c'
    default:
      return '#95a5a6'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pendiente'
    case 'IN_PROGRESS':
      return 'En Progreso'
    case 'COMPLETED':
      return 'Completada'
    case 'CANCELLED':
      return 'Cancelada'
    default:
      return status
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="orders-container">
    <h2 class="section-title" :class="{ 'dark-text': isDark }">Mis Órdenes de Trabajo</h2>

    <div v-if="!selectedOrder" class="orders-list">
      <div v-if="orders.length === 0" class="no-orders">
        <v-icon size="64" color="#ccc">mdi-file-document-outline</v-icon>
        <p>No tienes órdenes de trabajo activas.</p>
      </div>

      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="viewDetails(order)"
        :style="{
          backgroundColor: isDark ? '#0b0b0b' : '#ffffff',
          color: isDark ? '#ffffff' : '#111827',
          border: isDark ? '1px solid rgba(217,0,0,0.12)' : '1px solid rgba(217,0,0,0.08)',
          boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.6)' : '0 2px 5px rgba(0,0,0,0.05)'
        }"
      >
        <div class="order-header" :style="{ color: isDark ? 'rgba(255,255,255,0.85)' : '#6b7280' }">
          <span class="order-id" :style="{ fontWeight: 700 }">#{{ order.id }}</span>
          <span class="order-date" :style="{ fontSize: '0.9em' }">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
        </div>

        <div class="order-vehicle">
          <h3 :style="{ margin: 0, color: isDark ? '#ffdede' : '#1f2937' }">{{ order.vehicle.brand }} {{ order.vehicle.model }}</h3>
          <span
        class="plate"
        :style="{
          background: isDark ? 'rgba(217,0,0,0.12)' : '#fff',
          color: isDark ? '#ffdede' : '#d90000',
          border: isDark ? '1px solid rgba(217,0,0,0.22)' : '1px solid rgba(217,0,0,0.15)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.85em',
          fontWeight: '700'
        }"
          >
        {{ order.vehicle.licensePlate || 'Sin patente' }}
          </span>
        </div>

        <div class="order-status">
          <span
        class="status-badge"
        :style="{
          backgroundColor: getStatusColor(order.status),
          color: '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
          boxShadow: isDark ? '0 1px 0 rgba(0,0,0,0.4) inset' : 'none'
        }"
          >
        {{ getStatusText(order.status) }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="order-details">
      <button class="back-button" @click="closeDetails">
        <v-icon>mdi-arrow-left</v-icon> Volver
      </button>

      <div class="details-card" :class="{ 'dark-card': isDark }" :style="{
        backgroundColor: isDark ? '#0b0b0b' : '#ffffff',
        color: isDark ? '#ffffff' : '#111827',
        border: isDark ? '1px solid rgba(217,0,0,0.22)' : '1px solid rgba(217,0,0,0.10)'
      }">
        <div class="details-header" :style="{ borderBottomColor: isDark ? 'rgba(217,0,0,0.18)' : '#eee' }">
          <h2 :style="{ color: isDark ? '#ffffff' : '#111827' }">Orden #{{ selectedOrder.id }}</h2>
          <span class="status-badge" :style="{
        backgroundColor: getStatusColor(selectedOrder.status),
        color: '#ffffff',
        border: isDark ? '1px solid rgba(217,0,0,0.30)' : '1px solid rgba(217,0,0,0.08)'
          }">
        {{ getStatusText(selectedOrder.status) }}
          </span>
        </div>

        <div class="vehicle-info" :style="{ marginBottom: '12px' }">
          <h3 :style="{ color: isDark ? '#ffdede' : '#111827' }">Vehículo</h3>
          <p :style="{ color: isDark ? '#ffdede' : '#4b5563' }">
        {{ selectedOrder.vehicle.brand }} {{ selectedOrder.vehicle.model }} -
        <span
          :style="{ background: isDark ? 'rgba(217,0,0,0.12)' : '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', color: isDark ? '#ffdede' : '#d90000', border: isDark ? '1px solid rgba(217,0,0,0.22)' : '1px solid rgba(217,0,0,0.12)' }">
          {{ selectedOrder.vehicle.licensePlate || 'Sin patente' }}
        </span>
          </p>
        </div>

        <div class="items-list">
          <h3 :style="{ color: isDark ? '#ffdede' : '#111827' }">Ítems y Servicios</h3>
          <div v-if="selectedOrder.items.length === 0" class="no-items"
        :style="{ color: isDark ? '#9fb2cc' : '#7f8c8d' }">
        No hay ítems registrados.
          </div>
          <div v-for="item in selectedOrder.items" :key="item.id" class="item-row" :style="{
        borderBottomColor: isDark ? 'rgba(217,0,0,0.06)' : '#f5f5f5'
          }">
        <div class="item-info">
          <span class="item-desc" :style="{ color: isDark ? '#ffffff' : '#1f2937' }">{{ item.description }}</span>
          <span class="item-cost" :style="{ color: isDark ? '#ffdede' : '#7f8c8d' }">${{ item.cost }}</span>
        </div>
        <div class="item-action">
          <span v-if="item.isApproved" class="approved-badge" :style="{ color: isDark ? '#34d399' : '#27ae60' }">
            <v-icon color="green" size="small">mdi-check-circle</v-icon> Aprobado
          </span>
          <button v-else class="approve-btn" @click.stop="approveItem(item)" :style="{
            backgroundColor: isDark ? '#059669' : '#2ecc71',
            color: 'white',
            border: isDark ? '1px solid rgba(217,0,0,0.06)' : 'none',
            boxShadow: isDark ? '0 1px 0 rgba(0,0,0,0.4) inset' : 'none'
          }">
            Aprobar
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>

    <Modal :show="showModal" :title="modalConfig.title" :message="modalConfig.message" :type="modalConfig.type"
      :show-cancel="modalConfig.showCancel" @close="showModal = false" @confirm="handleConfirm" />
  </div>
</template>

<style scoped>
.orders-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.dark-text {
  color: white !important;
}

.orders-list {
  display: grid;
  gap: 15px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  flex-direction: column;
  color: #7f8c8d;
  font-size: 0.9em;
}

.order-vehicle h3 {
  margin: 0;
  color: #2c3e50;
}

.plate {
  background: #ecf0f1;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 15px;
  color: white;
  font-size: 0.85em;
  font-weight: bold;
}

.back-button {
  background: none;
  border: none;
  color: #d90000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
  font-weight: bold;
}

.details-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-desc {
  font-weight: 500;
}

.item-cost {
  color: #7f8c8d;
}

.approve-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.approve-btn:hover {
  background-color: #27ae60;
}

.approved-badge {
  color: #27ae60;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
}

.no-orders {
  text-align: center;
  color: #95a5a6;
  padding: 40px;
}
</style>
