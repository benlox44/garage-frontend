import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

// Importar Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // ← estilos de los íconos

const app = createApp(App)

// Crear instancia
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi', // ← le decimos a Vuetify qué set usar
    aliases,
    sets: {
      mdi,
    },
  },
})

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
