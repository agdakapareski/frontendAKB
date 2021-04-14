import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardLayout from './components/DashboardLayout.vue'
import Login from './components/Login.vue'
import Pegawai from './components/DataMaster/Pegawai.vue'
import Menu from './components/DataMaster/Menu.vue'
import Meja from './components/DataMaster/Meja.vue'
import Customer from './components/DataMaster/Customer.vue'

Vue.use(VueRouter);

const router = new VueRouter ({
  mode: "history",
  routes: [
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "/pegawai",
          name: "Pegawai",
          meta: {title: 'Pegawai'},
          component: Pegawai
        },
        {
          path: "/customer",
          name: "Customer",
          meta: {title: 'Customer'},
          component: Customer
        },
        {
          path: "/menu",
          name: "Menu",
          meta: {title: 'Menu'},
          component: Menu
        },
        {
          path: "/meja",
          name: "Meja",
          meta: {title: 'Meja'},
          component: Meja
        },
      ]
    },
    {
      path: "/",
      name: "Login",
      meta: {title: "Login"},
      component: Login
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  document.title = to.meta.title
  next()
});

export default router;