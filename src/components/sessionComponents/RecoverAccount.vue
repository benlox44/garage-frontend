<template>
  <v-container class="container-forgot-password" align="center">
    <h1 class="recover-title">Restaura tu cuenta, ingresa tu correo!!</h1>
    <v-form v-model="valid" ref="form">
      <v-row>
        <v-col md="12" cols="12">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            variant="solo"
            required
          ></v-text-field>
          <!-- v-model es la variable en el script-->
        </v-col>
        <v-col md="12" cols="12">
          <v-btn class="btn-forgot-password" @click="handleSubmit" :disabled="loading">
            <template v-if="loading">
              <v-progress-circular indeterminate size="20"></v-progress-circular>
            </template>
            <template v-else> Ingresar </template>
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
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'
export default {
  components: {
    Modal,
  },
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      (value) => {
        if (value) return true

        return 'E-mail is required.'
      },
      (value) => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail must be valid.'
      },
    ],
    loading: false,
    showModal: false,
    modalConfig: {
      title: '',
      message: '',
      type: '',
      showCancel: false,
    },
  }),
  methods: {
    async handleSubmit() {
      const isValid = await this.$refs.form.validate()

      if (!isValid.valid) {
        console.log('Formulario inválido ❌')
        return
      }
      this.loading = true // ⏳ inicia spinner
      //Llamada a axios para recuperar contraseña
      const formData = {
        email: this.email,
      }
      //comprobar con backend

      try {
        const respuestaValida = await api.recuperarCuenta(this.email)
        // 🔥 MODAL DE ÉXITO
        this.modalConfig = {
          title: 'Correo enviado',
          message: 'Si tu correo está registrado, te llegará un link para restaurar tu contraseña.',
          type: 'success',
          showCancel: false,
        }
        this.showModal = true

        // 🔥 Redirigir a la vista de usuario (ruta definida en tu router)
      } catch (error) {
        console.error('El correo es invalido ❌', error)
        // 🔥 MODAL DE ERROR
        this.modalConfig = {
          title: 'Error',
          message: 'El correo es incorrecto o no se encuentra registrado.',
          type: 'error',
          showCancel: false,
        }
        this.showModal = true
      } finally {
        this.loading = false // ✅ detener spinner ocurra lo que ocurra
      }
    },
  },
}
</script>

<style scoped>
.container-forgot-password {
  max-width: 400px;
  width: 100%;
  margin: auto;
  padding: 0 10px;
}

.recover-title {
  margin-bottom: 40px;
  color: #dc2626;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  font-size: 1.2rem;
}

.btn-forgot-password {
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: #ffffff;
  transition: 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: none;
  padding: 12px;
  font-size: 0.9rem;
}

.btn-forgot-password:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-3px);
  box-shadow: 0px 6px 20px rgba(239, 68, 68, 0.6);
}

.container-forgot-password :deep(.v-label) {
  color: #e5e5e5 !important;
}

/* Responsive */
@media (min-width: 768px) {
  .recover-title {
    margin-bottom: 60px;
    font-size: 1.4rem;
  }

  .btn-forgot-password {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .container-forgot-password {
    padding: 0 5px;
  }

  .recover-title {
    font-size: 1rem;
    margin-bottom: 30px;
  }

  .btn-forgot-password {
    padding: 10px;
    font-size: 0.85rem;
    letter-spacing: 1px;
  }
}
</style>
