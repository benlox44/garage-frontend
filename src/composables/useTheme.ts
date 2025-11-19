import { ref, computed } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

// Estado global compartido
const isDarkRef = ref(true) // Default: tema oscuro
let initialized = false

export function useTheme() {
  const vuetifyTheme = useVuetifyTheme()
  
  // Computed para asegurar reactividad
  const isDark = computed({
    get: () => isDarkRef.value,
    set: (val) => { isDarkRef.value = val }
  })

  // Inicializar tema desde localStorage o default
  const initTheme = () => {
    if (initialized) return
    
    const savedTheme = localStorage.getItem('theme')
    isDarkRef.value = savedTheme ? savedTheme === 'dark' : true // Default oscuro
    applyTheme()
    initialized = true
  }

  // Aplicar tema
  const applyTheme = () => {
    // Tailwind - agregar/remover clase 'dark' en el elemento HTML
    const htmlElement = document.documentElement
    if (isDarkRef.value) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }

    // Vuetify - cambiar tema usando el método correcto
    vuetifyTheme.global.name.value = isDarkRef.value ? 'dark' : 'light'

    // Guardar en localStorage
    localStorage.setItem('theme', isDarkRef.value ? 'dark' : 'light')
  }

  // Toggle tema
  const toggleTheme = () => {
    isDarkRef.value = !isDarkRef.value
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    applyTheme,
    initTheme
  }
}
