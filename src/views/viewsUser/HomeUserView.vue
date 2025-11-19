<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { computed } from 'vue'
  // @ts-ignore: Vue SFC module declaration missing for Footer.vue
  import { useTheme } from '@/composables/useTheme';
  import HeaderClient from '@/components/clientView/headerClient.vue';

  const { isDark } = useTheme();
</script>

<template>
  <HeaderClient />
  <h1>Esta es la pagina que recibe al usuario iniciado</h1>
</template>
