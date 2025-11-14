<template>
    <footer
        class="bg-gradient-to-r from-black via-gray-900 to-black border-t border-red-600/30 py-4 sm:py-6 lg:py-8"
        role="contentinfo"
        :aria-label="`${companyName} footer`"
    >
        <div class="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
            <p class="text-sm sm:text-base lg:text-lg text-gray-300">
                &copy; {{ year }} <span class="text-red-500 font-semibold">{{ companyName }}</span>. Todos los derechos reservados.
            </p>
        </div>
    </footer>
</template>

<script setup>
const props = defineProps({
    companyName: { type: String, default: 'GarageConnect' }
})

const year = new Date().getFullYear()
</script>
