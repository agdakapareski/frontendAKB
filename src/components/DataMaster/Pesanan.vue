<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL PESANAN</h2>
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
        <!-- <v-btn color="warning" @click="dialog = true" fab>
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->
      </v-card-title>
      <v-data-table :headers="headers" :items="pesanans" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editHandler(item)" dark color="warning">mdi-pencil</v-icon>
          <v-icon small @click="deleteHandler(item)" dark color="error">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Pesanan</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_customer"
              label="Nama Customer"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.nama_menu"
              label="Nama Menu"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.harga"
              label="Harga"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.jumlah_pesanan"
              label="Jumlah Pesanan"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="form.subtotal"
              label="Subtotal"
              readonly
            ></v-text-field>
            <v-select
              v-model="form.status_pesanan"
              :items="status"
              label="Status Pesanan"
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
  name: "Menu",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      status: ["Sedang Disiapkan", "Diproses", "Ready"],
      headers: [
        { text: "Nama Customer", value: "nama_customer" },
        { text: "Nama Menu", value: "nama_menu" },
        { text: "Harga Menu", value: "harga" },
        { text: "Jumlah Pesanan", value: "jumlah_pesanan" },
        { text: "Subtotal", value: "subtotal" },
        { text: "Status Pesanan", value: "status_pesanan" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Pesanan: new FormData(),
      pesanans: [],
      form: {
        nama_customer: "",
        nama_menu: "",
        harga_menu: null,
        jumlah_pesanan: null,
        subtotal: null,
        status_pesanan: "",
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.Pesanan.append("nama_customer", this.form.nama_customer);
      this.Pesanan.append("nama_menu", this.form.nama_menu);
      this.Pesanan.append("harga", this.form.harga);
      this.Pesanan.append("jumlah_pesanan", this.form.jumlah_pesanan);
      this.Pesanan.append("subtotal", this.form.subtotal);
      this.Pesanan.append("status_pesanan", this.fomr.status_pesanan);

      let url = this.$api + "/pesanan/";
      this.load = true;
      this.$http
        .post(url, this.Pesanan, {
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
        nama_customer: this.form.nama_customer,
        nama_menu: this.form.nama_menu,
        harga: this.form.harga,
        jumlah_pesanan: this.form.jumlah_pesanan,
        subtotal: this.form.subtotal,
        status_pesanan: this.form.status_pesanan,
      };

      var url = this.$api + "/pesanan/" + this.editId;
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
      var url = this.$api + "/pesanan/" + this.deleteId;
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
      let url = this.$api + "/pesanan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.pesanans = response.data.data;
        });
    },

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_detail_transaksi;
      this.form.nama_customer = item.nama_customer;
      this.form.nama_menu = item.nama_menu;
      this.form.harga = item.harga;
      this.form.jumlah_pesanan = item.jumlah_pesanan;
      this.form.subtotal = item.subtotal;
      this.form.status_pesanan = item.status_pesanan;
      this.dialog = true;
    },

    deleteHandler(item) {
      this.deleteId = item.id_detail_transaksi;
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
        nama_customer: "",
        nama_menu: "",
        harga_menu: null,
        jumlah_pesanan: null,
        subtotal: null,
        status_pesanan: "",
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
