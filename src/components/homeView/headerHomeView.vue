<template>
<header class="bg-[#2B7A78] shadow-lg shrink-0">
      <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 sm:w-7 sm:h-7 text-[#DEF2F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-[#FEFFFF]">GarageConnect</h1>
          </div>
          
          <!-- Navigation -->
          <nav class="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <RouterLink 
              to="/login" 
              class="flex-1 sm:flex-none px-3 sm:px-5 py-1.5 sm:py-2 bg-[#3AAFA9] text-[#17252A] font-semibold rounded-lg hover:bg-[#DEF2F1] transition-colors duration-300 text-center text-xs sm:text-sm"
            >
              Iniciar Sesión
            </RouterLink>
            <RouterLink 
              to="/register" 
              class="flex-1 sm:flex-none px-3 sm:px-5 py-1.5 sm:py-2 border-2 border-[#3AAFA9] text-[#DEF2F1] font-semibold rounded-lg hover:bg-[#3AAFA9] hover:text-[#17252A] transition-colors duration-300 text-center text-xs sm:text-sm"
            >
              Registrarse
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>
</template>