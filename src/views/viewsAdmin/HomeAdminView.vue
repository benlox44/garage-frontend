<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
// @ts-ignore: Vue SFC module declaration missing for Footer.vue
import headerAdmin from '@/components/adminView/headerAdminView.vue'
import api from '@/services/garage-back-api'

interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'CLIENT' | 'MECHANIC'
  isEmailConfirmed: boolean
  isLocked: boolean
}

const users = ref<User[]>([])
const loading = ref(false)
const refreshing = ref(false)
const showCreateMechanic = ref(false)
const editingUserId = ref<number | null>(null)
const editingRole = ref<string>('')
const lastRefresh = ref<Date | null>(null)

// Form para crear mecánico
const mechanicForm = ref({
  name: '',
  email: '',
  password: '',
})

const roles = ['CLIENT', 'MECHANIC', 'ADMIN']

const loadUsers = async (showSpinner = false) => {
  if (showSpinner) {
    refreshing.value = true
  } else {
    loading.value = true
  }
  
  users.value = await api.getAllUsers()
  lastRefresh.value = new Date()
  
  if (showSpinner) {
    refreshing.value = false
  } else {
    loading.value = false
  }
}

const manualRefresh = async () => {
  await loadUsers(true)
}

const deleteUser = async (userId: number, userName: string) => {
  if (!confirm(`¿Estás seguro de eliminar al usuario "${userName}"?`)) {
    return
  }
  
  const success = await api.deleteUser(userId)
  if (success) {
    alert('✅ Usuario eliminado correctamente')
    await loadUsers()
  } else {
    alert('❌ Error al eliminar el usuario')
  }
}

const startEditRole = (userId: number, currentRole: string) => {
  editingUserId.value = userId
  editingRole.value = currentRole
}

const cancelEditRole = () => {
  editingUserId.value = null
  editingRole.value = ''
}

const saveRole = async (userId: number, userName: string) => {
  if (editingRole.value === users.value.find(u => u.id === userId)?.role) {
    cancelEditRole()
    return
  }

  if (!confirm(`¿Cambiar el rol de "${userName}" a "${editingRole.value}"?`)) {
    cancelEditRole()
    return
  }

  const success = await api.updateUserRole(userId, editingRole.value)
  if (success) {
    alert('✅ Rol actualizado correctamente')
    await loadUsers()
    cancelEditRole()
  } else {
    alert('❌ Error al actualizar el rol')
  }
}

