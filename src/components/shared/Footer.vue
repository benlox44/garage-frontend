<template>
    <footer
        class="bg-[#2B7A78] py-4 sm:py-6 lg:py-8"
        role="contentinfo"
        :aria-label="`${companyName} footer`"
    >
        <div class="container mx-auto px-4 sm:px-6 lg:px-12 text-center text-[#DEF2F1]">
            <p class="text-sm sm:text-base lg:text-lg">
                &copy; {{ year }} {{ companyName }}. Todos los derechos reservados.
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
