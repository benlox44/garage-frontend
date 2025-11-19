<template>
    <v-footer
        :style="{ 
            background: isDark ? 'linear-gradient(to right, #000000, #1a1a1a, #000000)' : 'linear-gradient(to right, #f3f4f6, #ffffff, #f9fafb)',
            borderTop: isDark ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(220, 38, 38, 0.2)',
            transition: 'all 0.3s'
        }"
        class="py-4 py-sm-6 py-lg-8"
        role="contentinfo"
        :aria-label="`${companyName} footer`"
    >
        <v-container>
            <v-row justify="center">
                <v-col cols="12" class="text-center">
                    <p 
                        :class="[
                            isDark ? 'text-white' : 'text-black',
                            'text-body-2 text-sm-body-1 text-lg-h6'
                        ]"
                    >
                        &copy; {{ year }} <span class="text-red font-weight-semibold">{{ companyName }}</span>. Todos los derechos reservados.
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme';

const { isDark } = useTheme();

const props = defineProps({
    companyName: { type: String, default: 'GarageConnect' }
})

const year = new Date().getFullYear()
</script>
