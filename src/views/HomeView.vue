<script setup lang="ts">
import { RouterLink } from 'vue-router'
// @ts-ignore: Vue SFC module declaration missing for Footer.vue
import Footer from '@/components/shared/Footer.vue'
import HeaderHomeView from '@/components/homeView/headerHomeView.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-linear-to-br from-[#17252A] via-[#1a2f35] to-[#17252A] text-[#FEFFFF] overflow-hidden">
    <!-- Header -->
    <HeaderHomeView />

    <!-- Hero Section -->
    <main class="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-16 xl:px-24 2xl:px-32 py-8 sm:py-12 lg:py-16 relative">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3AAFA9] rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2B7A78] rounded-full opacity-5 blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="max-w-7xl w-full mx-auto space-y-8 sm:space-y-12 lg:space-y-16 relative z-10">
        <!-- Hero Content -->
        <div class="text-center space-y-6">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-[#2B7A78]/30 backdrop-blur-sm rounded-full border border-[#3AAFA9]/30 mb-4 animate-fade-in">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3AAFA9] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-[#3AAFA9]"></span>
            </span>
            <span class="text-sm text-[#DEF2F1] font-medium">Sistema de Gestión para tu Taller Automotriz</span>
          </div>

          <!-- Hero Title -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight animate-slide-up">
            <span class="bg-linear-to-r from-[#3AAFA9] via-[#DEF2F1] to-[#3AAFA9] bg-clip-text text-transparent">
              Gestiona tu Taller
            </span>
            <br />
            <span class="text-[#FEFFFF]">y tus Clientes</span>
          </h1>

          <!-- Hero Subtitle -->
          <p class="text-[#DEF2F1] max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed animate-slide-up" style="animation-delay: 0.2s;">
            La solución completa para administrar citas, vehículos y clientes de tu servicio técnico de manera 
            <span class="text-[#3AAFA9] font-semibold">eficiente</span>, 
            <span class="text-[#3AAFA9] font-semibold">organizada</span> y <span class="text-[#3AAFA9] font-semibold">profesional</span>.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-slide-up" style="animation-delay: 0.4s;">
            <RouterLink 
              to="/register" 
              class="group px-8 py-4 bg-linear-to-r from-[#3AAFA9] to-[#2B7A78] text-[#17252A] font-bold rounded-xl hover:shadow-xl hover:shadow-[#3AAFA9]/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 text-center relative overflow-hidden"
            >
              <span class="relative z-10">Comienza Ahora</span>
              <div class="absolute inset-0 bg-linear-to-r from-[#DEF2F1] to-[#3AAFA9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </RouterLink>
            <RouterLink 
              to="/login" 
              class="px-8 py-4 border-2 border-[#3AAFA9] text-[#DEF2F1] font-bold rounded-xl hover:bg-[#3AAFA9]/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-center hover:shadow-lg hover:shadow-[#3AAFA9]/30"
            >
              Iniciar Sesión
            </RouterLink>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style="animation-delay: 0.6s;">
          <div class="text-center p-6 bg-[#2B7A78]/20 backdrop-blur-sm rounded-xl border border-[#3AAFA9]/20 hover:border-[#3AAFA9]/50 transition-all duration-300 hover:scale-105">
            <div class="text-3xl sm:text-4xl font-bold text-[#3AAFA9] mb-2">Organizado</div>
            <div class="text-sm text-[#DEF2F1]">Control Total</div>
          </div>
          <div class="text-center p-6 bg-[#2B7A78]/20 backdrop-blur-sm rounded-xl border border-[#3AAFA9]/20 hover:border-[#3AAFA9]/50 transition-all duration-300 hover:scale-105">
            <div class="text-3xl sm:text-4xl font-bold text-[#3AAFA9] mb-2">Eficiente</div>
            <div class="text-sm text-[#DEF2F1]">Ahorra Tiempo</div>
          </div>
          <div class="text-center p-6 bg-[#2B7A78]/20 backdrop-blur-sm rounded-xl border border-[#3AAFA9]/20 hover:border-[#3AAFA9]/50 transition-all duration-300 hover:scale-105">
            <div class="text-3xl sm:text-4xl font-bold text-[#3AAFA9] mb-2">Profesional</div>
            <div class="text-sm text-[#DEF2F1]">Mejor Servicio</div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-slide-up" style="animation-delay: 0.8s;">
          <!-- Feature Card - Clientes -->
          <div class="group bg-linear-to-br from-[#2B7A78] to-[#1f5a58] rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-[#3AAFA9]/20 transition-all duration-500 transform hover:scale-105 border border-[#3AAFA9]/10 hover:border-[#3AAFA9]/30">
            <div class="flex flex-col items-center space-y-4 mb-6">
              <div class="p-4 bg-[#3AAFA9]/20 rounded-2xl group-hover:bg-[#3AAFA9]/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-16 h-16 text-[#3AAFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-[#DEF2F1]">Para Clientes</h3>
              <div class="h-1 w-16 bg-linear-to-r from-[#3AAFA9] to-transparent rounded-full"></div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Agenda citas de manera rápida y sencilla</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Recibe notificaciones sobre el estado de tu vehículo</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Consulta el historial de servicios de tu vehículo</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Accede a la disponibilidad del taller en tiempo real</span>
              </li>
            </ul>
          </div>

          <!-- Feature Card - Mecánicos -->
          <div class="group bg-linear-to-br from-[#2B7A78] to-[#1f5a58] rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-[#3AAFA9]/20 transition-all duration-500 transform hover:scale-105 border border-[#3AAFA9]/10 hover:border-[#3AAFA9]/30">
            <div class="flex flex-col items-center space-y-4 mb-6">
              <div class="p-4 bg-[#3AAFA9]/20 rounded-2xl group-hover:bg-[#3AAFA9]/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg class="w-16 h-16 text-[#3AAFA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-[#DEF2F1]">Para Mecánicos</h3>
              <div class="h-1 w-16 bg-linear-to-r from-[#3AAFA9] to-transparent rounded-full"></div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Gestiona tu agenda y citas de forma eficiente</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Registra y actualiza el estado de los vehículos</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Mantén un historial completo de todos los servicios</span>
              </li>
              <li class="flex items-start group/item hover:translate-x-2 transition-transform duration-200">
                <span class="text-[#3AAFA9] mr-3 text-xl shrink-0 group-hover/item:scale-125 transition-transform">✓</span>
                <span class="text-[#DEF2F1]">Administra tu base de datos de clientes</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- How it works section -->
        <div class="text-center space-y-8 animate-fade-in" style="animation-delay: 1s;">
          <h2 class="text-3xl sm:text-4xl font-bold text-[#DEF2F1]">¿Cómo Funciona?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 space-y-4 hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 mx-auto bg-linear-to-br from-[#3AAFA9] to-[#2B7A78] rounded-full flex items-center justify-center text-2xl font-bold text-[#17252A]">1</div>
              <h3 class="text-xl font-semibold text-[#3AAFA9]">Regístrate</h3>
              <p class="text-[#DEF2F1]">Crea tu cuenta como cliente o administrador del taller</p>
            </div>
            <div class="p-6 space-y-4 hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 mx-auto bg-linear-to-br from-[#3AAFA9] to-[#2B7A78] rounded-full flex items-center justify-center text-2xl font-bold text-[#17252A]">2</div>
              <h3 class="text-xl font-semibold text-[#3AAFA9]">Agenda o Gestiona</h3>
              <p class="text-[#DEF2F1]">Los clientes agendan citas y el taller las organiza</p>
            </div>
            <div class="p-6 space-y-4 hover:scale-105 transition-transform duration-300">
              <div class="w-16 h-16 mx-auto bg-linear-to-br from-[#3AAFA9] to-[#2B7A78] rounded-full flex items-center justify-center text-2xl font-bold text-[#17252A]">3</div>
              <h3 class="text-xl font-semibold text-[#3AAFA9]">Realiza Seguimiento</h3>
              <p class="text-[#DEF2F1]">Monitorea el estado de cada vehículo y servicio</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer companyName="GarageConnect" class="shrink-0" />
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
