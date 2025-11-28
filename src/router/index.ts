import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeUserView from '@/views/viewsUser/HomeUserView.vue'
import HomeAdminView from '@/views/viewsAdmin/HomeAdminView.vue'
import HomeMechanicView from '@/views/viewMechanic/HomeMechanicView.vue'
import AuthView from '@/views/viewsAuth/AuthView.vue'
import RecuperarContraseñaView from '@/views/viewsAuth/RecuperarContraseñaView.vue'
import ConfirmEmailView from '@/components/sessionComponents/ConfirmEmailView.vue'
import UnlockAccount from '@/components/sessionComponents/UnlockAccount.vue'

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
      component: AuthView,
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: HomeUserView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: HomeAdminView,
    },
    {
      path: '/mechanic',
      name: 'mechanic',
      component: HomeMechanicView,
    },
    {
      path: '/auth/reset-password',
      name: 'reset-password',
      component: RecuperarContraseñaView,
    },
    {
      path: '/auth/confirm-email',
      name: 'confirm-email',
      component: ConfirmEmailView,
    },
    { path: '/auth/unlock-account', name: 'unlock-account', component: UnlockAccount },
  ],
})

export default router
