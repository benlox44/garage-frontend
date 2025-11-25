import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
})

// ⬇ Interceptor para agregar el token automáticamente
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Ahora creamos el objeto api con métodos
const api = {
  async register(name: string, email: string, password: string) {
    try {
      const response = await http.post('/auth', { name, email, password })
      return true
    } catch (error) {
      console.error('Error en el registro:', error)
      return false
    }
  },
  async login(email: string, password: string) {
    try {
      const response = await http.post('/auth/login', { email, password })
      const token = await response.data.access_token
      if (!token) return false

      localStorage.setItem('token', token)
      return true
    } catch (error) {
      return false
    }
  },

  async perfil() {
    try {
      console.log('Obteniendo datos del perfil')
      const response = await http.get('/users/me')
      const data = {
        email: response.data.data.email,
        name: response.data.data.name,
        rol: response.data.data.role,
      }
      console.log('Datos del perfil procesados:', data)
      return data // ajusta al campo real que devuelva tu backend
    } catch (error) {
      return null
    }
  },
  async recuperarCuenta(email: string) {
    try {
      const response = await http.post('/auth/request-unlock', { email })
      console.log('Respuesta de recuperar cuenta:', response.data)
      return true
    } catch (error) {
      console.error('Error al recuperar cuenta:', error)
      return false
    }
  },

  logout() {
    localStorage.removeItem('token')
  },

  // ===== ADMIN METHODS =====
  async getAllUsers() {
    try {
      const response = await http.get('/users')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return []
    }
  },

  async deleteUser(userId: number) {
    try {
      await http.delete(`/users/${userId}`)
      return true
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      return false
    }
  },

  async updateUserRole(userId: number, newRole: string) {
    try {
      await http.patch(`/users/${userId}/role`, { role: newRole })
      return true
    } catch (error) {
      console.error('Error al actualizar rol:', error)
      return false
    }
  },

  // ===== USER PROFILE METHODS =====
  async updateProfile(data: { name?: string; phone?: string }) {
    try {
      await http.patch('/users/me', data)
      return true
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      return false
    }
  },

  async updatePassword(data: { oldPassword: string; newPassword: string }) {
    try {
      await http.patch('/users/me/password', data)
      return true
    } catch (error) {
      console.error('Error al actualizar contraseña:', error)
      return false
    }
  },

  async deleteMe() {
    try {
      await http.delete('/users/me')
      return true
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      return false
    }
  },

  // ===== WORK ORDERS METHODS =====
  async getClientWorkOrders() {
    try {
      const response = await http.get('/work-orders/client')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener órdenes de trabajo:', error)
      return []
    }
  },

  async getMechanicWorkOrders() {
    try {
      const response = await http.get('/work-orders/mechanic')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener órdenes de trabajo (mecánico):', error)
      return []
    }
  },

  async createWorkOrder(data: any) {
    try {
      const response = await http.post('/work-orders', data)
      return response.data
    } catch (error) {
      console.error('Error al crear orden de trabajo:', error)
      return null
    }
  },

  async getWorkOrderById(id: number) {
    try {
      const response = await http.get(`/work-orders/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener orden de trabajo:', error)
      return null
    }
  },

  async updateWorkOrder(id: number, data: any) {
    try {
      const response = await http.patch(`/work-orders/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error al actualizar orden de trabajo:', error)
      return null
    }
  },

  async addWorkOrderItems(id: number, data: any) {
    try {
      const response = await http.post(`/work-orders/${id}/items`, data)
      return response.data
    } catch (error) {
      console.error('Error al agregar ítems a la orden:', error)
      return null
    }
  },

  async approveWorkOrderItem(itemId: number) {
    try {
      await http.patch(`/work-orders/items/${itemId}/approve`)
      return true
    } catch (error) {
      console.error('Error al aprobar ítem:', error)
      return false
    }
  },

  // ===== APPOINTMENTS MECHANIC METHODS =====
  async getMechanicAppointments() {
    try {
      const response = await http.get('/appointments/mechanic')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener citas (mecánico):', error)
      return []
    }
  },

  async acceptAppointment(id: number) {
    try {
      await http.patch(`/appointments/${id}/accept`)
      return true
    } catch (error) {
      console.error('Error al aceptar cita:', error)
      return false
    }
  },

  async rejectAppointment(id: number, reason: string) {
    try {
      await http.patch(`/appointments/${id}/reject`, { reason })
      return true
    } catch (error) {
      console.error('Error al rechazar cita:', error)
      return false
    }
  },

  async createMechanic(name: string, email: string, password: string) {
    try {
      const response = await http.post('/users/create-mechanic', { name, email, password })
      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('Error al crear mecánico:', error)
      const errorMessage = error.response?.data?.message || 'Error al crear mecánico'
      return { success: false, message: errorMessage }
    }
  },

  // consultar horarios disponibles
  async getAvailableSchedules() {
    try {
      const response = await http.get('/schedules/available')
      return response.data // Ya viene como { data: [...] }
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error)
      return { data: [] }
    }
  },

  //agendar una cita
  async createAppointment(appointmentData: {
    mechanicId: number
    vehicleId: number
    scheduleId: number
    hour: string
    date: string
    description?: string
  }) {
    try {
      const response = await http.post('/appointments', appointmentData)
      return {
        success: true,
        message: response.data.message,
        appointmentId: response.data.appointmentId,
      }
    } catch (error: any) {
      console.error('Error al crear cita:', error)
      const errorMessage = error.response?.data?.message || 'Error al crear cita'
      return { success: false, message: errorMessage }
    }
  },

  //Ver mis citas (Cliente)
  async getMyAppointments() {
    try {
      const response = await http.get('/appointments/client')
      return response.data // Ya viene como { data: [...] }
    } catch (error) {
      console.error('Error al obtener mis citas:', error)
      return { data: [] }
    }
  },

  //Ver detalles de una cita
  async getAppointmentById(appointmentId: number) {
    try {
      const response = await http.get(`/appointments/${appointmentId}`)
      return response.data.data
    } catch (error) {
      console.error('Error al obtener detalles de la cita:', error)
      return null
    }
  },

  //Cancelar una cita
  async cancelAppointment(appointmentId: number) {
    try {
      const response = await http.delete(`/appointments/${appointmentId}`)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('Error al cancelar la cita:', error)
      const errorMessage = error.response?.data?.message || 'Error al cancelar la cita'
      return { success: false, message: errorMessage }
    }
  },

  //Obtener vehículos del cliente
  async getMyVehicles() {
    try {
      const response = await http.get('/users/me/vehicles')
      return response.data // Ya viene como { data: [...] }
    } catch (error) {
      console.error('Error al obtener vehículos:', error)
      return { data: [] }
    }
  },

  // ===== SCHEDULES MECHANIC METHODS =====
  async getMySchedules() {
    try {
      const response = await http.get('/schedules/my')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener mis horarios:', error)
      return []
    }
  },

  async createSchedule(data: { date: string; availableHours: string[] }) {
    try {
      await http.post('/schedules', data)
      return true
    } catch (error) {
      console.error('Error al crear horario:', error)
      return false
    }
  },

  async updateSchedule(id: number, availableHours: string[]) {
    try {
      await http.patch(`/schedules/${id}`, { availableHours })
      return true
    } catch (error) {
      console.error('Error al actualizar horario:', error)
      return false
    }
  },

  async deleteSchedule(id: number) {
    try {
      await http.delete(`/schedules/${id}`)
      return true
    } catch (error) {
      console.error('Error al eliminar horario:', error)
      return false
    }
  },

  // ===== VEHICLES METHODS =====
  async createVehicle(data: { brand: string; model: string; year: number; licensePlate: string }) {
    try {
      const response = await http.post('/users/me/vehicles', data)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('Error al crear vehículo:', error)
      return { success: false, message: error.response?.data?.message || 'Error al crear vehículo' }
    }
  },

  async updateVehicle(
    id: number,
    data: { brand?: string; model?: string; year?: number; licensePlate?: string },
  ) {
    try {
      const response = await http.patch(`/users/me/vehicles/${id}`, data)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('Error al actualizar vehículo:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar vehículo',
      }
    }
  },

  async deleteVehicle(id: number) {
    try {
      const response = await http.delete(`/users/me/vehicles/${id}`)
      return { success: true, message: response.data.message }
    } catch (error: any) {
      console.error('Error al eliminar vehículo:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar vehículo',
      }
    }
  },
}

export default api
