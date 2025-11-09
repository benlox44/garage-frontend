import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeUserView from '@/views/viewsUser/HomeUserView.vue'
import HomeAdminView from '@/views/viewsAdmin/HomeAdminView.vue'
import AuthView from '@/views/viewsAuth/AuthView.vue'
import HomeMechanicView from '@/views/viewMechanic/HomeMechanicView.vue'

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
      component: AuthView, // Lazy-loaded
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: HomeUserView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: HomeAdminView, // Lazy-loaded
    },
    {
      path: '/mechanic',
      name: 'mechanic',
      component: HomeMechanicView, // Lazy-loaded
    },
  ],
})

export default router
