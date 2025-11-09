<template>
  <h1>Registrate ingresando tus datos!!🧐🤖</h1>
  <v-container class="container-register">
    <v-form v-model="valid" ref="form">
      <v-row>
        <v-col md="5" cols="12">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Name"
            variant="solo"
            required
          ></v-text-field>
          <!-- v-model es la variable en el script-->
        </v-col>
        <v-col md="7" cols="12">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            variant="solo"
            required
          ></v-text-field>
          <!-- v-model es la variable en el script-->
        </v-col>

        <v-col md="6" cols="12">
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            label="Password"
            variant="solo"
            required
          ></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field
            v-model="passwordConfirmed"
            type="password"
            :rules="passwordConfirmedRules"
            label="PasswordConfirmed"
            variant="solo"
            required
          ></v-text-field>
        </v-col>
        <v-col md="12" cols="12">
          <v-checkbox v-model="checkbox" :rules="checkboxRules" required>
            <template v-slot:label>
              <span>I agree that <strong>GARAGE STORE</strong> is awesome</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col md="12" cols="12">
          <v-btn class="btn-register" @click="handleSubmit" :disabled="loading">
            <template v-if="loading">
              <v-progress-circular indeterminate size="20"></v-progress-circular>
            </template>
            <template v-else> Registrarse </template>
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
    loading: false,
    name: '',
    nameRules: [
      (value) => {
        if (value) return true
        return 'Name is required.'
      },
    ],
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
      (value) => {
        // Regla para mayúscula, minúscula, número y símbolo
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
        if (regex.test(value)) return true

        return 'Password must include uppercase, lowercase, number, and symbol.'
      },
    ],
    passwordConfirmed: '',
    passwordConfirmedRules: [(value) => !!value || 'Password confirmation is required.'],
    checkbox: false,
    checkboxRules: [(value) => value || 'Debes aceptar para continuar'],
  }),
  methods: {
    async handleSubmit() {
      const isValid = await this.$refs.form.validate()

      if (!isValid.valid) {
        alert('Formulario inválido ❌')
        return
      } else if (this.password !== this.passwordConfirmed) {
        alert('Las contraseñas no coinciden ❌')
        return
      }
      this.loading = true // ⏳ Mostrar spinner
      //Llamada a axios para registrarse e iniciar sesión
      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
      }
      const registroUsuario = await api.register(formData.name, formData.email, formData.password)
      console.log(registroUsuario)
      if (registroUsuario) {
        this.$router.push('/login')
      } else if (!registroUsuario) {
        alert('La cuenta ya esta registrada ‼️‼️')
        this.loading = false // ⏳ Ocultar spinner
        return
      }
      this.loading = false // ⏳ Ocultar spinner
      alert('Registro exitoso, valída la cuenta con tu correo ✅')
    },
  },
}
</script>

<style scoped>
.container-register {
  max-width: 400px;
  margin: auto;
}
.btn-register {
  width: 100%;
  border-radius: 8px;
  background-color: #17252a;
  color: #def2f1;
  transition: 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.btn-register:hover {
  background-color: #2b7a78; /* tono más claro del botón */
  transform: translateY(-3px); /* efecto elevar */
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.25);
}
</style>
