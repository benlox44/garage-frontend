<template>
  <v-container class="container-login">
    <v-form v-model="valid">
      <v-row>
        <v-col md="12" cols="12">
          <v-text-field v-model="email" :rules="nameRules" label="E-mail" required></v-text-field>
          <!-- v-model es la variable en el script-->
        </v-col>

        <v-col md="12" cols="12">
          <v-text-field
            v-model="password"
            type="password"
            :rules="nameRules"
            label="Password"
            required
          ></v-text-field>
        </v-col>
        <v-col md="12" cols="12">
          <v-checkbox v-model="checkbox" v-slot:label required>
            <p>I agree that <strong>garage store</strong> is awesome</p>
          </v-checkbox>
        </v-col>
        <v-col md="12" cols="12">
          <v-btn color="primary">Submit</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    password: '',
    nameRules: [
      (value) => {
        if (value) return true

        return 'Name is required.'
      },
      (value) => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
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
  }),
}
</script>

<style scoped>
.container-login {
  max-width: 400px;
  margin: auto;
  padding-top: 50px;
}
</style>
