<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>
  <main>
    <HelloWorld msg="Bienvenido!" />
    <nav>
      <RouterLink to="/login">Iniciar Sesión</RouterLink>
    </nav>
  </main>
</template>
