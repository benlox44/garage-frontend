<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Bienvenido a Garage Frontend
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Proyecto Vue.js con Tailwind CSS y Vue Router
      </p>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          Características
        </h2>
        <ul class="space-y-2">
          <li class="flex items-center text-gray-600">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Vue.js 3
          </li>
          <li class="flex items-center text-gray-600">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Tailwind CSS
          </li>
          <li class="flex items-center text-gray-600">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Vue Router
          </li>
          <li class="flex items-center text-gray-600">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            Vite
          </li>
        </ul>
      </div>

      <div class="mt-8">
        <router-link
          to="/about"
          class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Ir a About
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
