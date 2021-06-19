<template>
  <v-main>
    <!-- TABEL BERISI DATA -->
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL PEGAWAI</h2>
      </v-card-title>
      <v-card-title class="pt-0">
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          @click="dialog = true"
          class="elevation-0 rounded-0"
          >Tambah Pegawai</v-btn
        >
      </v-card-title>
      <v-data-table :headers="headers" :items="pegawais" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editHandler(item)"
            dark
            color="warning"
            >mdi-pencil</v-icon
          >
          <v-icon small @click="nonaktifHandler(item)" dark color="error"
            >mdi-account-cancel</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG TAMBAH/UPDATE PEGAWAI -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Pegawai</v-toolbar-title
          >
        </v-toolbar>
        <!-- <v-card-title>
          <span class="headline">{{ formTitle }} Pegawai</span>
        </v-card-title> -->
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
              :items="items_kelamin"
              required
            ></v-select>
            <v-select
              v-model="form.posisi_pegawai"
              label="Posisi Pegawai"
              :items="items_posisi"
              required
            ></v-select>
            <div class="heading">
              Tanggal Bergabung
            </div>
            <v-date-picker
              color="warning"
              v-model="form.tanggal_bergabung"
              label="Tanggal Bergabung"
              :show-current="false"
              full-width
              required
            ></v-date-picker>
            <v-text-field
              v-model="form.status_pegawai"
              label="Status Pegawai"
              required
            ></v-text-field>
            <!-- <v-select
              v-model="form.status_pegawai"
              label="Status Pegawai"
              :items="items_status"
              required
            ></v-select> -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">Batal</v-btn>
          <v-btn color="warning" text @click="setForm">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR STATUS -->
  </v-main>
</template>

<script>
export default {
  name: "Pegawai",
  data() {
    return {
      items_kelamin: ["Laki-Laki", "Perempuan"],
      items_posisi: ["Operational Manager", "Waiter", "Kasir", "Chef"],
      items_status: ["aktif", "nonaktif"],
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
        // { text: "Password", value: "password" },
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
        status_pegawai: "aktif",
      },
      editId: "",
      deleteId: "",
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

      let url = this.$api + "/register/";
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

    nonaktif() {
      let newData = { status_pegawai: this.form.status_pegawai };
      var url = this.$api + "/usersnon/" + this.deleteId;
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

    nonaktifHandler(item) {
      this.deleteId = item.id;
      this.nonaktif();
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
      this.inputType = "Update";
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
        status_pegawai: "aktif",
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
