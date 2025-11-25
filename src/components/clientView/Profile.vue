<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({
  name: '',
  email: '',
  role: ''
})

const isEditing = ref(false)
const editForm = ref({
  name: '',
  phone: ''
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPasswordForm = ref(false)
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'warning' | 'error',
  showCancel: false,
  action: null as (() => void) | null
})

const loadProfile = async () => {
  const data = await api.perfil()
  if (data) {
    user.value = {
      name: data.name,
      email: data.email,
      role: data.rol
    }
    editForm.value.name = data.name
    // Assuming phone comes from backend, if not it will be empty
  }
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value.name = user.value.name
}

const saveProfile = async () => {
  const success = await api.updateProfile({ name: editForm.value.name })
  if (success) {
    user.value.name = editForm.value.name
    isEditing.value = false
    showModalMessage('Éxito', 'Perfil actualizado correctamente', 'success')
  } else {
    showModalMessage('Error', 'No se pudo actualizar el perfil', 'error')
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showModalMessage('Error', 'Las contraseñas no coinciden', 'error')
    return
  }

  const success = await api.updatePassword({
    oldPassword: passwordForm.value.oldPassword,
    newPassword: passwordForm.value.newPassword
  })

  if (success) {
    showPasswordForm.value = false
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    showModalMessage('Éxito', 'Contraseña actualizada correctamente', 'success')
  } else {
    showModalMessage('Error', 'No se pudo actualizar la contraseña. Verifica tu contraseña actual.', 'error')
  }
}

const confirmDeleteAccount = () => {
  modalConfig.value = {
    title: 'Eliminar Cuenta',
    message: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    type: 'error',
    showCancel: true,
    action: async () => {
      const success = await api.deleteMe()
      if (success) {
        api.logout()
        router.push('/')
      } else {
        showModalMessage('Error', 'No se pudo eliminar la cuenta', 'error')
      }
    }
  }
  showModal.value = true
}

const showModalMessage = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
  modalConfig.value = {
    title,
    message,
    type,
    showCancel: false,
    action: null
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
  loadProfile()
})
</script>

<template>
  <div class="profile-container">
    <h2 class="section-title">Mi Perfil</h2>

    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-placeholder">
          <v-icon size="64" color="white">mdi-account</v-icon>
        </div>
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
          <span class="role-badge">{{ user.role }}</span>
        </div>
      </div>

      <div class="profile-actions">
        <!-- Edit Profile Section -->
        <div class="action-section">
          <div class="section-header">
            <h3>Información Personal</h3>
            <button v-if="!isEditing" @click="startEditing" class="edit-btn">
              <v-icon size="small">mdi-pencil</v-icon> Editar
            </button>
          </div>

          <div v-if="isEditing" class="edit-form">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input v-model="editForm.name" type="text" />
            </div>
            <div class="form-actions">
              <button @click="cancelEditing" class="cancel-btn">Cancelar</button>
              <button @click="saveProfile" class="save-btn">Guardar</button>
            </div>
          </div>
          <div v-else class="info-display">
            <p><strong>Nombre:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </div>
        </div>

        <!-- Change Password Section -->
        <div class="action-section">
          <div class="section-header">
            <h3>Seguridad</h3>
            <button @click="showPasswordForm = !showPasswordForm" class="toggle-btn">
              {{ showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña' }}
            </button>
          </div>

          <div v-if="showPasswordForm" class="password-form">
            <div class="form-group">
              <label>Contraseña Actual</label>
              <input v-model="passwordForm.oldPassword" type="password" />
            </div>
            <div class="form-group">
              <label>Nueva Contraseña</label>
              <input v-model="passwordForm.newPassword" type="password" />
            </div>
            <div class="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input v-model="passwordForm.confirmPassword" type="password" />
            </div>
            <button @click="changePassword" class="save-btn full-width">Actualizar Contraseña</button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="danger-zone">
          <h3>Zona de Peligro</h3>
          <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
          <button @click="confirmDeleteAccount" class="delete-btn">
            Eliminar Cuenta
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
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.profile-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-header {
  background: linear-gradient(135deg, #D90000 0%, #b30000 100%);
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info h3 {
  margin: 0;
  font-size: 1.5em;
}

.user-info p {
  margin: 5px 0;
  opacity: 0.9;
}

.role-badge {
  background: rgba(0,0,0,0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8em;
  text-transform: uppercase;
}

.profile-actions {
  padding: 20px;
}

.action-section {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
}

.edit-btn, .toggle-btn {
  background: none;
  border: none;
  color: #D90000;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #7f8c8d;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn {
  background-color: #D90000;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.full-width {
  width: 100%;
}

.danger-zone {
  border: 1px solid #ffcccc;
  background-color: #fff5f5;
  padding: 20px;
  border-radius: 8px;
}

.danger-zone h3 {
  color: #c0392b;
  margin-top: 0;
}

.delete-btn {
  background-color: #c0392b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.delete-btn:hover {
  background-color: #a93226;
}
</style>
