<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Acerca de
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Esta es la página About del proyecto Garage Frontend
      </p>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          Información del Proyecto
        </h2>
        <p class="text-gray-600 leading-relaxed">
          Este proyecto utiliza las últimas tecnologías para crear una aplicación web moderna y eficiente.
          Tailwind CSS proporciona utilidades de estilo rápidas y flexibles, mientras que Vue Router
          maneja la navegación de la aplicación de manera fluida.
        </p>
      </div>

      <div class="mt-8">
        <router-link
          to="/"
          class="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Volver al Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
