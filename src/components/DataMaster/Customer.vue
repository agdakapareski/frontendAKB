<template>
  <v-main>
    <h3 class="text-h3 font-weight-medium mb-5">Customer</h3>
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
        <v-btn color="warning" @click="dialog = true"> Tambah Customer </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="customers" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)"> Edit </v-btn>
          <v-btn small @click="deleteData">
            delete
          </v-btn>
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
  name: "Customer",
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
        { text: "Nama Customer", value: "nama_customer" },
        { text: "Email Customer", value: "email_customer" },
        { text: "Nomor Telepon", value: "telepon_customer" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      customer: new FormData(),
      customers: [],
      form: {
        nama_customer: null,
        email_customer: null,
        telepon_customer: null,
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
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_customer = item.nama_customer;
      this.form.email_customer = item.email_customer;
      this.form.telepon_customer = item.telepon_customer;
      this.dialog = true;
    },

    deleteHandler(id) {
      this.deleteId = id;
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
        nama_customer: null,
        email_customer: null,
        telepon_customer: null,
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
