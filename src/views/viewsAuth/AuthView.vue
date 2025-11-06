<template>
  <v-container class="container-login" fluid>
    <v-row class="layout-row">
      <!-- PANEL IZQUIERDO -->
      <v-col cols="12" md="6" class="left-panel">
        <v-card class="panel-box" elevation="8" rounded>
          <v-card-title>Garage Storage</v-card-title>
          <v-card-text>Inicia sesión o registrate:</v-card-text>
          <div class="btn-group">
            <v-btn
              class="btn-auth"
              :class="{ active: activeForm === 'login' }"
              @click="activeForm = 'login'"
              >Sign in</v-btn
            >
            <v-btn
              class="btn-auth"
              :class="{ active: activeForm === 'register' }"
              @click="activeForm = 'register'"
              >Sign up</v-btn
            >
          </div>
          <v-card-text class="mt-4"
            >En caso de olvidar contraseña o recuperar tu cuenta:</v-card-text
          >
          <div class="btn-group">
            <v-btn
              class="btn-auth"
              :class="{ active: activeForm === 'forgot' }"
              @click="activeForm = 'forgot'"
              >Forgot your password</v-btn
            >
            <v-btn
              class="btn-auth"
              :class="{ active: activeForm === 'recover' }"
              @click="activeForm = 'recover'"
              >Recover acount</v-btn
            >
          </div>
        </v-card>
      </v-col>

      <!-- PANEL DERECHO DINÁMICO -->
      <v-col cols="12" md="6" class="right-panel">
        <v-sheet class="dynamic-box" elevation="8" rounded>
          <component :is="formMap[activeForm]" />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from '@/components/sessionComponents/LoginForm.vue'
import RegisterForm from '@/components/sessionComponents/RegisterForm.vue'
import RecoverPassword from '@/components/sessionComponents/RecoverPassword.vue'
import RecoverAccount from '@/components/sessionComponents/RecoverAccount.vue'

export default {
  data() {
    return {
      activeForm: 'login',
      formMap: {
        login: LoginForm,
        register: RegisterForm,
        forgot: RecoverPassword,
        recover: RecoverAccount,
      },
    }
  },
}
</script>

<style scoped>
/* Contenedor principal ocupa todo el ancho */
.container-login {
  width: 100%;
  margin: 0;
  padding: 0;
}
/* Hace que todo el contenido se centre vertical y horizontalmente */
.layout-row {
  min-height: 90vh;
  height: 102vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #17252a;
}

/* Panel izquierdo no cambia posición */
.left-panel {
  padding: 95px;
  display: flex;
  justify-content: center;
}

/* Cajita con padding y tamaño controlado */
/* Cajita principal del panel izquierdo */
.panel-box {
  padding: 40px;
  width: 500px;
  text-align: center;
  background-color: #3aafa9;
  color: #17252a;
  border-radius: 14px;
}

/* Estilo títulos y textos */
.panel-box .v-card-title {
  font-size: 1.9rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}
/* Grupo de botones con separación uniforme */
.btn-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* para que si el espacio no alcanza hagan salto de línea */
  gap: 10px; /* separación bonita entre botones */
}

.btn-auth {
  flex: 1 1 auto; /* todos con el mismo ancho */
  padding: 10px;
  text-align: center;
  font-weight: 600;
  border-radius: 8px;
  background-color: #17252a;
  color: #def2f1;
  transition: 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn-auth:hover {
  background-color: #2b7a78; /* tono más claro del botón */
  transform: translateY(-3px); /* efecto elevar */
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.25);
}
.btn-auth.active {
  background-color: #2b7a78 !important; /* mismo color que hover */
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.25);
}
/* Panel derecho siempre mantiene proporciones */
.right-panel {
  display: flex;
  justify-content: center;
}

/* Caja que mantendrá el mismo tamaño para todos los formularios */
.dynamic-box {
  padding: 30px;
  width: 100%;
  max-width: 450px;
  height: 450px;
  min-height: 350px; /* <-- controla altura */
}
</style>
