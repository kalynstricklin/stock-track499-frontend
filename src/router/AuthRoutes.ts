const AuthRoutes={
  path: '/',
  children: [
    {
      name: 'Account',
      path: '/auth/account',
      component: () => import('@/views/auth/AccountPage.vue')
    }
  ]

}

export default AuthRoutes;