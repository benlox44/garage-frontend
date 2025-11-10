<script setup lang="ts">
import { RouterLink } from 'vue-router'
// @ts-ignore: Vue SFC module declaration missing for Footer.vue
import headerAdmin from '@/components/adminView/headerAdminView.vue';
</script>


<template>
  <div class="min-h-screen flex flex-col bg-linear-to-br from-[#17252A] via-[#1a2f35] to-[#17252A] text-[#FEFFFF] overflow-hidden">
    <headerAdmin />
    <h1>Esta es la pagina que recibe al admin iniciado</h1>
  </div>
</template>
