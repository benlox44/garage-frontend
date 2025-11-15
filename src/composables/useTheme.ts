import { ref, watch, onMounted } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

export function useTheme() {
  const vuetifyTheme = useVuetifyTheme()
  const isDark = ref(true) // Default: tema oscuro

  // Inicializar tema desde localStorage o default
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    isDark.value = savedTheme ? savedTheme === 'dark' : true // Default oscuro
    applyTheme()
  }

  // Aplicar tema
  const applyTheme = () => {
    // Tailwind
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Vuetify
    vuetifyTheme.global.name.value = isDark.value ? 'dark' : 'light'

    // Guardar en localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Toggle tema
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  // Observar cambios
  watch(isDark, applyTheme)

  onMounted(initTheme)

  return {
    isDark,
    toggleTheme,
    applyTheme,
    initTheme
  }
}
