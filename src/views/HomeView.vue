<script setup lang="ts">
import { RouterLink } from 'vue-router'
// @ts-ignore: Vue SFC module declaration missing for Footer.vue
import Footer from '@/components/shared/Footer.vue'
import headerHomeView from '@/components/homeView/headerHomeView.vue';

</script>

<template>
  <div class="h-screen bg-[#17252A] flex flex-col overflow-hidden">
    <!-- Header -->
    <header-home-view />

    <!-- Hero Section -->
    <main class="flex-1 flex items-center justify-center px-3 sm:px-4 lg:px-8 py-4 sm:py-6 overflow-y-auto">
      <div class="w-full max-w-7xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-10">
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#FEFFFF] px-2">
          Conectamos Clientes con Mecánicos
        </h2>
        <div class="flex justify-center w-full">
          <p class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#DEF2F1] max-w-4xl px-4 text-center">
            La plataforma ideal para agendar servicios automotrices de manera rápida, segura y profesional
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto px-4">
          <!-- Para Clientes -->
          <div class="bg-[#2B7A78] p-4 sm:p-5 lg:p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-[#3AAFA9] mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <h3 class="text-base sm:text-lg lg:text-xl font-bold text-[#DEF2F1] mb-2 sm:mb-3">Para Clientes</h3>
            <ul class="text-xs sm:text-sm lg:text-base text-[#FEFFFF] space-y-1 sm:space-y-1.5 text-left">
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Recibe notificaciones del mecánico</span>
              </li>
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Agenda citas de manera sencilla</span>
              </li>
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Visualizar estado del vehículo</span>
              </li>
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Revisar agenda del mecánico</span>
              </li>
            </ul>
          </div>

          <!-- Para Mecánicos -->
          <div class="bg-[#2B7A78] p-4 sm:p-5 lg:p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-[#3AAFA9] mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <h3 class="text-base sm:text-lg lg:text-xl font-bold text-[#DEF2F1] mb-2 sm:mb-3">Para Mecánicos</h3>
            <ul class="text-xs sm:text-sm lg:text-base text-[#FEFFFF] space-y-1 sm:space-y-1.5 text-left">
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Gestiona tu agenda de forma eficiente</span>
              </li>
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Amplía tu base de clientes</span>
              </li>
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Registra historial de servicios</span>
              </li>
              <li class="flex items-start">
                <span class="text-[#3AAFA9] mr-2">✓</span>
                <span>Actualizar estado del vehículo</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center items-stretch sm:items-center px-4 max-w-md sm:max-w-none mx-auto">
          <RouterLink 
            to="/register" 
            class="w-full sm:w-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5 lg:py-3 bg-[#3AAFA9] text-[#17252A] font-bold text-sm sm:text-base lg:text-lg rounded-lg hover:bg-[#DEF2F1] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center"
          >
            Comienza Ahora
          </RouterLink>
          <RouterLink 
            to="/login" 
            class="w-full sm:w-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5 lg:py-3 border-2 border-[#DEF2F1] text-[#DEF2F1] font-bold text-sm sm:text-base lg:text-lg rounded-lg hover:bg-[#DEF2F1] hover:text-[#17252A] transition-all duration-300 hover:scale-105 text-center"
          >
            ¿Ya tienes cuenta?
          </RouterLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer companyName="GarageConnect" class="shrink-0" />
  </div>
</template>

<style scoped>
/* Animaciones personalizadas si las necesitas */
</style>
