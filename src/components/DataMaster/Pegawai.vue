<template>
  <v-main>
    <h3 class="text-h3 font-weight-medium mb-5">Pegawai</h3>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="dialog = true"> Tambah Pegawai </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="pegawais" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> Edit </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Pegawai</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_pegawai"
              label="Nama Pegawai"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.email_pegawai"
              label="Email"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              label="Password"
              required
            ></v-text-field>
            <v-select
              v-model="form.kelamin_pegawai"
              label="Jenis Kelamin"
              required
            ></v-select>
            <v-select
              v-model="form.posisi_pegawai"
              label="Posisi Pegawai"
              required
            ></v-select>
            <v-date-picker
              v-model="form.tanggal_bergabung"
              label="Tanggal Bergabung"
              required
            ></v-date-picker>
            <v-select
              v-model="form.status_pegawai"
              label="Status Pegawai"
              required
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="setForm">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  name: "Pegawai",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      headers: [
        { text: "Nama Pegawai", value: "nama_pegawai" },
        { text: "Email Pegawai", value: "email_pegawai" },
        { text: "Password", value: "password" },
        { text: "Jenis Kelamin", value: "kelamin_pegawai" },
        { text: "Posisi", value: "posisi_pegawai" },
        { text: "Tanggal Bergabung", value: "tanggal_bergabung" },
        { text: "Status Pegawai", value: "status_pegawai" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      pegawai: new FormData(),
      pegawais: [],
      form: {
        nama_pegawai: null,
        email_pegawai: null,
        password: null,
        kelamin_pegawai: null,
        posisi_pegawai: null,
        tanggal_bergabung: null,
        status_pegawai: null,
      },
      editId: "",
    };
  },
  methods: {
    save() {
      this.pegawai.append("nama_pegawai", this.form.nama_pegawai);
      this.pegawai.append("email_pegawai", this.form.email_pegawai);
      this.pegawai.append("password", this.form.password);
      this.pegawai.append("kelamin_pegawai", this.form.kelamin_pegawai);
      this.pegawai.append("posisi_pegawai", this.form.posisi_pegawai);
      this.pegawai.append("tanggal_bergabung", this.form.tanggal_bergabung);
      this.pegawai.append("status_pegawai", this.form.status_pegawai);

      let url = this.$api + "/users/";
      this.load = true;
      this.$http
        .post(url, this.pegawai, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData();
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    update() {
      let newData = {
        nama_pegawai: this.form.nama_pegawai,
        email_pegawai: this.form.email_pegawai,
        password: this.form.password,
        kelamin_pegawai: this.form.kelamin_pegawai,
        posisi_pegawai: this.form.posisi_pegawai,
        tanggal_bergabung: this.form.tanggal_bergabung,
        status_pegawai: this.form.status_pegawai,
      };

      var url = this.$api + "/users/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },

    readData() {
      let url = this.$api + "/users";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pegawais = response.data.data;
        });
    },

    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_pegawai = item.nama_pegawai;
      this.form.email_pegawai = item.email_pegawai;
      this.form.password = item.password;
      this.form.kelamin_pegawai = item.kelamin_pegawai;
      this.form.posisi_pegawai = item.posisi_pegawai;
      this.form.tanggal_bergabung = item.tanggal_bergabung;
      this.form.status_pegawai = item.status_pegawai;
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.inputType = "Tambah";
    },

    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },

    resetForm() {
      this.form = {
        nama_pegawai: null,
        email_pegawai: null,
        password: null,
        kelamin_pegawai: null,
        posisi_pegawai: null,
        tanggal_bergabung: null,
        status_pegawai: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },

  mounted() {
    this.readData();
  },
};
</script>
