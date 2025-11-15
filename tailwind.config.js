/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Activa el modo oscuro con clase
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta personalizada: negro, rojo y blanco
        dark: {
          bg: '#000000',
          surface: '#1a1a1a',
          card: '#262626',
        },
        light: {
          bg: '#ffffff',
          surface: '#f5f5f5',
          card: '#e5e5e5',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
