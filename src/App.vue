<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { initTheme } = useTheme()

// Inicializar tema al montar la app
onMounted(() => {
  initTheme()
})
</script>

<template>
  <v-app class="app-global">
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-global {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>

