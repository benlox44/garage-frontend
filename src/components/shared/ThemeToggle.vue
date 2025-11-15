<template>
  <v-btn
    :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
    @click="toggleTheme"
    variant="text"
    :title="isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
    class="theme-toggle-btn"
  />
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle-btn {
  transition: transform 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}
</style>
