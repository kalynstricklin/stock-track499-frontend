import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '@/views/DashboardView.vue'
import AccountView from '@/views/AccountView.vue'
import SettingsView from '@/views/SettingsView.vue'
import InventoryView from '@/views/InventoryView.vue'
import { getAuth } from 'firebase/auth'
import OrdersView from '@/views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    { path: '/', redirect: '/AccountView'},
    { path: '/DashboardView', component: DashboardView, meta: {requiresAuth: true} },
    { path: '/OrdersView', component: OrdersView, meta: {requiresAuth: true} },
    { path: '/InventoryView', component: InventoryView, meta: {requiresAuth: true} },
    { path: '/AccountView', component: AccountView },
    { path: '/SettingsView', component: SettingsView, meta: {requiresAuth: true} },
  ],
});

router.beforeEach(async (to, from, next) =>{
  const auth = getAuth();
  const user = auth.currentUser;

  if(to.meta.requiresAuth && !user){
    next({path: "/", query: {redirect: to.fullPath}});
  }else{
    next();
  }
})
export default router;
