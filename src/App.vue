<script setup>
</script>

<template>
  <div id="app">
    <nav class="bg-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-800">Garage</h1>
          </div>
          <div class="flex space-x-4">
            <router-link
              to="/"
              class="text-gray-600 hover:text-blue-500 transition duration-300 font-medium"
              active-class="text-blue-500"
            >
              Home
            </router-link>
            <router-link
              to="/about"
              class="text-gray-600 hover:text-blue-500 transition duration-300 font-medium"
              active-class="text-blue-500"
            >
              About
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
</style>
