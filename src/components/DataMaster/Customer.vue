<template>
  <v-main>
    <!-- JUDUL -->
    <h3 class="text-h3 font-weight-medium mb-5">Customer</h3>

    <!-- TABEL DATA -->
    <v-card class="mt-5">
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="dialog = true" fab> <v-icon>mdi-plus</v-icon> </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="customers" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="mr-2" @click="editHandler(item)" dark color="warning">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            class="mr-2"
            @click="deleteHandler(item.id)"
            dark
            color="error"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn @click="showQr(item)" dark color="success">
            <v-icon>mdi-qrcode</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG TAMBAH/UPDATE -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Customer</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_customer"
              label="Nama Customer"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.email_customer"
              label="Email Customer"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.telepon_customer"
              label="Nomor Telepon"
              required
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">Batal</v-btn>
          <v-btn color="warning" text @click="setForm">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG SHOW QR -->
    <v-dialog
      v-model="dialogQr"
      class="text-center"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-layout align-center justify-center>
          <vue-qrcode
            v-bind:value="itemQr.nama_customer"
            errorCorectionLevel="H"
            scale="13"
          />
        </v-layout>
        <div class="ma-5">
          <h2 class="headline text-left mb-3">
            <b> {{ itemQr.nama_customer }}</b>
          </h2>
          <tr>
            <td style="padding-right: 5px">Email</td>
            <td>: {{ itemQr.email_customer }}</td>
          </tr>
          <tr>
            <td style="padding-right: 5px">No. Telepon</td>
            <td>: {{ itemQr.telepon_customer }}</td>
          </tr>
          <!-- <p class="text-left">Email: {{ itemQr.email_customer }}</p>
          <p class="text-left">No. Telepon: {{ itemQr.telepon_customer }}</p> -->
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="closeQr">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR STATUS -->
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
import VueQrcode from "vue-qrcode";

export default {
  name: "Customer",
  components: {
    VueQrcode,
  },
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      dialogQr: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      headers: [
        { text: "Nama Customer", value: "nama_customer" },
        { text: "Email Customer", value: "email_customer" },
        { text: "Nomor Telepon", value: "telepon_customer" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      customer: new FormData(),
      customers: [],
      form: {
        nama_customer: "",
        email_customer: "",
        telepon_customer: "",
      },
      itemQr: {
        id: null,
        nama_customer: "",
        email_customer: "",
        telepon_customer: "",
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.customer.append("nama_customer", this.form.nama_customer);
      this.customer.append("email_customer", this.form.email_customer);
      this.customer.append("telepon_customer", this.form.telepon_customer);

      let url = this.$api + "/customers/";
      this.load = true;
      this.$http
        .post(url, this.customer, {
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
        email_customer: this.form.email_customer,
        telepon_customer: this.form.telepon_customer,
      };

      var url = this.$api + "/customers/" + this.editId;
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
      var url = this.$api + "/customers/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
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
      let url = this.$api + "/customers";
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

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id;
      this.form.nama_customer = item.nama_customer;
      this.form.email_customer = item.email_customer;
      this.form.telepon_customer = item.telepon_customer;
      this.dialog = true;
    },

    deleteHandler(id) {
      this.deleteId = id;
      this.deleteData();
    },

    showQr(item) {
      this.dialogQr = true;
      this.itemQr.nama_customer = item.nama_customer;
      this.itemQr.email_customer = item.email_customer;
      this.itemQr.telepon_customer = item.telepon_customer;
    },

    closeQr() {
      this.dialogQr = false;
      this.inputType = "Tambah";
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
        email_customer: "",
        telepon_customer: "",
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
