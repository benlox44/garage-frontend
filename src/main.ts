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

// Temas personalizados con paleta negro, rojo y blanco
const lightTheme = {
  dark: false,
  colors: {
    primary: '#DC2626', // rojo-600
    secondary: '#1F2937', // gris-800
    accent: '#EF4444', // rojo-500
    error: '#B91C1C', // rojo-700
    info: '#3B82F6', // azul-500
    success: '#10B981', // verde-500
    warning: '#F59E0B', // ámbar-500
    background: '#FFFFFF', // blanco
    surface: '#F5F5F5', // gris-100
  }
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#EF4444', // rojo-500
    secondary: '#1F2937', // gris-800
    accent: '#DC2626', // rojo-600
    error: '#B91C1C', // rojo-700
    info: '#3B82F6', // azul-500
    success: '#10B981', // verde-500
    warning: '#F59E0B', // ámbar-500
    background: '#000000', // negro
    surface: '#1A1A1A', // gris-900
  }
}

// Crear instancia
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark', // Tema por defecto oscuro
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
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
