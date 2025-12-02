import { io, type Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    if (this.socket) {
      this.socket.disconnect()
    }

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: {
        token,
      },
      transports: ['websocket'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      // Connected
    })

    this.socket.on('disconnect', () => {
      // Disconnected
    })

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión Socket.io:', err)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event)
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }
}

export default new SocketService()
