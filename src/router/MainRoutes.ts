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
    // {
    //   name: 'OrderDetails',
    //   path: '/order/:id',
    //   component: () => import('@/views/OrderDetailView.vue')
    // },
    {
      name: 'Invoice',
      path: '/invoice',
      component: () => import('@/views/InvoiceView.vue')
    },
    {
      name: 'Purchase Order',
      path: '/purchase-order',
      component: () => import('@/views/PurchaseOrderView.vue')
    },
    {
      name: 'Reports',
      path: '/report',
      component: () => import('@/views/ReportView.vue')
    },
    {
      name: 'Roles',
      path: '/roles',
      component: () => import('@/views/admin/RolesView.vue')
    },
    {
      name: 'Users',
      path: '/users',
      component: () => import('@/views/admin/UsersView.vue')
    }
  ]

}

export default MainRoutes;