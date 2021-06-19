<template>
  <v-main>
    <!-- TABEL DATA -->
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL BAHAN</h2>
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
        <v-btn color="warning" @click="dialog = true" class="elevation-0 rounded-0">Tambah Bahan</v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="bahans" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editHandler(item)" dark color="warning">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deleteHandler(item)" dark color="error">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIALOG TAMBAH/UPDATE -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Bahan</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_bahan"
              label="Nama Bahan"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.serving_size"
              label="Serving Size"
              required
            ></v-text-field>
            <v-select
              v-model="form.satuan_serving"
              label="Satuan Serving"
              :items="satuan"
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

    <!-- SNACKBAR STATUS -->
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
      satuan: ["gram", "ml"],
      search: null,
      dialog: false,
      headers: [
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Serving Size", value: "serving_size" },
        { text: "Satuan Serving", value: "satuan_serving" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      bahan: new FormData(),
      bahans: [],
      form: {
        nama_bahan: "",
        serving_size: null,
        satuan_serving: "",
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.bahan.append("nama_bahan", this.form.nama_bahan);
      this.bahan.append("serving_size", this.form.serving_size);
      this.bahan.append("satuan_serving", this.form.satuan_serving);

      let url = this.$api + "/bahans/";
      this.load = true;
      this.$http
        .post(url, this.bahan, {
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
        nama_bahan: this.form.nama_bahan,
        serving_size: this.form.serving_size,
        satuan_serving: this.form.satuan_serving,
      };

      var url = this.$api + "/bahans/" + this.editId;
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
      var url = this.$api + "/bahans/" + this.deleteId;
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
      let url = this.$api + "/bahans";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahans = response.data.data;
        });
    },

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id;
      this.form.nama_bahan = item.nama_bahan;
      this.form.serving_size = item.serving_size;
      this.form.satuan_serving = item.satuan_serving;
      this.dialog = true;
    },

    deleteHandler(item) {
      this.deleteId = item.id;
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
        nama_bahan: "",
        serving_size: null,
        satuan_serving: "",
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
