import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
})

// ⬇️ Interceptor para agregar el token automáticamente
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
    console.log('Registrando usuario:', { name, email, password })
    try {
      const response = await http.post('/auth', { name, email, password })
      console.log('Respuesta del registro:', response.data)
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
  async createAppointment(appointmentData: {mechanicId: number, vehicleId: number, scheduleId: number, hour: string, date: string, description?: string}) {
    try {
      const response = await http.post('/appointments', appointmentData)
      return { success: true, message: response.data.message, appointmentId: response.data.appointmentId }
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

}

export default api
