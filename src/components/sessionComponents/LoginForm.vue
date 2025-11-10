<template>
  <v-container class="container-login">
    <h1 style="margin-bottom: 30px">Inicia sesión en tu cuenta!!👌</h1>
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
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            label="Password"
            variant="solo"
            required
          ></v-text-field>
        </v-col>
        <v-col md="12" cols="12">
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
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import api from '@/services/garage-back-api'

export default {
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
  }),
  methods: {
    async handleSubmit() {
      const isValid = await this.$refs.form.validate()

      if (!isValid.valid) {
        console.log('Formulario inválido ❌')
        return
      }
      this.loading = true // ⏳ inicia spinner
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
          // 🔥 Redirigir a la vista de usuario (ruta definida en tu router)
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
          alert('Credenciales incorrectas 😕')
        }
      } catch (error) {
        console.error('Error de autenticación ❌', error)
        alert('Credenciales incorrectas 😕')
      } finally {
        this.loading = false // ✅ detener spinner ocurra lo que ocurra
      }
    },
  },
}
</script>

<style scoped>
.container-login {
  max-width: 400px;
  margin: auto;
}
.btn-login {
  width: 100%;
  border-radius: 8px;
  background-color: #17252a;
  color: #def2f1;
  transition: 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.btn-login:hover {
  background-color: #2b7a78; /* tono más claro del botón */
  transform: translateY(-3px); /* efecto elevar */
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.25);
}
</style>
