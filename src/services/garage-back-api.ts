import axios from 'axios'
import type { LoginResponse, User, Vehicle, WorkOrder, Appointment, NotificationPayload } from '@/types/garage'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

// ⬇ Interceptor para agregar el token automáticamente
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ⬇ Interceptor para manejar errores globales (401)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

const api = {
  // ===== AUTH =====
  logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  async login(email: string, password: string) {
    try {
      const response = await http.post<LoginResponse>('/auth/login', { email, password })
      // La respuesta ahora trae { access_token, user } directamente
      return { success: true, data: response.data }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, message }
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      await http.post('/auth/register', { name, email, password })
      return true
    } catch (error) {
      return false
    }
  },

  async requestPasswordReset(email: string) {
    return http.post('/auth/request-password-reset', { email })
  },

  async resetPassword(token: string, newPassword: string) {
    try {
      await http.post('/auth/reset-password', { token, newPassword })
      return true
    } catch (error) {
      return false
    }
  },

  // ===== USERS =====
  async getProfile() {
    try {
      const response = await http.get<{ data: User }>('/users/me')
      return response.data.data
    } catch (error) {
      return null
    }
  },

  // Alias para compatibilidad
  async perfil() {
    return this.getProfile()
  },

  async updateProfile(data: { name?: string; phone?: string }) {
    try {
      await http.patch('/users/me', data)
      return true
    } catch (error) {
      return false
    }
  },

  async updatePassword(data: { currentPassword?: string; newPassword: string }) {
    try {
      await http.patch('/users/me/password', data)
      return true
    } catch (error) {
      return false
    }
  },

  async deleteMe() {
    try {
      await http.delete('/users/me')
      return true
    } catch (error) {
      return false
    }
  },

  // ===== ADMIN =====
  async getAllUsers() {
    try {
      const response = await http.get<{ data: User[] }>('/users')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async deleteUser(userId: number) {
    try {
      await http.delete(`/users/${userId}`)
      return true
    } catch (error) {
      return false
    }
  },

  async updateUserRole(userId: number, role: string) {
    try {
      await http.patch(`/users/${userId}/role`, { role })
      return true
    } catch (error) {
      return false
    }
  },

  async createMechanic(name: string, email: string, password: string) {
    try {
      const response = await http.post('/users/create-mechanic', { name, email, password })
      return { success: true, message: response.data.message }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error' }
    }
  },

  // ===== VEHICLES =====
  async getMyVehicles() {
    try {
      const response = await http.get<{ data: Vehicle[] }>('/users/me/vehicles')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async createVehicle(data: Partial<Vehicle>) {
    try {
      const response = await http.post('/users/me/vehicles', data)
      return { success: true, message: 'Vehículo creado' }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error' }
    }
  },

  async updateVehicle(id: number, data: Partial<Vehicle>) {
    try {
      await http.patch(`/users/me/vehicles/${id}`, data) // Asumiendo endpoint
      return { success: true, message: 'Vehículo actualizado' }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error' }
    }
  },

  async deleteVehicle(id: number) {
    try {
      await http.delete(`/users/me/vehicles/${id}`) // Asumiendo endpoint
      return { success: true, message: 'Vehículo eliminado' }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error' }
    }
  },

  async searchVehicles(query: string) {
    try {
      const response = await http.get<{ data: Vehicle[] }>(`/vehicles/search?query=${query}`)
      return response.data.data
    } catch (error) {
      return []
    }
  },

  // ===== WORK ORDERS =====
  async getClientWorkOrders() {
    try {
      const response = await http.get<{ data: WorkOrder[] }>('/work-orders/client')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async getMechanicWorkOrders() {
    try {
      const response = await http.get<{ data: WorkOrder[] }>('/work-orders/mechanic')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async createWorkOrder(data: any) {
    try {
      const response = await http.post('/work-orders', data)
      return response.data
    } catch (error) {
      return null
    }
  },

  async getWorkOrderById(id: number) {
    try {
      const response = await http.get<{ data: WorkOrder }>(`/work-orders/${id}`)
      return response.data.data
    } catch (error) {
      return null
    }
  },

  async getWorkOrdersByLicensePlate(licensePlate: string) {
    try {
      const response = await http.get<{ data: WorkOrder[] }>(`/work-orders/vehicle/${licensePlate}`)
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async updateWorkOrderStatus(id: number, status: string) {
    return http.patch(`/work-orders/${id}`, { status })
  },

  // Alias
  async updateWorkOrder(id: number, status: string) {
    return this.updateWorkOrderStatus(id, status)
  },

  async addWorkOrderNote(id: number, note: { content: string; imageUrl?: string }) {
    return http.post(`/work-orders/${id}/notes`, note)
  },

  async addWorkOrderItems(id: number, data: any) {
    try {
      const response = await http.post(`/work-orders/${id}/items`, data)
      return response.data
    } catch (error) {
      console.error('Error adding items:', error)
      return null
    }
  },

  async approveWorkOrderItem(itemId: number) {
    try {
      await http.patch(`/work-orders/items/${itemId}/approve`)
      return true
    } catch (error) {
      return false
    }
  },

  // ===== APPOINTMENTS =====
  async createAppointment(data: { mechanicId: number; vehicleId: number; date: string; scheduleId?: number; hour?: string; description?: string }) {
    try {
      const response = await http.post('/appointments', data)
      return { success: true, message: 'Cita creada' }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error' }
    }
  },

  async getMechanicAppointments() {
    try {
      const response = await http.get<{ data: Appointment[] }>('/appointments/mechanic')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async getMyAppointments() {
    try {
      // Asumiendo endpoint para cliente
      const response = await http.get<{ data: Appointment[] }>('/appointments/client')
      return response.data
    } catch (error) {
      return { data: [] }
    }
  },

  async cancelAppointment(id: number) {
    try {
      await http.delete(`/appointments/${id}`)
      return { success: true, message: 'Cita cancelada' }
    } catch (error: any) {
      return { success: false, message: 'Error' }
    }
  },

  async acceptAppointment(id: number) {
    try {
      await http.patch(`/appointments/${id}/accept`)
      return true
    } catch (error) {
      return false
    }
  },

  async rejectAppointment(id: number, reason?: string) {
    try {
      await http.patch(`/appointments/${id}/reject`, { rejectionReason: reason })
      return true
    } catch (error) {
      return false
    }
  },

  // ===== SCHEDULES =====
  async getAvailableSchedules() {
    try {
      const response = await http.get<{ data: any[] }>('/schedules/available')
      return response.data
    } catch (error) {
      return { data: [] }
    }
  },

  async getMySchedules() {
    try {
      const response = await http.get<{ data: any[] }>('/schedules/my')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async createSchedule(data: any) {
    try {
      await http.post('/schedules', data)
      return true
    } catch (error) {
      return false
    }
  },

  async deleteSchedule(id: number) {
    try {
      await http.delete(`/schedules/${id}`)
      return true
    } catch (error) {
      return false
    }
  },

  // ===== NOTIFICATIONS =====
  async getAllNotifications() {
    try {
      const response = await http.get<{ data: NotificationPayload[] }>('/notifications')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async getUnreadNotifications() {
    try {
      const response = await http.get<{ data: NotificationPayload[] }>('/notifications/unread')
      return response.data.data
    } catch (error) {
      return []
    }
  },

  async markNotificationRead(id: number) {
    return http.patch(`/notifications/${id}/read`)
  },

  async deleteNotification(id: number) {
    return http.delete(`/notifications/${id}`)
  }
}

export default api
