import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth'
import AuthRoutes from '@/router/AuthRoutes'
import Routes from '@/router/Routes'


const routes = [
  ...AuthRoutes,
  ...Routes
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

router.beforeEach(async (to, from, next) =>{
  const auth = getAuth();
  const user = auth?.currentUser;


  const publicPage = ['/auth/account']
  const authReq = !publicPage.includes(to.path);


  if(authReq && !user){
    next({path: "/auth/account"});
    // next({path: "/auth/account", query: {redirect: to.fullPath}});
  } else {
    next();
  }

})
export default router;
