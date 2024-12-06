const AuthRoutes = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        name: 'Account',
        path: 'account',
        component: () => import('@/views/auth/AccountPage.vue'),
      },
    ],
  },
];

export default AuthRoutes;