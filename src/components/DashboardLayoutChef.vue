<template>
  <div class="dashboard">
    <!-- BAGIAN DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      class="fullheight"
      width="260"
      app
      :items="form"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-layout justify-center>
              <img src="../assets/akb-logo.png" width="160" alt="">
            </v-layout>
          </v-list-item-title>
          <v-list-item-title>
            <v-icon class="mr-3">mdi-account-circle</v-icon> {{ form.email_pegawai }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title
              ><v-icon class="mr-3">{{ item.icon }}</v-icon
              >{{ item.title }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- BAGIAN APP BAR -->
    <v-app-bar app dark color="warning" fixed height="50px" :items="form">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-item class="mr-3">
        <v-toolbar-item-title>{{ form.nama_pegawai }}, {{ form.posisi_pegawai }}</v-toolbar-item-title>
      </v-toolbar-item>
      <v-toolbar-items>
        <v-btn text router @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- ISI KOMPONEN -->
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardLayout",
  data() {
    return {
      drawer: true,
      items: [
        { title: "Dashboard", to: "/chef", icon: "mdi-monitor-dashboard" },
        { title: "Bahan", to: "/bahanChef", icon: "mdi-package" },
        { title: "Pesanan", to: "/pesananChef", icon: "mdi-silverware-fork-knife" },
      ],
      users: [],
      form: {
        nama_pegawai: null,
        email_pegawai: null,
        posisi_pegawai: null,
      }
    };
  },
  methods: {
    logout: function() {
      localStorage.setItem("id", "");
      localStorage.setItem("token", "");
      this.$router.push({ name: "Login" });
    },
    readData() {
      let url = this.$api + "/users/" + localStorage.getItem("id");
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.users = response.data.data;
          this.form.nama_pegawai = this.users.nama_pegawai;
          this.form.email_pegawai = this.users.email_pegawai;
          this.form.posisi_pegawai = this.users.posisi_pegawai;
        });
    },
  },
  mounted() {
    this.readData();
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}
.router {
  text-decoration: none;
  color: rgb(0, 0, 0);
}

.dashboard {
  color: white;
  background-color: gray;
}
</style>
