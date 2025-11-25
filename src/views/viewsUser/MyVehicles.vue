<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'

interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  licensePlate: string
}

const vehicles = ref<Vehicle[]>([])
const loading = ref(true)
const showFormModal = ref(false)
const isEditing = ref(false)
const currentVehicleId = ref<number | null>(null)

// Form data
const formData = ref({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
})

// Modal config
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null,
})

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

const loadVehicles = async () => {
  loading.value = true
  try {
    const response = await api.getMyVehicles()
    vehicles.value = response.data || []
  } catch (error) {
    console.error('Error loading vehicles:', error)
    showModalMessage('Error', 'No se pudieron cargar los vehículos.', 'error')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  currentVehicleId.value = null
  formData.value = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
  }
  showFormModal.value = true
}

const openEditModal = (vehicle: Vehicle) => {
  isEditing.value = true
  currentVehicleId.value = vehicle.id
  formData.value = {
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
  }
  showFormModal.value = true
}

const saveVehicle = async () => {
  if (!formData.value.brand || !formData.value.model || !formData.value.licensePlate) {
    showModalMessage('Error', 'Por favor completa todos los campos obligatorios.', 'warning')
    return
  }

  try {
    let result
    if (isEditing.value && currentVehicleId.value) {
      result = await api.updateVehicle(currentVehicleId.value, formData.value)
    } else {
      result = await api.createVehicle(formData.value)
    }

    if (result.success) {
      showModalMessage('Éxito', result.message, 'success')
      showFormModal.value = false
      await loadVehicles()
    } else {
      showModalMessage('Error', result.message, 'error')
    }
  } catch (error) {
    showModalMessage('Error', 'Ocurrió un error al guardar el vehículo.', 'error')
  }
}

const confirmDelete = (vehicleId: number) => {
  modalConfig.value = {
    title: 'Eliminar Vehículo',
    message: '¿Estás seguro de que deseas eliminar este vehículo?',
    type: 'warning',
    showCancel: true,
    action: async () => {
      const result = await api.deleteVehicle(vehicleId)
      if (result.success) {
        showModalMessage('Eliminado', result.message, 'success')
        await loadVehicles()
      } else {
        showModalMessage('Error', result.message, 'error')
      }
    },
  }
  showModal.value = true
}

onMounted(() => {
  loadVehicles()
})
</script>

<template>
  <div class="vehicles-container">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h4 font-weight-bold text-red">Mis Vehículos</h2>
      <v-btn color="red" prepend-icon="mdi-plus" @click="openCreateModal"> Agregar Vehículo </v-btn>
    </div>

    <div v-if="loading" class="d-flex justify-center py-8">
      <v-progress-circular indeterminate color="red" size="64"></v-progress-circular>
    </div>

    <div v-else-if="vehicles.length === 0" class="text-center py-8 text-grey">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-car-off</v-icon>
      <p class="text-h6">No tienes vehículos registrados.</p>
      <p>Agrega uno para poder agendar citas.</p>
    </div>

    <v-row v-else>
      <v-col v-for="vehicle in vehicles" :key="vehicle.id" cols="12" sm="6" md="4">
        <v-card class="vehicle-card h-100" elevation="2">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="red-lighten-5" size="48" class="mr-3">
                <v-icon color="red" size="28">mdi-car</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h6 font-weight-bold">
              {{ vehicle.brand }} {{ vehicle.model }}
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1">
              {{ vehicle.year }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="pt-4">
            <div class="d-flex align-center mb-2">
              <v-icon size="20" color="grey-darken-1" class="mr-2">mdi-card-account-details</v-icon>
              <span class="text-body-1 font-weight-medium">{{ vehicle.licensePlate }}</span>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="blue-darken-1"
              prepend-icon="mdi-pencil"
              @click="openEditModal(vehicle)"
            >
              Editar
            </v-btn>
            <v-btn
              variant="text"
              color="red"
              prepend-icon="mdi-delete"
              @click="confirmDelete(vehicle.id)"
            >
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Form Modal -->
    <v-dialog v-model="showFormModal" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 bg-red text-white pa-4">
          {{ isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form @submit.prevent="saveVehicle">
            <v-text-field
              v-model="formData.brand"
              label="Marca"
              prepend-inner-icon="mdi-watermark"
              variant="outlined"
              color="red"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="formData.model"
              label="Modelo"
              prepend-inner-icon="mdi-car-side"
              variant="outlined"
              color="red"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model.number="formData.year"
              label="Año"
              type="number"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              color="red"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="formData.licensePlate"
              label="Placa / Matrícula"
              prepend-inner-icon="mdi-card-account-details"
              variant="outlined"
              color="red"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showFormModal = false"
            >Cancelar</v-btn
          >
          <v-btn color="red" variant="elevated" @click="saveVehicle">Guardar</v-btn>
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
      @confirm="modalConfig.action ? modalConfig.action() : (showModal = false)"
    />
  </div>
</template>

<style scoped>
.vehicles-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.vehicle-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}
</style>
