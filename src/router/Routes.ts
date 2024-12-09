import AdminManagerLayout from '@/layouts/AdminManagerLayout.vue'
import EmployeeLayout from '@/layouts/EmployeeLayout.vue'
import CustomerLayout from '@/layouts/CustomerLayout.vue'


const SharedRoutes=[
    {
      name: 'Account',
      path: '/auth/account',
      component: () => import('@/views/auth/AccountPage.vue')
    },
    {
      name: 'Inventory',
      path: '/inventory',
      component: () => import('@/views/InventoryView.vue')
    },
]


const Routes = [
  {
    path: '/admin',
    component: AdminManagerLayout,
    meta: {
      requiresAuth: true,
      role: ['admin','manager']
    },
    children: [
      ...SharedRoutes,
      {
        name: 'Users',
        path: '/users',
        component: () => import('@/views/admin/UsersView.vue')
      },
      {
        name: 'Dashboard',
        path: '/dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        name: 'Warehouse Orders',
        path: '/warehouseOrders',
        component: () => import('@/views/InBoundsOrdersView.vue')
      },
      {
        name: 'Customer Orders',
        path: '/orders',
        component: () => import('@/views/CustomerOrdersView.vue')
      },
      {
        name: 'Suppliers',
        path: '/suppliers',
        component: () => import('@/views/SuppliersView.vue')
      },

    ]
  },
  {
    path: '/customer',
    component: CustomerLayout,
    meta: {
      requiresAuth: true,
      role: 'customer'
    },
    children: [
      ...SharedRoutes,
      {
        name: 'Customer Orders',
        path: '/orders',
        component: () => import('@/views/CustomerOrdersView.vue')
      },

    ]
  },
  {
    path: '/employee',
    component: EmployeeLayout,
    meta: {
      requiresAuth: true,
      role: 'employee'
    },
    children: [
      ...SharedRoutes,
      {
        name: 'Dashboard',
        path: '/dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        name: 'Warehouse Orders',
        path: '/warehouseOrders',
        component: () => import('@/views/InBoundsOrdersView.vue')
      },
      {
        name: 'Customer Orders',
        path: '/orders',
        component: () => import('@/views/CustomerOrdersView.vue')
      },
      {
        name: 'Suppliers',
        path: '/suppliers',
        component: () => import('@/views/SuppliersView.vue')
      },
    ]
  },

]


export default Routes;


