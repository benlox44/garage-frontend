<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useTheme } from '@/composables/useTheme'
import { useRoute } from 'vue-router'
import { type WorkOrder, WorkOrderStatus, type Vehicle } from '@/types/garage'

const { isDark } = useTheme()
const route = useRoute()

const orders = ref<WorkOrder[]>([])
const selectedOrder = ref<WorkOrder | null>(null)
const showModal = ref(false)
const showCreateModal = ref(false)
const newOrderForm = ref({
  licensePlate: '',
  description: '',
  estimatedCost: 0,
  requestedServices: [] as string[],
})

// Search state
const vehicleSearch = ref('')
const vehicleResults = ref<Vehicle[]>([])
const isLoadingVehicles = ref(false)

const commonServices = [
  'Cambio de Aceite',
  'Revisión de Frenos',
  'Alineación y Balanceo',
  'Cambio de Batería',
  'Revisión General',
  'Cambio de Neumáticos',
  'Reparación de Motor',
  'Diagnóstico Eléctrico'
]

const historySearch = ref('')
const vehicleHistory = ref<WorkOrder[]>([])
const showHistory = ref(false)

const newItemForm = ref({
  name: '',
  type: '',
  quantity: 0,
  unitPrice: 0,
})

const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

const formatStatus = (status: string) => {
  switch (status) {
    case WorkOrderStatus.PENDING_APPROVAL:
      return 'PENDIENTE'
    case WorkOrderStatus.IN_PROGRESS:
      return 'EN PROGRESO'
    case WorkOrderStatus.COMPLETED:
      return 'COMPLETADO'
    case WorkOrderStatus.CANCELLED:
      return 'CANCELADO'
    default:
      return status
  }
}

const normalizerTypeItems = (type: string) => {
  switch (type) {
    case 'spare_part':
      return 'Repuesto'
    case 'tool':
      return 'Herramienta'
    case 'service':
      return 'Servicio'
    default:
      return type
  }
}

const loadOrders = async () => {
  const data = await api.getMechanicWorkOrders()
  orders.value = (data || []).sort((a, b) => a.id - b.id)
}

watch(() => route.query.workOrderId, async (id) => {
  if (id) {
    if (orders.value.length === 0) {
      await loadOrders()
    }

    const orderId = Number(id)
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      viewDetails(order)
    }
  }
}, { immediate: true })

const searchHistory = async () => {
  if (!historySearch.value) return
  const data = await api.getWorkOrdersByLicensePlate(historySearch.value)
  vehicleHistory.value = data || []
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
    requestedServices: [],
  }
  vehicleSearch.value = ''
  vehicleResults.value = []
  showCreateModal.value = true
}

watch(vehicleSearch, async (val) => {
  if (!val || val.length < 2) {
    vehicleResults.value = []
    return
  }

  // Si el valor coincide exactamente con una patente seleccionada, no buscar
  if (newOrderForm.value.licensePlate === val) return

  isLoadingVehicles.value = true
  try {
    const results = await api.searchVehicles(val)
    vehicleResults.value = results
  } finally {
    isLoadingVehicles.value = false
  }
})

const submitOrder = async () => {
  if (!newOrderForm.value.licensePlate || !newOrderForm.value.description) {
    showModalMessage('Error', 'Complete los campos obligatorios', 'warning')
    return
  }

  const payload = {
    licensePlate: newOrderForm.value.licensePlate,
    description: newOrderForm.value.description,
    estimatedCost: newOrderForm.value.estimatedCost,
    requestedServices: newOrderForm.value.requestedServices,
    items: [],
  }

  const result = await api.createWorkOrder(payload)
  if (result) {
    showModalMessage('Éxito', 'Orden creada correctamente', 'success')
    showCreateModal.value = false
    await loadOrders()
  } else {
    showModalMessage(
      'Error',
      'No se pudo crear la orden. Verifique la patente del vehículo.',
      'error',
    )
  }
}

const viewDetails = (order: WorkOrder) => {
  selectedOrder.value = order
}

