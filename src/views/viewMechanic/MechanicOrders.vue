<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'
const { isDark } = useTheme()

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

const orders = ref<WorkOrder[]>([])
const selectedOrder = ref<WorkOrder | null>(null)
const showModal = ref(false)
const showCreateModal = ref(false)
const newOrderForm = ref({
  licensePlate: '',
  description: '',
  estimatedCost: 0,
  requestedServices: '',
})

const historySearch = ref('')
const vehicleHistory = ref<WorkOrder[]>([])
const showHistory = ref(false)

const newItemForm = ref({
  description: '',
  cost: 0,
})

const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const loadOrders = async () => {
  const data = await api.getMechanicWorkOrders()
  orders.value = data
}

const searchHistory = async () => {
  if (!historySearch.value) return
  const data = await api.getWorkOrdersByLicensePlate(historySearch.value)
  vehicleHistory.value = data.data || []
  showHistory.value = true
}

const closeHistory = () => {
  showHistory.value = false
  vehicleHistory.value = []
  historySearch.value = ''
}

const createOrder = () => {
  newOrderForm.value = {
    licensePlate: '',
    description: '',
    estimatedCost: 0,
    requestedServices: '',
  }
  showCreateModal.value = true
}

const submitOrder = async () => {
  if (!newOrderForm.value.licensePlate || !newOrderForm.value.description) {
    showModalMessage('Error', 'Complete los campos obligatorios', 'warning')
    return
  }

  const payload = {
    licensePlate: newOrderForm.value.licensePlate,
    description: newOrderForm.value.description,
    estimatedCost: newOrderForm.value.estimatedCost,
    requestedServices: newOrderForm.value.requestedServices
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s),
    items: [],
  }

  const result = await api.createWorkOrder(payload)
  if (result) {
    showModalMessage('Éxito', 'Orden creada correctamente', 'success')
    showCreateModal.value = false
    await loadOrders()
  } else {
    showModalMessage('Error', 'No se pudo crear la orden. Verifique la patente del vehículo.', 'error')
  }
}

const viewDetails = (order: WorkOrder) => {
  selectedOrder.value = order
}

const closeDetails = () => {
  selectedOrder.value = null
}

const updateStatus = async (status: string) => {
  if (!selectedOrder.value) return

  const result = await api.updateWorkOrder(selectedOrder.value.id, { status })
  if (result) {
    selectedOrder.value.status = status
    // Update in list as well
    const idx = orders.value.findIndex((o) => o.id === selectedOrder.value!.id)
    if (idx !== -1 && orders.value[idx]) orders.value[idx].status = status
    showModalMessage('Éxito', 'Estado actualizado', 'success')
  }
}

