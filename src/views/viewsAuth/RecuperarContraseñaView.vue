<template>
  <v-container class="container-reset-password" align="center">
    <h1 class="recover-title">Restablece tu contraseña</h1>
    <v-form v-model="valid" ref="form">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            type="password"
            label="Nueva contraseña"
            variant="solo"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="confirmPassword"
            :rules="confirmPasswordRules()"
            type="password"
            label="Confirmar contraseña"
            variant="solo"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn @click="handleReset" :disabled="loading">
            <template v-if="loading">
              <v-progress-circular indeterminate size="20"></v-progress-circular>
            </template>
            <template v-else> Cambiar contraseña </template>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

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
import Modal from '@/components/shared/Modal.vue'
import api from '@/services/garage-back-api'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: { Modal },
  data: () => ({
    valid: false,
    password: '',
    confirmPassword: '',
    passwordRules: [
      (v) => !!v || 'Contraseña requerida',
      (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
    ],
    confirmPasswordRules() {
      return [
        (v) => !!v || 'Confirmación requerida',
        (v) => v === this.password || 'Las contraseñas no coinciden',
      ]
    },
    loading: false,
    showModal: false,
    modalConfig: { title: '', message: '', type: 'info', showCancel: false },
  }),
  setup() {
    const route = useRoute()
    const router = useRouter()
    const token = route.query.token
    console.log('Token recuperado:', token)
    return { token, router }
  },
  methods: {
    async handleReset() {
      const isValid = await this.$refs.form.validate()
      if (!isValid.valid) return

      if (this.password !== this.confirmPassword) {
        this.showModalMessage('Error', 'Las contraseñas no coinciden', 'error')
        return
      }

      this.loading = true
      try {
        await api.resetPassword(this.token, this.password)
        this.showModalMessage('Éxito', 'Tu contraseña ha sido cambiada correctamente', 'success')
        // Redirigir login después de unos segundos
        setTimeout(() => this.router.push('/login'), 3000)
      } catch (err) {
        console.error(err)
        this.showModalMessage('Error', 'Token inválido o expirado', 'error')
      } finally {
        this.loading = false
      }
    },
    showModalMessage(title, message, type = 'info') {
      this.modalConfig = { title, message, type, showCancel: false }
      this.showModal = true
    },
  },
}
</script>

<style scoped>
.container-reset-password {
  max-width: 400px;
  margin: auto;
  padding: 0 10px;
}
.recover-title {
  margin-bottom: 40px;
  color: #dc2626;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  font-size: 1.2rem;
}
</style>
