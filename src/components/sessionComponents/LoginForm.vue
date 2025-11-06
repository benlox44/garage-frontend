<template>
  <v-container class="container-login">
    <h1 style="margin-bottom: 30px">Inicia sesión en tu cuenta!!👌</h1>
    <v-form v-model="valid" ref="form">
      <v-row>
        <v-col md="12" cols="12">
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          <!-- v-model es la variable en el script-->
        </v-col>

        <v-col md="12" cols="12">
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            label="Password"
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
          <v-btn class="btn-login" @click="handleSubmit">Ingresar</v-btn>
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
    password: '',
    passwordRules: [
      (value) => {
        if (value) return true

        return 'Password is required.'
      },
      (value) => {
        if (value.length >= 6) return true

        return 'Password must be at least 6 characters.'
      },
    ],
    checkbox: false,
    checkboxRules: [(value) => value || 'Debes aceptar para continuar'],
  }),
  methods: {
    async handleSubmit() {
      const isValid = await this.$refs.form.validate()

      if (!isValid.valid) {
        console.log('Formulario inválido ❌')
        return
      }
      //Llamada a axios para iniciar sesión
      const formData = {
        email: this.email,
        password: this.password,
        checkbox: this.checkbox,
      }
      console.log('Formulario válido ✅', formData)
    },
  },
}
</script>

<style scoped>
.container-login {
  max-width: 400px;
  margin: auto;
  padding-top: 50px;
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
