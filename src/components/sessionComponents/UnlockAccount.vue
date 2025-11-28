<template>
  <v-container class="container-unlock-account" align="center">
    <h1 class="unlock-title">Restaurando tu cuenta...</h1>

    <Modal
      :show="showModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :type="modalConfig.type"
      :show-cancel="modalConfig.showCancel"
      @close="handleClose"
      @confirm="handleClose"
    />
  </v-container>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'

export default {
  components: { Modal },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const showModal = ref(false)
    const modalConfig = ref({
      title: '',
      message: '',
      type: '',
      showCancel: false,
    })

    const handleClose = () => {
      showModal.value = false
      router.push('/login') // redirige al login
    }

    const unlockAccount = async () => {
      const token = route.query.token
      if (!token) {
        modalConfig.value = {
          title: 'Error',
          message: 'Token inválido o no encontrado.',
          type: 'error',
          showCancel: false,
        }
        showModal.value = true
        return
      }

      try {
        await api.unlockAccount(token)
        modalConfig.value = {
          title: 'Cuenta desbloqueada',
          message: 'Tu cuenta ha sido restaurada correctamente. Ya puedes iniciar sesión.',
          type: 'success',
          showCancel: false,
        }
        showModal.value = true
      } catch (error) {
        modalConfig.value = {
          title: 'Error',
          message: 'El link de recuperación es inválido o ha expirado.',
          type: 'error',
          showCancel: false,
        }
        showModal.value = true
      }
    }

    onMounted(() => {
      unlockAccount()
    })

    return { showModal, modalConfig, handleClose }
  },
}
</script>

<style scoped>
.container-unlock-account {
  max-width: 400px;
  width: 100%;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.unlock-title {
  margin-bottom: 40px;
  color: #dc2626;
  font-size: 1.4rem;
}
</style>
