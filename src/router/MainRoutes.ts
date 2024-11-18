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
      name: 'Account',
      path: '/auth/account',
      component: () => import('@/views/auth/AccountPage.vue')
    },
    {
      name: 'InBound Orders',
      path: '/inboundOrders',
      component: () => import('@/views/InBoundsOrdersView.vue')
    },
    {
      name: 'Customer Orders',
      path: '/outboundOrders',
      component: () => import('@/views/CustomerOrdersView.vue')
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
    {
      name: 'Reports',
      path: '/report',
      component: () => import('@/views/ReportView.vue')
    },
    {
      name: 'Suppliers',
      path: '/suppliers',
      component: () => import('@/views/SuppliersView.vue')
    },
    {
      name: 'Users',
      path: '/users',
      component: () => import('@/views/admin/UsersView.vue')
    }
  ]

}

export default MainRoutes;