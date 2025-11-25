<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'

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
    plate: string
    brand: string
    model: string
  }
  items: WorkOrderItem[]
  createdAt: string
}

const orders = ref<WorkOrder[]>([])
const selectedOrder = ref<WorkOrder | null>(null)
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null
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
          selectedOrder.value = orders.value.find(o => o.id === selectedOrder.value!.id) || null
        }
      } else {
        // Fallback if modal fails or just close
        showModal.value = false
      }
    }
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
    case 'PENDING': return '#f1c40f'
    case 'IN_PROGRESS': return '#3498db'
    case 'COMPLETED': return '#2ecc71'
    case 'CANCELLED': return '#e74c3c'
    default: return '#95a5a6'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Pendiente'
    case 'IN_PROGRESS': return 'En Progreso'
    case 'COMPLETED': return 'Completada'
    case 'CANCELLED': return 'Cancelada'
    default: return status
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="orders-container">
    <h2 class="section-title">Mis Órdenes de Trabajo</h2>

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
      >
        <div class="order-header">
          <span class="order-id">#{{ order.id }}</span>
          <span class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
        </div>
        <div class="order-vehicle">
          <h3>{{ order.vehicle.brand }} {{ order.vehicle.model }}</h3>
          <span class="plate">{{ order.vehicle.plate }}</span>
        </div>
        <div class="order-status">
          <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
            {{ getStatusText(order.status) }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="order-details">
      <button class="back-button" @click="closeDetails">
        <v-icon>mdi-arrow-left</v-icon> Volver
      </button>

      <div class="details-card">
        <div class="details-header">
          <h2>Orden #{{ selectedOrder.id }}</h2>
          <span class="status-badge" :style="{ backgroundColor: getStatusColor(selectedOrder.status) }">
            {{ getStatusText(selectedOrder.status) }}
          </span>
        </div>

        <div class="vehicle-info">
          <h3>Vehículo</h3>
          <p>{{ selectedOrder.vehicle.brand }} {{ selectedOrder.vehicle.model }} - {{ selectedOrder.vehicle.plate }}</p>
        </div>

        <div class="items-list">
          <h3>Ítems y Servicios</h3>
          <div v-if="selectedOrder.items.length === 0" class="no-items">
            No hay ítems registrados.
          </div>
          <div v-for="item in selectedOrder.items" :key="item.id" class="item-row">
            <div class="item-info">
              <span class="item-desc">{{ item.description }}</span>
              <span class="item-cost">${{ item.cost }}</span>
            </div>
            <div class="item-action">
              <span v-if="item.isApproved" class="approved-badge">
                <v-icon color="green" size="small">mdi-check-circle</v-icon> Aprobado
              </span>
              <button 
                v-else 
                class="approve-btn"
                @click.stop="approveItem(item)"
              >
                Aprobar
              </button>
            </div>
          </div>
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

.orders-list {
  display: grid;
  gap: 15px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
  color: #D90000;
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
