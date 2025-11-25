<template>
  <v-container class="container-login" fluid>
    <!-- Theme Toggle Button -->
    <div class="theme-toggle-wrapper">
      <ThemeToggle />
    </div>

    <v-row class="layout-row">
      <!-- CONTENEDOR CENTRALIZADO -->
      <v-col cols="12" class="center-panel">
        <v-card class="auth-card" elevation="8" rounded>
          <!-- Header del Card -->
          <v-card-title class="card-header">
            <h1 class="title-main">GarageConnect</h1>
            <p class="subtitle-main">Sistema de Gestión Automotriz</p>
          </v-card-title>

          <!-- Tabs de Login/Register -->
          <div class="tabs-container">
            <v-btn
              class="tab-btn"
              :class="{ active: activeForm === 'login' }"
              @click="activeForm = 'login'"
              variant="text"
            >
              <v-icon left>mdi-login</v-icon>
              Iniciar Sesión
            </v-btn>
            <v-btn
              class="tab-btn"
              :class="{ active: activeForm === 'register' }"
              @click="activeForm = 'register'"
              variant="text"
            >
              <v-icon left>mdi-account-plus</v-icon>
              Registrarse
            </v-btn>
          </div>

          <!-- Contenedor del Formulario -->
          <v-card-text class="form-container">
            <component
              :is="formMap[activeForm]"
              @login-failed="handleLoginFailed"
              @account-blocked="showRecoverAccount"
              @forgot-password="activeForm = 'forgot'"
            />

            <!-- Botón de Recuperar Cuenta (solo si está bloqueado) -->
            <div v-if="isAccountBlocked" class="recover-account-section">
              <v-alert type="warning" variant="tonal" class="mb-4">
                <strong>Cuenta bloqueada</strong><br />
                Tu cuenta ha sido bloqueada por múltiples intentos fallidos.
              </v-alert>
              <v-btn
                class="btn-recover"
                @click="activeForm = 'recover'"
                color="error"
                variant="outlined"
                block
              >
                <v-icon left>mdi-account-lock-open</v-icon>
                Recuperar mi Cuenta
              </v-btn>
            </div>
          </v-card-text>

          <!-- Formulario de Recuperación (Modal/Overlay) -->
          <v-dialog v-model="showForgotPassword" max-width="500px">
            <v-card>
              <v-card-title class="dialog-title">
                <v-icon left color="error">mdi-lock-reset</v-icon>
                Recuperar Contraseña
                <v-btn icon variant="text" @click="showForgotPassword = false" class="close-btn">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <RecoverPassword @close="showForgotPassword = false" />
              </v-card-text>
            </v-card>
          </v-dialog>

          <!-- Formulario de Recuperar Cuenta (Modal/Overlay) -->
          <v-dialog v-model="showRecoverAccountDialog" max-width="500px">
            <v-card>
              <v-card-title class="dialog-title">
                <v-icon left color="error">mdi-account-lock-open</v-icon>
                Recuperar Cuenta Bloqueada
                <v-btn
                  icon
                  variant="text"
                  @click="showRecoverAccountDialog = false"
                  class="close-btn"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <RecoverAccount @close="showRecoverAccountDialog = false" />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '@/components/sessionComponents/LoginForm.vue'
import RegisterForm from '@/components/sessionComponents/RegisterForm.vue'
import RecoverPassword from '@/components/sessionComponents/RecoverPassword.vue'
import RecoverAccount from '@/components/sessionComponents/RecoverAccount.vue'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'

export default {
  components: {
    ThemeToggle,
    RecoverPassword,
    RecoverAccount,
  },
  data() {
    return {
      activeForm: 'login',
      isAccountBlocked: false,
      showForgotPassword: false,
      showRecoverAccountDialog: false,
      formMap: {
        login: LoginForm,
        register: RegisterForm,
      },
    }
  },
  watch: {
    activeForm(newVal) {
      if (newVal === 'forgot') {
        this.showForgotPassword = true
        this.activeForm = 'login'
      } else if (newVal === 'recover') {
        this.showRecoverAccountDialog = true
        this.activeForm = 'login'
      }
    },
  },
  methods: {
    handleLoginFailed() {
      // Aquí puedes agregar lógica adicional cuando falla el login
    },
    showRecoverAccount() {
      this.isAccountBlocked = true
    },
  },
}
</script>

<style scoped>
/* Contenedor principal */
.container-login {
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Theme toggle */
.theme-toggle-wrapper {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 1000;
}

/* Layout centrado */
.layout-row {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #ffffff 100%);
  transition: background 0.3s ease;
  padding: 40px 20px;
}

.dark .layout-row {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
}

.center-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

/* Card principal */
.auth-card {
  width: 100%;
  max-height: 90vh;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border: 2px solid rgba(220, 38, 38, 0.3);
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.2);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dark .auth-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
  border: 2px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.2);
}

/* Header del card */
.card-header {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  text-align: center;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.title-main {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle-main {
  font-size: 0.95rem;
  opacity: 0.95;
  margin: 0;
  font-weight: 500;
}

/* Tabs */
.tabs-container {
  display: flex;
  border-bottom: 2px solid rgba(220, 38, 38, 0.2);
  background: rgba(245, 245, 245, 0.5);
}

.dark .tabs-container {
  border-bottom: 2px solid rgba(239, 68, 68, 0.2);
  background: rgba(26, 26, 26, 0.5);
}

.tab-btn {
  flex: 1;
  padding: 16px 20px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 0;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #000000;
}

.tab-btn.active {
  background: rgba(220, 38, 38, 0.2);
  color: #000000;
  border-bottom: 3px solid #dc2626;
}

.dark .tab-btn {
  color: rgba(255, 255, 255, 0.6);
}

.dark .tab-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ffffff;
}

.dark .tab-btn.active {
  background: rgba(239, 68, 68, 0.2);
  color: #ffffff;
  border-bottom: 3px solid #ef4444;
}

/* Contenedor del formulario */
.form-container {
  padding: 40px 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

/* Sección de recuperar cuenta */
.recover-account-section {
  margin-top: 30px;
  padding: 20px;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-recover {
  margin-top: 10px;
}

/* Estilos de diálogo */
.dialog-title {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}

.close-btn {
  margin-left: auto;
}

/* RESPONSIVE */
@media (min-width: 768px) {
  .theme-toggle-wrapper {
    top: 20px;
    right: 20px;
  }

  .center-panel {
    max-width: 700px;
  }

  .card-header {
    padding: 40px 30px;
  }

  .title-main {
    font-size: 2.5rem;
  }

  .subtitle-main {
    font-size: 1.1rem;
  }

  .form-container {
    padding: 50px 40px;
  }

  .tab-btn {
    padding: 20px 30px;
  }
}

@media (max-width: 480px) {
  .theme-toggle-wrapper {
    top: 10px;
    right: 10px;
    scale: 0.9;
  }

  .layout-row {
    padding: 15px;
  }

  .card-header {
    padding: 25px 15px;
  }

  .title-main {
    font-size: 1.6rem;
  }

  .subtitle-main {
    font-size: 0.85rem;
  }

  .form-container {
    padding: 30px 20px;
    justify-content: flex-start;
  }

  .tab-btn {
    padding: 14px 10px;
    font-size: 0.85rem;
  }

  .forgot-password-link {
    margin-top: 15px;
  }

  .link-text {
    font-size: 0.85rem;
  }
}
</style>
