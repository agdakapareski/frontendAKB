<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL RESERVASI</h2>
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
          >Tambah Reservasi</v-btn
        >
      </v-card-title>
      <v-data-table :headers="headers" :items="reservasis" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editHandler(item)"
            dark
            color="warning"
            >mdi-pencil</v-icon
          >
          <v-icon
            small
            @click="deleteHandler(item.id_reservasi)"
            dark
            color="error"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Reservasi</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="formPegawai.nama_pegawai"
              label="Nama Pegawai"
              readonly
            ></v-text-field>
            <v-select
              v-model="form.nama_customer"
              :items="customers"
              item-text="nama_customer"
              item-value="nama_customer"
              label="Nama Customer"
              required
            ></v-select>
            <v-select
              v-model="form.nomor_meja"
              label="Nomor Meja"
              :items="mejas"
              item-text="nomor_meja"
              item-value="nomor_meja"
              required
            ></v-select>
            <v-date-picker
              color="warning"
              v-model="form.tanggal_reservasi"
              label="Tanggal Reservasi"
              :show-current="false"
              full-width
              required
            ></v-date-picker>
            <v-select
              v-model="form.sesi_reservasi"
              label="Sesi Reservasi"
              :items="sesi"
              required
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">Batal</v-btn>
          <v-btn color="warning" text @click="setForm">Simpan</v-btn>
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
  name: "Reservasi",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      sesi: ["Lunch", "Dinner"],
      headers: [
        { text: "Tanggal Reservasi", value: "tanggal_reservasi" },
        { text: "Nama Customer", value: "nama_customer" },
        { text: "Nomor Meja", value: "nomor_meja" },
        { text: "Sesi", value: "sesi_reservasi" },
        { text: "Staff", value: "nama_pegawai" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Reservasi: new FormData(),
      reservasis: [],
      customers: [],
      mejas: [],
      users: [],
      formPegawai: {
        nama_pegawai: null,
        email_pegawai: null,
        posisi_pegawai: null,
      },
      form: {
        nama_pegawai: "",
        nama_customer: "",
        nomor_meja: null,
        tanggal_reservasi: null,
        sesi_reservasi: null,
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.Reservasi.append("nama_pegawai", this.formPegawai.nama_pegawai);
      this.Reservasi.append("nama_customer", this.form.nama_customer);
      this.Reservasi.append("nomor_meja", this.form.nomor_meja);
      this.Reservasi.append("tanggal_reservasi", this.form.tanggal_reservasi);
      this.Reservasi.append("sesi_reservasi", this.form.sesi_reservasi);

      let url = this.$api + "/reservasi/";
      this.load = true;
      this.$http
        .post(url, this.Reservasi, {
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
        nama_pegawai: this.formPegawai.nama_pegawai,
        nama_customer: this.form.nama_customer,
        nomor_meja: this.form.nomor_meja,
        tanggal_reservasi: this.form.tanggal_reservasi,
        sesi_reservasi: this.form.sesi_reservasi,
      };

      var url = this.$api + "/reservasi/" + this.editId;
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

    deleteData() {
      //mengahapus data
      var url = this.$api + "/reservasi/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
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
      let url = this.$api + "/reservasi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.reservasis = response.data.data;
        });
    },

    readCustomer() {
      var url = this.$api + "/customers";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.customers = response.data.data;
        });
    },

    readMeja() {
      var url = this.$api + "/mejas";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mejas = response.data.data;
        });
    },

    readPegawai() {
      let url = this.$api + "/users/" + localStorage.getItem("id");
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.users = response.data.data;
          this.formPegawai.nama_pegawai = this.users.nama_pegawai;
          this.formPegawai.email_pegawai = this.users.email_pegawai;
          this.formPegawai.posisi_pegawai = this.users.posisi_pegawai;
        });
    },

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_reservasi;
      this.form.nama_pegawai = item.nama_pegawai;
      this.form.nama_customer = item.nama_customer;
      this.form.nomor_meja = item.nomor_meja;
      this.form.tanggal_reservasi = item.tanggal_reservasi;
      this.form.sesi_reservasi = item.sesi_reservasi;
      this.dialog = true;
    },

    deleteHandler(id_reservasi) {
      this.deleteId = id_reservasi;
      this.deleteData();
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
        nama_pegawai: "",
        nama_customer: "",
        nomor_meja: null,
        tanggal_reservasi: null,
        sesi_reservasi: null,
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
    this.readPegawai();
    this.readCustomer();
    this.readMeja();
  },
};
</script>
