<template>
  <v-container class="container-forgot-password" align="center">
    <h1 style="margin-bottom: 60px">Restaura tu contraseña, ingresa tu correo!!🤯🤯</h1>
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
  </v-container>
</template>

<script>
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
      //Llamada a axios para recuperar contraseña
      const formData = {
        email: this.email,
      }
      console.log('Formulario válido ✅', formData)
      //comprobar con backend

      try {
        alert('Te llegara un correo ✅')

        // 🔥 Redirigir a la vista de usuario (ruta definida en tu router)
      } catch (error) {
        console.error('El correo es invalido ❌', error)
        alert('El correo es incorrecto 😕')
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
  margin: auto;
}
.btn-forgot-password {
  width: 100%;
  border-radius: 8px;
  background-color: #17252a;
  color: #def2f1;
  transition: 0.25s ease;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.btn-forgot-password:hover {
  background-color: #2b7a78; /* tono más claro del botón */
  transform: translateY(-3px); /* efecto elevar */
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.25);
}
</style>
