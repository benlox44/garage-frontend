<script setup lang="ts">
import { RouterLink } from 'vue-router'
// @ts-ignore: Vue SFC module declaration missing for Footer.vue
import Footer from '@/components/shared/Footer.vue'
import HeaderHomeView from '@/components/homeView/headerHomeView.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
    <!-- Header -->
    <HeaderHomeView />

    <!-- Hero Section -->
    <main class="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-32 py-12 sm:py-16 lg:py-24 relative">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-700 rounded-full opacity-10 blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="max-w-7xl w-full mx-auto space-y-16 sm:space-y-20 lg:space-y-24 relative z-10">
        <!-- Hero Content -->
        <div class="text-center space-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 backdrop-blur-sm rounded-full border border-red-600/30 mb-4 animate-fade-in">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span class="text-sm text-white font-medium">Sistema de Gestión para tu Taller Automotriz</span>
          </div>

          <!-- Hero Title -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight animate-slide-up">
            <span class="bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
              Gestiona tu Taller
            </span>
            <br />
            <span class="text-white">y tus Clientes</span>
          </h1>

          <!-- Hero Subtitle -->
          <p class="text-gray-300 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed animate-slide-up" style="animation-delay: 0.2s;">
            La solución completa para administrar citas, vehículos y clientes de tu servicio técnico de manera 
            <span class="text-red-500 font-semibold">eficiente</span>, 
            <span class="text-red-500 font-semibold">organizada</span> y <span class="text-red-500 font-semibold">profesional</span>.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-slide-up" style="animation-delay: 0.4s;">
            <RouterLink 
              to="/login" 
              class="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-center relative overflow-hidden"
            >
              <span class="relative z-10">Comienza Ahora</span>
              <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </RouterLink>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in pt-8" style="animation-delay: 0.6s;">
          <div class="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border-4 border-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
            <div class="text-3xl sm:text-4xl font-bold text-red-500 mb-2">Organizado</div>
            <div class="text-sm text-gray-300">Control Total</div>
          </div>
          <div class="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border-4 border-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
            <div class="text-3xl sm:text-4xl font-bold text-red-500 mb-2">Eficiente</div>
            <div class="text-sm text-gray-300">Ahorra Tiempo</div>
          </div>
          <div class="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border-4 border-red-600/20 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
            <div class="text-3xl sm:text-4xl font-bold text-red-500 mb-2">Profesional</div>
            <div class="text-sm text-gray-300">Mejor Servicio</div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-slide-up pt-8" style="animation-delay: 0.8s;">
          <!-- Feature Card - Clientes -->
          <div class="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-red-600/20 transition-all duration-500 transform hover:scale-105 border-3 border-red-600/20 hover:border-red-600/40 py-6 sm:py-8 lg:py-12">
            <div class="flex flex-col items-center space-y-4 mb-6">
              <div class="p-4 bg-red-600/20 rounded-2xl group-hover:bg-red-600/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">Para Clientes</h3>
              <div class="h-1 w-16 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Agenda citas de manera rápida y sencilla</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Recibe notificaciones sobre el estado de tu vehículo</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Consulta el historial de servicios de tu vehículo</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Accede a la disponibilidad del taller en tiempo real</span>
              </li>
            </ul>
          </div>

          <!-- Feature Card - Mecánicos -->
          <div class="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-red-600/20 transition-all duration-500 transform hover:scale-105 border-3 border-red-600/20 hover:border-red-600/40 py-6 sm:py-8 lg:py-12">
            <div class="flex flex-col items-center space-y-4 mb-6">
              <div class="p-4 bg-red-600/20 rounded-2xl group-hover:bg-red-600/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">Para Mecánicos</h3>
              <div class="h-1 w-16 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Gestiona tu agenda y citas de forma eficiente</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Registra y actualiza el estado de los vehículos</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Mantén un historial completo de todos los servicios</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200 px-5">
                <span class="text-red-500 mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-gray-300">Administra tu base de datos de clientes</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- How it works section -->
        <div class="text-center space-y-12 animate-fade-in pt-8" style="animation-delay: 1s;">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">¿Cómo Funciona?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div class="p-6 space-y-4 hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-600/50">1</div>
              <h3 class="text-xl font-semibold text-red-500">Regístrate</h3>
              <p class="text-gray-300">Crea tu cuenta como cliente o administrador del taller</p>
            </div>
            <div class="p-6 space-y-4 hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-600/50">2</div>
              <h3 class="text-xl font-semibold text-red-500">Agenda o Gestiona</h3>
              <p class="text-gray-300">Los clientes agendan citas y el taller las organiza</p>
            </div>
            <div class="p-6 space-y-4 hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-red-600/50">3</div>
              <h3 class="text-xl font-semibold text-red-500">Realiza Seguimiento</h3>
              <p class="text-gray-300">Monitorea el estado de cada vehículo y servicio</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer companyName="GarageConnect" class="shrink-0 mt-16" />
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
