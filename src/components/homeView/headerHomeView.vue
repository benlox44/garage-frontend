<template>
  <header class="bg-black/95 backdrop-blur-md shadow-lg shadow-black/50 shrink-0 sticky top-0 z-50 border-b border-red-600/30">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-32 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-3 group">
          <div class="relative">
            <!-- Icon Background Glow -->
            <div class="absolute inset-0 bg-red-600/30 rounded-xl blur-md group-hover:bg-red-600/50 transition-all duration-300"></div>
            <!-- Icon -->
            <div class="relative bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-gray-200 transition-colors duration-300">
              GarageConnect
            </h1>
            <span class="text-[10px] sm:text-xs text-red-500 font-medium tracking-wide">Sistema de Gestión</span>
          </div>
        </RouterLink>

        <SWITCH />

        <!-- Navigation -->
        <nav class="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <RouterLink 
            to="/login" 
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-red-600 text-white font-bold rounded-xl hover:bg-red-600/20 backdrop-blur-sm transition-all duration-300 text-center text-sm sm:text-base hover:scale-105 hover:shadow-lg hover:shadow-red-600/30"
          >
            Iniciar Sesión/Registrarse
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SWITCH from './switch.vue';
</script>

<style scoped>
/* Animación suave para el sticky header */
header {
  transition: all 0.3s ease-in-out;
}
</style>