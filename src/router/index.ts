import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeUserView from '@/views/viewsUser/HomeUserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/viewsAuth/AuthView.vue'), // Lazy-loaded
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: HomeUserView,
    },
  ],
})

export default router