const createMechanic = async () => {
  if (!mechanicForm.value.name || !mechanicForm.value.email || !mechanicForm.value.password) {
    alert('⚠️ Por favor completa todos los campos')
    return
  }

  loading.value = true
  const result = await api.createMechanic(
    mechanicForm.value.name,
    mechanicForm.value.email,
    mechanicForm.value.password
  )

  if (result.success) {
    // Limpiar formulario
    mechanicForm.value = { name: '', email: '', password: '' }
    showCreateMechanic.value = false
    
    // Actualizar lista de usuarios
    await loadUsers(false) // false = mostrar el spinner principal
    
    // Mostrar mensaje de éxito
    alert('✅ ' + result.message + '\n\n⚠️ El mecánico aparece en la lista con "Email sin confirmar". Debe confirmar su email para poder iniciar sesión.')
  } else {
    loading.value = false
    alert('❌ ' + result.message)
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-500/20 text-red-300 border-red-500/50'
    case 'MECHANIC':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
    case 'CLIENT':
      return 'bg-green-500/20 text-green-300 border-green-500/50'
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'Administrador'
    case 'MECHANIC':
      return 'Mecánico'
    case 'CLIENT':
      return 'Cliente'
    default:
      return role
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-linear-to-br from-[#17252A] via-[#1a2f35] to-[#17252A] text-[#FEFFFF] overflow-hidden">
    <headerAdmin />
    
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl sm:text-4xl font-bold text-[#DEF2F1] mb-2">
            Gestión de Usuarios
          </h1>
          <p class="text-[#3AAFA9]">Administra usuarios, roles y permisos del sistema</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            @click="showCreateMechanic = !showCreateMechanic"
            class="px-6 py-3 bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#17252A] font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#3AAFA9]/30"
          >
            {{ showCreateMechanic ? '❌ Cancelar' : '➕ Crear Mecánico' }}
          </button>
        </div>
      </div>

      <!-- Refresh Controls -->
      <div class=" p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <button
            @click="manualRefresh"
            :disabled="refreshing"
            class="px-6 py-3 bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#17252A] border-2 border-[#3AAFA9] rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#3AAFA9]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span :class="refreshing ? 'animate-spin' : ''">🔄</span>
            {{ refreshing ? 'Actualizando...' : 'Actualizar Lista' }}
          </button>
        </div>
        
      </div>

      <!-- Create Mechanic Form -->
      <div
        v-if="showCreateMechanic"
        class="bg-[#2B7A78]/30 backdrop-blur-md border border-[#3AAFA9]/30 rounded-2xl p-6 mb-8 shadow-xl"
      >
        <h2 class="text-2xl font-bold text-[#DEF2F1] mb-4">Crear Nuevo Mecánico</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[#3AAFA9] mb-2 font-semibold">Nombre</label>
            <input
              v-model="mechanicForm.name"
              type="text"
              class="w-full px-4 py-3 bg-[#17252A]/50 border border-[#3AAFA9]/30 rounded-xl text-[#FEFFFF] focus:outline-none focus:border-[#3AAFA9] transition-colors"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label class="block text-[#3AAFA9] mb-2 font-semibold">Email</label>
            <input
              v-model="mechanicForm.email"
              type="email"
              class="w-full px-4 py-3 bg-[#17252A]/50 border border-[#3AAFA9]/30 rounded-xl text-[#FEFFFF] focus:outline-none focus:border-[#3AAFA9] transition-colors"
              placeholder="juan@example.com"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-[#3AAFA9] mb-2 font-semibold">Contraseña</label>
            <input
              v-model="mechanicForm.password"
              type="password"
              class="w-full px-4 py-3 bg-[#17252A]/50 border border-[#3AAFA9]/30 rounded-xl text-[#FEFFFF] focus:outline-none focus:border-[#3AAFA9] transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          @click="createMechanic"
          :disabled="loading"
          class="mt-4 w-full sm:w-auto px-6 py-3 bg-[#3AAFA9] hover:bg-[#2B7A78] text-[#17252A] font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? '⏳ Creando...' : '✅ Crear Mecánico' }}
        </button>
      </div>

      <!-- Users Table -->
      <div class="bg-[#2B7A78]/30 backdrop-blur-md border border-[#3AAFA9]/30 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#2B7A78]/50">
              <tr>
                <th class="px-6 py-4 text-left text-[#DEF2F1] font-bold">ID</th>
                <th class="px-6 py-4 text-left text-[#DEF2F1] font-bold">Nombre</th>
                <th class="px-6 py-4 text-left text-[#DEF2F1] font-bold">Email</th>
                <th class="px-6 py-4 text-left text-[#DEF2F1] font-bold">Rol</th>
                <th class="px-6 py-4 text-left text-[#DEF2F1] font-bold">Estado</th>
                <th class="px-6 py-4 text-center text-[#DEF2F1] font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-8 text-center text-[#3AAFA9]">
                  <div class="flex items-center justify-center gap-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3AAFA9]"></div>
                    <span>Cargando usuarios...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="users.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-[#3AAFA9]">
                  No hay usuarios registrados
                </td>
              </tr>
              <tr
                v-else
                v-for="user in users"
                :key="user.id"
                class="border-t border-[#3AAFA9]/20 hover:bg-[#2B7A78]/20 transition-colors"
              >
                <td class="px-6 py-4 text-[#FEFFFF]">{{ user.id }}</td>
                <td class="px-6 py-4 text-[#FEFFFF] font-medium">{{ user.name }}</td>
                <td class="px-6 py-4 text-[#3AAFA9]">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <!-- Editing Mode -->
                  <div v-if="editingUserId === user.id" class="flex items-center gap-2">
                    <select
                      v-model="editingRole"
                      class="px-3 py-1 bg-[#17252A] border border-[#3AAFA9]/50 rounded-lg text-[#FEFFFF] text-sm focus:outline-none focus:border-[#3AAFA9]"
                    >
                      <option v-for="role in roles" :key="role" :value="role" class="text-black">
                        {{ getRoleLabel(role) }}
                      </option>
                    </select>
                    <button
                      @click="saveRole(user.id, user.name)"
                      class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-colors"
                      title="Guardar"
                    >
                      ✓
                    </button>
                    <button
                      @click="cancelEditRole"
                      class="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-bold transition-colors"
                      title="Cancelar"
                    >
                      ✕
                    </button>
                  </div>
                  <!-- View Mode -->
                  <div v-else class="flex items-center gap-2">
                    <span
                      :class="getRoleBadgeColor(user.role)"
                      class="px-3 py-1 rounded-full text-sm font-semibold border"
                    >
                      {{ getRoleLabel(user.role) }}
                    </span>
                    <button
                      @click="startEditRole(user.id, user.role)"
                      class="px-2 py-1 bg-[#3AAFA9]/20 hover:bg-[#3AAFA9]/40 text-[#3AAFA9] rounded-lg text-xs font-bold transition-colors"
                      title="Editar rol"
                    >
                      ✏️
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <span
                      :class="[
                        user.isEmailConfirmed ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10',
                        'px-2 py-1 rounded-lg transition-all duration-500'
                      ]"
                      class="text-xs font-medium inline-flex items-center gap-1"
                    >
                      <span :class="user.isEmailConfirmed ? '' : 'animate-pulse'">
                        {{ user.isEmailConfirmed ? '✓' : '⚠' }}
                      </span>
                      {{ user.isEmailConfirmed ? 'Email confirmado' : 'Email sin confirmar' }}
                    </span>
                    <span
                      v-if="user.isLocked"
                      class="text-red-400 text-xs font-medium bg-red-500/10 px-2 py-1 rounded-lg inline-flex items-center gap-1"
                    >
                      🔒 Cuenta bloqueada
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="deleteUser(user.id, user.name)"
                      class="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 rounded-lg font-bold transition-all duration-300 hover:scale-105"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div class="bg-[#2B7A78]/30 backdrop-blur-md border border-[#3AAFA9]/30 rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-[#3AAFA9]">{{ users.length }}</div>
          <div class="text-[#DEF2F1] mt-2">Total Usuarios</div>
        </div>
        <div class="bg-[#2B7A78]/30 backdrop-blur-md border border-[#3AAFA9]/30 rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-[#3AAFA9]">
            {{ users.filter(u => u.role === 'MECHANIC').length }}
          </div>
          <div class="text-[#DEF2F1] mt-2">Mecánicos</div>
        </div>
        <div class="bg-[#2B7A78]/30 backdrop-blur-md border border-[#3AAFA9]/30 rounded-xl p-6 text-center">
          <div class="text-3xl font-bold text-[#3AAFA9]">
            {{ users.filter(u => u.role === 'CLIENT').length }}
          </div>
          <div class="text-[#DEF2F1] mt-2">Clientes</div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Animación de pulso para emails sin confirmar */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animación de rotación para el botón de actualizar */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
