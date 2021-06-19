<template>
  <v-main>
    <h3 class="text-h3 font-weight-medium mb-5">Data Kartu</h3>

    <v-card class="mt-5">
      <v-card-title>
        <v-text-field
            v-model="search"
            prepend-icon="mdi-magnify"
            label="search"
            single-line
            hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="warning" @click="dialog = true" class="elevation-0 rounded-0">Tambah Data Kartu</v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="kartus" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn class="mr-2" @click="editHandler(item)" dark color="warning">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="mr-2" @click="deleteHandler(item)" dark color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline">
            {{ formTitle }} Kartu
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-select
              v-model="form.jenis_kartu"
              label="Jenis Kartu"
              :items="jenisKartu"
              required
            ></v-select>
            <v-text-field
              v-model="form.nama_pemilik_kartu"
              label="Nama Pemilik Kartu"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.nomor_kartu"
              label="Nomor Kartu"
              required
            ></v-text-field>
            <div class="heading">
              Expired Date Kartu
            </div>
            <v-date-picker
                color="warning"
                v-model="form.exp_date_kartu"
                :show-current="false"
                full-width
                required
            ></v-date-picker>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancel">Batal</v-btn>
            <v-btn color="warning" text @click="setForm">Simpan</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  name: "Kartu",
  data() {
    return {
      jenisKartu: ["Kredit", "Debit"],
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      headers: [
        { text: "Jenis Kartu", value: "jenis_kartu" },
        { text: "Nama Pemilik Kartu", value: "nama_pemilik_kartu" },
        { text: "Nomor Kartu", value: "nomor_kartu" },
        { text: "Expired Date Kartu", value: "exp_date_kartu" },
      ],
      kartu: new FormData(),
      kartus: [],
      form: {
        jenis_kartu: "",
        nama_pemilik_kartu: "",
        nomor_kartu: null,
        exp_date_kartu: null,
      },
      editId: "",
      deleteId: ""
    };
  },

  methods: {
    save() {
      this.kartu.append("jenis_kartu", this.form.jenis_kartu);
      this.kartu.append("nama_pemilik_kartu", this.form.nama_pemilik_kartu);
      this.kartu.append("nomor_kartu", this.form.nomor_kartu);
      this.kartu.append("exp_date_kartu", this.form.exp_date_kartu);

      let url = this.$api + "/kartu/";
      this.load = true;
      this.$http
          .post(url, this.kartu, {
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

    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },

    readData() {
      let url = this.$api + "/kartu";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.kartus = response.data.data;
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
}
</script>

<style scoped>

</style>