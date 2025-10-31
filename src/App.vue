<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app class="app-global">
    <v-main>
      <v-container class="container-app">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-global {
}

.container-app {
}
</style>

<!-- 👇 Agrega esto fuera del scoped o en main.css -->
