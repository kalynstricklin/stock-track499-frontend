const AuthRoutes={
  path: '/',
  children: [
    // {
    //   name: 'Account',
    //   path: '/auth/account',
    //   component: () => import('@/views/auth/AccountPage.vue')
    // },
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
  ]

}

export default AuthRoutes;