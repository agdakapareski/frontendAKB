<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height class="background">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-layout justify-center class="pt-6">
                <img src="../assets/akb-logo-full.png" width="200" alt="" />
              </v-layout>
              <v-card-text class="pt-0 pr-10 pl-10 pb-10">
                <h1 class="pb-4">Login</h1>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                    prepend-icon="mdi-email"
                    label="E-mail"
                    v-model="email_pegawai"
                    :rules="emailRules"
                    v-on:keyup.enter="submit"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-lock"
                    label="Password"
                    v-model="password"
                    :rules="passwordRules"
                    v-on:keyup.enter="submit"
                    required
                  ></v-text-field>
                </v-form>
                <v-btn class="mt-4" color="warning" @click="submit" block>Login</v-btn>
                <!-- <v-btn @click="clear">Clear</v-btn> -->
              </v-card-text>
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
.background {
  background-color: grey;
}

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
          .post(this.$api + '/login', {
            email_pegawai: this.email_pegawai,
            password: this.password,
          })
          .then(response => {
            localStorage.setItem('id', response.data.user.id);
            localStorage.setItem('jabatan', response.data.user.posisi_pegawai);
            localStorage.setItem('token', response.data.access_token);

            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.clear();
            
            var job = localStorage.getItem('jabatan');
            if(job == 'Operational Manager') {
              this.$router.push({
                name: 'DashboardOperational',
              });
            }
            if(job == 'Chef') {
              this.$router.push({
                name: 'DashboardChef',
              });
            }
            if(job == 'Kasir') {
              this.$router.push({
                name: 'DashboardKasir',
              });
            }
          })
          .catch(error => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            localStorage.removeItem("token");
            localStorage.removeItem("id");
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
