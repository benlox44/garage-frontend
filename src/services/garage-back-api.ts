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

  logout() {
    localStorage.removeItem('token')
  },
}

export default api
