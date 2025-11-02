<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
}

.container-app {
}
</style>

