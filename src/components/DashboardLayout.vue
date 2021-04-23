<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight" width="256" app dark color="warning">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Atma Korean BBQ </v-list-item-title>
          <v-list-item-subtitle><v-icon>mdi-account</v-icon> Admin Page </v-list-item-subtitle>
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
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app fixed height="67px">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-items>
        <v-btn text router @click="logout">
          <v-icon>mdi-power</v-icon>
          <v-text>Logout</v-text>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
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
        { title: "Pegawai", to: "/pegawai" },
        { title: "Customer", to: "/customer" },
        { title: "Menu", to: "/menu" },
        { title: "Meja", to: "/meja" },
      ],
    };
  },
  methods: {
    logout: function() {
      localStorage.setItem("id", "");
      localStorage.setItem("token", "");
      this.$router.push({ name: "Login" });
    },
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