const addItem = async () => {
  if (!selectedOrder.value) return
  if (!newItemForm.value.description || newItemForm.value.cost <= 0) {
    showModalMessage('Error', 'Datos inválidos', 'error')
    return
  }

  const result = await api.addWorkOrderItems(selectedOrder.value.id, {
    items: [
      {
        description: newItemForm.value.description,
        cost: newItemForm.value.cost,
      },
    ],
  })

  if (result) {
    // Refresh details
    const updatedOrder = await api.getWorkOrderById(selectedOrder.value.id)
    if (updatedOrder && updatedOrder.data) {
      selectedOrder.value = updatedOrder.data
      // Update list
      const idx = orders.value.findIndex((o) => o.id === selectedOrder.value!.id)
      if (idx !== -1) orders.value[idx] = updatedOrder.data
    }
    newItemForm.value = { description: '', cost: 0 }
    showModalMessage('Éxito', 'Ítem agregado', 'success')
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

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div  :class="{ 'dark-theme': isDark }">
    <div class="header-actions">
      <h2 class="section-title">Gestión de Órdenes</h2>
      <button @click="createOrder" class="create-btn"><v-icon>mdi-plus</v-icon> Nueva Orden</button>
    </div>

    <!-- History Search Section -->
    <div class="history-search-section mb-4">
      <div class="search-box d-flex gap-2">
        <v-text-field
          v-model="historySearch"
          label="Buscar historial por patente"
          variant="outlined"
          density="compact"
          hide-details
          @keyup.enter="searchHistory"
          append-inner-icon="mdi-magnify"
          @click:append-inner="searchHistory"
        ></v-text-field>
        <v-btn color="primary" @click="searchHistory">Buscar</v-btn>
      </div>

      <div v-if="showHistory" class="history-results mt-4">
        <div class="history-header d-flex justify-space-between align-center mb-2">
          <h3>Historial del Vehículo: {{ historySearch }}</h3>
          <v-btn size="small" color="grey" variant="text" @click="closeHistory">Cerrar</v-btn>
        </div>
        <div v-if="vehicleHistory.length === 0" class="no-history pa-4 text-center bg-grey-lighten-4 rounded">
          No hay historial para este vehículo.
        </div>
        <div v-else class="history-list">
          <div v-for="order in vehicleHistory" :key="order.id" class="order-card history-card mb-2" @click="viewDetails(order)">
            <div class="order-header">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="order-vehicle">
              <h3>{{ order.vehicle.brand }} {{ order.vehicle.model }}</h3>
              <span class="plate">{{ order.vehicle.licensePlate }}</span>
            </div>
            <div class="order-status">
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!selectedOrder" class="orders-list">
      <div v-if="orders.length === 0" class="no-orders">No hay órdenes de trabajo.</div>

      <div v-for="order in orders" :key="order.id" class="order-card" @click="viewDetails(order)">
        <div class="order-header">
          <span class="order-id">#{{ order.id }}</span>
          <span class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
        </div>
        <div class="order-vehicle">
          <h3>{{ order.vehicle.brand }} {{ order.vehicle.model }}</h3>
          <span class="plate">{{ order.vehicle.licensePlate }}</span>
        </div>
        <div class="order-status">
          <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
            {{ order.status }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="order-details">
      <button class="back-button" @click="closeDetails">
        <v-icon>mdi-arrow-left</v-icon> Volver
      </button>

      <div class="details-grid">
        <!-- Main Info -->
        <div class="details-card main-info">
          <div class="details-header">
            <h2>Orden #{{ selectedOrder.id }}</h2>
            <div class="status-actions">
              <select
                :value="selectedOrder.status"
                @change="(e) => updateStatus((e.target as HTMLSelectElement).value)"
                class="status-select"
              >
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>

          <div class="vehicle-info">
            <h3>Vehículo</h3>
            <p>
              {{ selectedOrder.vehicle.brand }} {{ selectedOrder.vehicle.model }} -
              {{ selectedOrder.vehicle.licensePlate }}
            </p>
          </div>
        </div>

        <!-- Items -->
        <div class="details-card items-section">
          <h3>Ítems y Servicios</h3>

          <div class="add-item-form">
            <input v-model="newItemForm.description" placeholder="Descripción" class="input-desc" />
            <input
              v-model.number="newItemForm.cost"
              type="number"
              placeholder="Costo"
              class="input-cost"
            />
            <button @click="addItem" class="add-btn">Agregar</button>
          </div>

          <div class="items-list">
            <div v-for="item in selectedOrder.items" :key="item.id" class="item-row">
              <div class="item-info">
                <span class="item-desc">{{ item.description }}</span>
                <span class="item-cost">${{ item.cost }}</span>
              </div>
              <div class="item-status">
                <span v-if="item.isApproved" class="approved">Aprobado</span>
                <span v-else class="pending">Pendiente Aprobación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Order Modal -->
    <v-dialog v-model="showCreateModal" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 bg-red text-white pa-4"> Nueva Orden de Trabajo </v-card-title>
        <v-card-text class="pa-4">
          <v-form @submit.prevent="submitOrder">
            <v-text-field
              v-model="newOrderForm.licensePlate"
              label="Patente del Vehículo"
              variant="outlined"
              color="red"
              class="mb-2"
              hint="Ingrese la patente del vehículo del cliente"
              persistent-hint
            ></v-text-field>

            <v-textarea
              v-model="newOrderForm.description"
              label="Descripción del Problema"
              variant="outlined"
              color="red"
              class="mb-2"
              rows="3"
            ></v-textarea>

            <v-text-field
              v-model.number="newOrderForm.estimatedCost"
              label="Costo Estimado"
              type="number"
              prefix="$"
              variant="outlined"
              color="red"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="newOrderForm.requestedServices"
              label="Servicios Solicitados"
              placeholder="Cambio de aceite, Revisión de frenos (separados por coma)"
              variant="outlined"
              color="red"
              rows="2"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showCreateModal = false"
            >Cancelar</v-btn
          >
          <v-btn color="red" variant="elevated" @click="submitOrder">Crear Orden</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
.mechanic-orders {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
  transition: background-color 0.3s, color 0.3s;
}

.mechanic-orders.dark-theme {
  background-color: #000000;
  color: #ffffff;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  border-bottom: 2px solid #d90000;
  padding-bottom: 5px;
}

.create-btn {
  background-color: #d90000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
}

.orders-list {
  
}

.order-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
}

.dark-theme .order-card {
  background: #1a1a1a;
  border: 1px solid #333;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.05);
}

.order-card:hover {
  transform: translateY(-2px);
}

.status-badge {
  padding: 5px 10px;
  border-radius: 15px;
  color: white;
  font-size: 0.85em;
  font-weight: bold;
}

.details-grid {
  display: grid;
  gap: 20px;
}

.details-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.dark-theme .details-card {
  background: #1a1a1a;
  border: 1px solid #333;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.dark-theme .details-header {
  border-bottom: 1px solid #333;
}

.status-select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.add-item-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: #eee;
  padding: 15px;
  border-radius: 4px;
}

.dark-theme .add-item-form {
  background: #2a2a2a;
}

.input-desc {
  flex: 2;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-cost {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.dark-theme .item-row {
  border-bottom: 1px solid #333;
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

.dark-theme .item-cost {
  color: #aaa;
}

.approved {
  color: #2ecc71;
  font-weight: bold;
}

.pending {
  color: #f1c40f;
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

.history-search-section {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.dark-theme .history-search-section {
  background: #1a1a1a;
  border: 1px solid #333;
}

.history-results {
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.dark-theme .history-results {
  border-top: 1px solid #333;
}

.no-history {
  background: #eee;
  color: #666;
}

.dark-theme .no-history {
  background: #2a2a2a;
  color: #aaa;
}

.history-card {
  border-left: 4px solid #d90000;
}
</style>
