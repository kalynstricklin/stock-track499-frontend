const MainRoutes={
  path: '/',
  meta: {
    requiresAuth: true
  },
  children: [
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      name: 'Orders',
      path: '/orders',
      component: () => import('@/views/OrdersView.vue')
    },
    {
      name: 'Inventory',
      path: '/inventory',
      component: () => import('@/views/InventoryView.vue')
    },
    {
      name: 'Settings',
      path: '/settings',
      component: () => import('@/views/SettingsView.vue')
    },
  ]

}

export default MainRoutes;