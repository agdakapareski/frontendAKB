<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL MEJA</h2>
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
        <v-btn color="warning" @click="dialog = true" class="elevation-0 rounded-0">Tambah Meja</v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="mejas" :search="search">
        <template v-slot:[`item.status_meja`]="{ item }">
          <v-chip
              :color="getColor(item.status_meja)"
              dark
              small
          >
            {{ item.status_meja }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editHandler(item)" dark color="warning">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deleteHandler(item.id_menu)" dark color="error">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline">{{ formTitle }} Meja</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nomor_meja"
              label="Nomor Meja"
              required
            ></v-text-field>
            <v-select
              v-model="form.status_meja"
              label="Status Meja"
              :items="item_status"
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
  name: "Meja",
  data() {
    return {
      item_status: ["Tersedia", "Tidak Tersedia"],
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      headers: [
        { text: "Nomor Meja", value: "nomor_meja" },
        { text: "Status Meja", value: "status_meja" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Meja: new FormData(),
      mejas: [],
      form: {
        nomor_meja: null,
        status_meja: null
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    getColor (status_meja) {
      if(status_meja == "Tersedia") return "success"
      else return "error"
    },

    save() {
      this.Meja.append("nomor_meja", this.form.nomor_meja);
      this.Meja.append("status_meja", this.form.status_meja);

      let url = this.$api + "/mejas/";
      this.load = true;
      this.$http
        .post(url, this.Meja, {
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
        nomor_meja: this.form.nomor_meja,
        status_meja: this.form.status_meja,
      };

      var url = this.$api + "/mejas/" + this.editId;
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
      var url = this.$api + "/mejas/" + this.deleteId;
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
      let url = this.$api + "/mejas";
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

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id;
      this.form.nomor_meja = item.nomor_meja;
      this.form.status_meja = item.status_meja;
      this.dialog = true;
    },

    deleteHandler(id) {
      this.deleteId = id;
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
        nomor_meja: null,
        status_meja: null
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