const closeDetails = () => {
  selectedOrder.value = null
}
//pending_approval, in_progress, completed, cancelled
const updateStatus = async (status: WorkOrderStatus) => {
  if (!selectedOrder.value) return

  const result = await api.updateWorkOrder(selectedOrder.value.id, status)
  if (result) {
    selectedOrder.value.status = status
    // Update in list as well
    const idx = orders.value.findIndex((o) => o.id === selectedOrder.value!.id)
    if (idx !== -1 && orders.value[idx]) orders.value[idx].status = status
    showModalMessage('Éxito', 'Estado actualizado', 'success')
  }
}

export interface NewItem {
  name: string
  type: string
  quantity: number
  unitPrice: number
}
const addItem = async () => {
  if (!newItemForm.value.name || newItemForm.value.quantity <= 0 || newItemForm.value.unitPrice <= 0) return

  if (selectedOrder.value) {
    const payload = {
      items: [
        {
          name: newItemForm.value.name,
          type: newItemForm.value.type,
          quantity: newItemForm.value.quantity,
          unitPrice: newItemForm.value.unitPrice,
        },
      ],
    }

    const result = await api.addWorkOrderItems(selectedOrder.value.id, payload)

    if (result) {
      // Refresh order details
      const updatedOrder = await api.getWorkOrderById(selectedOrder.value.id)
      if (updatedOrder) {
        selectedOrder.value = updatedOrder
      }

      // Reset form
      newItemForm.value = {
        name: '',
        type: '',
        quantity: 0,
        unitPrice: 0,
      }
      showModalMessage('Éxito', 'Ítem agregado correctamente', 'success')
    } else {
      showModalMessage('Error', 'No se pudo agregar el ítem', 'error')
    }
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
    case WorkOrderStatus.PENDING_APPROVAL:
      return '#f1c40f'
    case WorkOrderStatus.IN_PROGRESS:
      return '#3498db'
    case WorkOrderStatus.COMPLETED:
      return '#2ecc71'
    case WorkOrderStatus.CANCELLED:
      return '#e74c3c'
    default:
      return '#95a5a6'
  }
}
const formatCurrency = (value: number | string | null | undefined) => {
  // Normalizar valores inválidos
  if (value === null || value === undefined || value === '') return ''

  // Convertir a número seguro
  const n = typeof value === 'number' ? value : Number(String(value).replace(/\s/g, ''))

  if (Number.isNaN(n)) return ''

  // Formatear sin decimales y con separador de miles (es-CL)
  return Math.round(n).toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div :class="{ 'dark-theme': isDark }">
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
        <div
          v-if="vehicleHistory.length === 0"
          class="no-history pa-4 text-center bg-grey-lighten-4 rounded"
        >
          No hay historial para este vehículo.
        </div>
        <div v-else class="history-list">
          <div
            v-for="order in vehicleHistory"
            :key="order.id"
            class="order-card history-card mb-2"
            @click="viewDetails(order)"
          >
            <div class="order-header">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="order-vehicle">
              <h3>{{ order.vehicle?.brand }} {{ order.vehicle?.model }}</h3>
              <span class="plate">{{ order.vehicle?.licensePlate }}</span>
            </div>
            <div class="order-status">
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
                {{ formatStatus(order.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Orders List / Desde aqui mira que hay -->
    <div v-if="!selectedOrder" class="orders-list">
      <div v-if="orders.length === 0" class="no-orders">No hay órdenes de trabajo.</div>

      <div v-for="order in orders" :key="order.id" class="order-card" @click="viewDetails(order)">
        <v-row>
          <v-col cols="12" md="4" class="text-center md:text-left">
            <span class="order-id">#{{ order.id }}</span>
            <br />
            <span class="order-date">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
          </v-col>
          <v-col cols="12" md="4" class="text-center md:text-left">
            <h3>{{ order.vehicle?.brand }} {{ order.vehicle?.model }}</h3>
            <span class="plate">{{ order.vehicle?.licensePlate }}</span>
          </v-col>
          <v-col cols="12" md="4" class="text-center md:text-left">
            <span class="status-badge" :style="{ backgroundColor: getStatusColor(order.status) }">
              {{ formatStatus(order.status) }}
            </span>
          </v-col>
        </v-row>
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
              <v-select
                :items="[
                  { title: 'Pendiente', value: WorkOrderStatus.PENDING_APPROVAL },
                  { title: 'En Progreso', value: WorkOrderStatus.IN_PROGRESS },
                  { title: 'Completada', value: WorkOrderStatus.COMPLETED },
                  { title: 'Cancelada', value: WorkOrderStatus.CANCELLED },
                ]"
                v-model="selectedOrder.status"
                @update:model-value="updateStatus"
                :class="{ 'dark-theme': isDark }"
              />
            </div>
          </div>

          <div class="vehicle-info">
            <h3>Vehículo</h3>
            <p>
              {{ selectedOrder.vehicle?.brand }} {{ selectedOrder.vehicle?.model }} -
              {{ selectedOrder.vehicle?.licensePlate }}
            </p>
          </div>
        </div>

        <!-- Items -->
        <div class="details-card items-section">
          <h3>Ítems y Servicios</h3>

          <div class="add-item-form">
            <v-row>
              <!-- Nombre -->
              <v-col cols="3">
                <v-text-field
                  v-model="newItemForm.name"
                  label="Nombre"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <!-- Tipo -->
              <v-col cols="3">
                <v-select
                  v-model="newItemForm.type"
                  :items="[
                    { label: 'Repuesto', value: 'spare_part' },
                    { label: 'Herramienta', value: 'tool' },
                    { label: 'Servicio', value: 'service' },
                  ]"
                  item-title="label"
                  item-value="value"
                  label="Tipo"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <!-- Cantidad -->
              <v-col cols="2">
                <v-text-field
                  v-model.number="newItemForm.quantity"
                  label="Cantidad"
                  type="number"
                  min="1"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <!-- Precio unitario -->
              <v-col cols="2">
                <v-text-field
                  v-model.number="newItemForm.unitPrice"
                  label="Precio Unitario"
                  type="number"
                  min="0"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <!-- Botón -->
              <v-col cols="2" class="d-flex align-center">
                <v-btn color="primary" @click="addItem" block> Agregar </v-btn>
              </v-col>
            </v-row>
          </div>

          <div class="items-list">
            <div v-for="item in selectedOrder.items" :key="item.id" class="item-row">
              <v-row>
                <v-col cols="12" md="3">
                  <span class="item-desc">{{ item.name }}</span>
                </v-col>
                <v-col cols="12" md="3">
                  <span class="item-desc"
                    >Tipo: {{ normalizerTypeItems(item.type) }} - Cantidad:
                    {{ item.quantity }}</span
                  >
                </v-col>
                <v-col cols="12" md="3">
                  <span class="item-cost">$ {{ formatCurrency(item.unitPrice) }}</span>
                </v-col>
                <v-col cols="12" md="3">
                  <span v-if="item.approved" class="approved">Aprobado</span>
                  <span v-else class="pending">Pendiente Aprobación</span>
                </v-col>
              </v-row>
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
            <v-autocomplete
              v-model="newOrderForm.licensePlate"
              v-model:search="vehicleSearch"
              :items="vehicleResults"
              :loading="isLoadingVehicles"
              item-title="licensePlate"
              item-value="licensePlate"
              label="Patente del Vehículo"
              placeholder="Escriba para buscar (ej. PT...)"
              variant="outlined"
              color="red"
              class="mb-2"
              hide-no-data
              hide-details="auto"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw.licensePlate"
                  :subtitle="`${item.raw.brand} ${item.raw.model} - ${item.raw.client?.name || 'Cliente'}`"
                ></v-list-item>
              </template>
            </v-autocomplete>

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

            <v-combobox
              v-model="newOrderForm.requestedServices"
              :items="commonServices"
              label="Servicios Solicitados"
              placeholder="Seleccione o escriba servicios"
              multiple
              chips
              closable-chips
              variant="outlined"
              color="red"
              class="mb-2"
            ></v-combobox>
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
  transition:
    background-color 0.3s,
    color 0.3s;
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
.dark-theme {
  color: #ffffff;
}
</style>
