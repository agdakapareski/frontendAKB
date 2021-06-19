import Vue from "vue";
import VueRouter from "vue-router";
import DashboardLayout from "./components/DashboardLayout.vue";
import Login from "./components/Login.vue";
import Pegawai from "./components/DataMaster/Pegawai.vue";
import Menu from "./components/DataMaster/Menu.vue";
import Meja from "./components/DataMaster/Meja.vue";
import Customer from "./components/DataMaster/Customer.vue";
import Pesanan from "./components/DataMaster/Pesanan.vue";
import Transaksi from "./components/DataMaster/Transaksi.vue";
import Bahan from "./components/DataMaster/Bahan.vue";
import Reservasi from "./components/DataMaster/Reservasi.vue";
import DashboardOperational from "./components/Dashboard/DashboardOperational.vue";
import DashboardLayoutChef from "./components/DashboardLayoutChef.vue";
import DashboardChef from "./components/Dashboard/DashboardChef.vue";
import DashboardLayoutKasir from "./components/DashboardLayoutKasir.vue";
import DashboardKasir from "./components/Dashboard/DashboardKasir.vue";
import Stok from "./components/DataMaster/Stok.vue";
import Histori from "./components/DataMaster/Histori.vue";
import HistoriKeluar from "./components/DataMaster/HistoriKeluar.vue";
import Kartu from "./components/DataMaster/Kartu.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "/operational",
          name: "DashboardOperational",
          meta: { title: "Dashboard Operational Manager" },
          component: DashboardOperational
        },
        {
          path: "/pegawai",
          name: "Pegawai",
          meta: { title: "Pegawai" },
          component: Pegawai,
        },
        {
          path: "/customer",
          name: "Customer",
          meta: { title: "Customer" },
          component: Customer,
        },
        {
          path: "/menu",
          name: "Menu",
          meta: { title: "Menu" },
          component: Menu,
        },
        {
          path: "/bahan",
          name: "Bahan",
          meta: { title: "Bahan" },
          component: Bahan,
        },
        {
          path: "/meja",
          name: "Meja",
          meta: { title: "Meja" },
          component: Meja,
        },
        {
          path: "/pesanan",
          name: "Pesanan",
          meta: { title: "Pesanan" },
          component: Pesanan,
        },
        {
          path: "/transaksi",
          name: "Transaksi",
          meta: { title: "Transaksi" },
          component: Transaksi,
        },
        {
          path: "/reservasi",
          name: "Reservasi",
          meta: { title: "Reservasi" },
          component: Reservasi,
        },
        {
          path: "/stok",
          name: "Stok",
          meta: { title: "Stok" },
          component: Stok,
        },
        {
          path: "/histori",
          name: "Histori",
          meta: { title: "Histori" },
          component: Histori,
        },
        {
          path: "/historiKeluar",
          name: "Histori Keluar",
          meta: { title: "Histori Keluar" },
          component: HistoriKeluar,
        },
        {
          path: "/kartu",
          name: "Kartu",
          meta: { title: "Kartu" },
          component: Kartu,
        },
      ],
    },
    {
      path: "/dashboardChef",
      component: DashboardLayoutChef,
      children: [
        {
          path: "/chef",
          name: "DashboardChef",
          meta: { title: "Dashboard Chef" },
          component: DashboardChef
        },
        {
          path: "/bahanchef",
          name: "Bahan",
          meta: { title: "Bahan" },
          component: Bahan,
        },
        {
          path: "/pesananChef",
          name: "Pesanan",
          meta: { title: "Pesanan" },
          component: Pesanan,
        },
      ],
    },
    {
      path: "/dashboardKasir",
      component: DashboardLayoutKasir,
      children: [
        {
          path: "/kasir",
          name: "DashboardKasir",
          meta: { title: "Dashboard Kasir" },
          component: DashboardKasir
        },
        {
          path: "/reservasiKasir",
          name: "Reservasi",
          meta: { title: "Reservasi" },
          component: Reservasi,
        },
        {
          path: "/transaksiKasir",
          name: "Transaksi",
          meta: { title: "Transaksi" },
          component: Transaksi,
        },
      ],
    },
    {
      path: "/",
      name: "Login",
      meta: { title: "Login" },
      component: Login,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  document.title = to.meta.title;
  next();
});

export default router;
