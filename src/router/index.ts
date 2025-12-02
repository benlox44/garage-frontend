import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
      meta: { requiresAuth: true, role: 'client' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: HomeAdminView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/mechanic',
      name: 'mechanic',
      component: HomeMechanicView,
      meta: { requiresAuth: true, role: 'mechanic' }
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    // Aquí se podría agregar lógica para verificar roles
    // if (to.meta.role && authStore.user?.role !== to.meta.role) ...
    next()
  }
})

export default router
