<template>
  <v-container class="container-confirm-email" align="center">
    <h1 class="title">Confirmando tu cuenta...</h1>
    <v-progress-circular indeterminate size="50"></v-progress-circular>

    <Modal
      :show="showModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :type="modalConfig.type"
      :show-cancel="modalConfig.showCancel"
      @close="showModal = false"
      @confirm="showModal = false"
    />
  </v-container>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'

export default {
  components: { Modal },
  data: () => ({
    showModal: false,
    modalConfig: { title: '', message: '', type: 'info', showCancel: false },
  }),
  setup() {
    const route = useRoute()
    const router = useRouter()
    const token = route.query.token // Aquí capturamos el token de la query
    return { token, router }
  },
  mounted() {
    this.confirmEmail()
  },
  methods: {
    async confirmEmail() {
      try {
        await api.confirmEmail(this.token) // Llamada al backend
        this.modalConfig = {
          title: 'Cuenta confirmada',
          message: 'Tu correo ha sido validado correctamente',
          type: 'success',
          showCancel: false,
        }
        this.showModal = true
        // Redirigir después de unos segundos
        setTimeout(() => this.router.push('/login'), 3000)
      } catch (err) {
        console.error(err)
        this.modalConfig = {
          title: 'Error',
          message: 'Token inválido o expirado',
          type: 'error',
          showCancel: false,
        }
        this.showModal = true
      }
    },
  },
}
</script>
