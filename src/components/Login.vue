<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="warning">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                    prepend-icon="mdi-email"
                    label="E-mail"
                    v-model="email_pegawai"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    label="Password"
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" @click="submit">Login</v-btn>
                <v-btn @click="clear">Clear</v-btn>
              </v-card-actions>
            </v-card>
            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
          </v-snackbar>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>


<style>
@import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
.grey--text {
  font-family: "Jolly Lodger";
}
.posisinya {
  position: absolute;
  top: 20px;
  left: 0px;
  right: 0px;
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      valid: false,
      password: "",
      passwordRules: [(v) => !!v || "Password tidak boleh kosong :("],
      email_pegawai: "",
      emailRules: [(v) => !!v || "E-mail tidak boleh kosong :("],
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.load = true;
        this.$http
          .post(this.$api + "/login", {
            email_pegawai: this.email_pegawai,
            password: this.password,
          })
          .then((response) => {
            localStorage.setItem("id", response.data.user.id);
            localStorage.setItem("token", response.data.access_token);

            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.clear();
            this.$router.push({
              name: "Pegawai",
            });
          })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          localStorage.removeItem("token");
          localStorage.removeItem('id');
          this.load = false;
        });
      }
    },
    clear() {
      this.$refs.form.reset(); //Clear form login
    },
  },
};
</script>
