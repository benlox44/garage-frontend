<template>
  <v-container class="container-login">
    <h1 class="login-title">Inicia sesión en tu cuenta!!👌</h1>
    <v-form v-model="valid" ref="form" class="form-wrapper">
      <v-row justify="center">
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
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            label="Password"
            variant="solo"
            required
          ></v-text-field>
        </v-col>
        <v-col md="12" cols="12" class="checkbox-wrapper">
          <v-checkbox v-model="checkbox" :rules="checkboxRules" required>
            <template v-slot:label>
              <span>Recordar inicio de sesión</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col md="12" cols="12">
          <v-btn class="btn-login" @click="handleSubmit" :disabled="loading">
            <template v-if="loading">
              <v-progress-circular indeterminate size="20"></v-progress-circular>
            </template>
            <template v-else> Ingresar </template>
          </v-btn>
        </v-col>
        <v-col md="12" cols="12" class="forgot-password-wrapper">
          <a @click="$emit('forgot-password')" class="forgot-link">
            <v-icon size="small">mdi-lock-question</v-icon>
            ¿Olvidaste tu contraseña?
          </a>
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
      @confirm="handleConfirm"
    />
  </v-container>
</template>

<script>
import api from '@/services/garage-back-api'
import Modal from '@/components/shared/Modal.vue'

export default {
  components: { Modal },
  emits: ['login-failed', 'account-blocked', 'forgot-password'],
  data() {
    return {
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
      password: '',
      passwordRules: [
        (value) => {
          if (value) return true

          return 'Password is required.'
        },
        (value) => {
          if (value.length >= 8) return true

          return 'Password must be at least 8 characters.'
        },
      ],
      checkbox: false,
      loading: false,
      failedAttempts: 0,
      showModal: false,
      modalConfig: {
        title: '',
        message: '',
        type: 'info',
        showCancel: false,
        action: null
      }
    }
  },
  methods: {
    handleConfirm() {
      if (this.modalConfig.action) {
        this.modalConfig.action()
      } else {
        this.showModal = false
      }
    },
    showModalMessage(title, message, type) {
      this.modalConfig = {
        title,
        message,
        type,
        showCancel: false,
        action: null
      }
      this.showModal = true
    },
    async handleSubmit() {
      const isValid = await this.$refs.form.validate()

      if (!isValid.valid) {
        console.log('Formulario inválido ❌')
        return
      }
      this.loading = true // inicia spinner
      //Llamada a axios para iniciar sesión
      const formData = {
        email: this.email,
        password: this.password,
      }
      console.log('Formulario válido ✅', formData)
      //comprobar con backend

      try {
        const access_login = await api.login(formData.email, formData.password)
        console.log('Respuesta del servidor:', access_login)
        if (access_login == true) {
          console.log('Login exitoso ✅')
          // Redirigir a la vista de usuario (ruta definida en tu router)
          const userData = await api.perfil()
          console.log('Datos del usuario obtenidos', userData.email, userData.name, userData.rol)
          localStorage.setItem('userEmail', userData.email)
          localStorage.setItem('userName', userData.name)
          localStorage.setItem('userRol', userData.rol)
          console.log('Rol del usuario:', userData.rol, typeof userData.rol)
          if (userData.rol == 'ADMIN') {
            this.$router.push('/admin')
          } else if (userData.rol == 'CLIENT') {
            this.$router.push('/usuario')
          } else if (userData.rol == 'MECHANIC') {
            this.$router.push('/mechanic')
          }
        } else {
          this.failedAttempts++
          this.$emit('login-failed')
          
          if (this.failedAttempts >= 3) {
            // Emitir evento de cuenta bloqueada después de 3 intentos
            this.$emit('account-blocked')
            this.showModalMessage('Cuenta Bloqueada', 'Cuenta bloqueada por múltiples intentos fallidos. Por favor, recupera tu cuenta.', 'error')
          } else {
            this.showModalMessage('Error', `Credenciales incorrectas (Intento ${this.failedAttempts}/3)`, 'error')
          }
        }
      } catch (error) {
        console.error('Error de autenticación ❌', error)
        this.failedAttempts++
        this.$emit('login-failed')
        
        // Verificar si el error indica cuenta bloqueada
        if (error.response?.status === 423 || error.response?.data?.message?.includes('bloqueada')) {
          this.$emit('account-blocked')
          this.showModalMessage('Cuenta Bloqueada', 'Tu cuenta está bloqueada. Por favor, utiliza la opción de recuperar cuenta.', 'error')
        } else if (this.failedAttempts >= 3) {
          this.$emit('account-blocked')
          this.showModalMessage('Cuenta Bloqueada', 'Cuenta bloqueada por múltiples intentos fallidos. Por favor, recupera tu cuenta.', 'error')
        } else {
          this.showModalMessage('Error', `Credenciales incorrectas (Intento ${this.failedAttempts}/3)`, 'error')
        }
      } finally {
        this.loading = false // ✅ detener spinner ocurra lo que ocurra
      }
    },
  },
}
</script>

<style scoped>
.container-login {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  margin-bottom: 30px;
  margin-top: 0;
  color: #000000;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.3);
  font-size: 1.4rem;
  text-align: center;
  font-weight: 700;
  width: 100%;
}

.dark .login-title {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.form-wrapper {
  width: 100%;
}

.checkbox-wrapper {
  display: flex;
  justify-content: center;
}

.container-login :deep(.v-row) {
  width: 100%;
  margin: 0;
}

.container-login :deep(.v-col) {
  padding: 8px 12px;
}

.btn-login {
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

.btn-login:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-3px);
  box-shadow: 0px 6px 20px rgba(239, 68, 68, 0.6);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Forgot password link */
.forgot-password-wrapper {
  text-align: center;
  margin-top: 8px;
  margin-bottom: -8px;
}

.forgot-link {
  color: #dc2626;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.forgot-link:hover {
  color: #b91c1c;
  text-decoration: underline;
}

.dark .forgot-link {
  color: #ef4444;
}

.dark .forgot-link:hover {
  color: #dc2626;
}

.container-login :deep(.v-label) {
  color: #1f2937 !important;
}

.container-login :deep(.v-checkbox-label) {
  color: #000000 !important;
}

.dark .container-login :deep(.v-label) {
  color: #e5e5e5 !important;
}

.dark .container-login :deep(.v-checkbox-label) {
  color: #ffffff !important;
}

/* Responsive */
@media (min-width: 768px) {
  .login-title {
    margin-bottom: 30px;
    font-size: 1.5rem;
  }

  .btn-login {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .container-login {
    padding: 0 5px;
  }

  .login-title {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .btn-login {
    padding: 10px;
    font-size: 0.85rem;
    letter-spacing: 1px;
  }

  .container-login :deep(.v-text-field) {
    font-size: 0.9rem;
  }
}
</style>
