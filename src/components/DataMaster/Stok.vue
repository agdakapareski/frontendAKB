<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL STOK</h2>
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
          >Tambah Stok</v-btn
        >
      </v-card-title>
      <v-data-table :headers="headers" :items="stoks" :search="search">
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
            class="mr-2"
            small
            @click="deleteHandler(item.id_stok)"
            dark
            color="error"
            >mdi-delete</v-icon
          >
          <v-icon
            small
            class="mr-2"
            @click="historiMasukHandler(item)"
            dark
            color="success"
            >mdi-plus</v-icon
          >
          <v-icon
            small
            class="mr-2"
            @click="historiKeluarHandler(item)"
            dark
            color="error"
            >mdi-minus</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Stok</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-select
              v-model="form.nama_bahan"
              :items="bahans"
              item-text="nama_bahan"
              item-value="nama_bahan"
              label="Nama bahan"
              required
            ></v-select>
            <v-text-field
              v-model="form.jumlah_stok"
              label="Jumlah Stok"
              required
            ></v-text-field>
            <v-select
              v-model="form.unit_stok"
              :items="unit"
              label="Unit"
              required
            ></v-select>
            <!-- <v-text-field
              v-model="form.harga_stok"
              label="Harga"
              required
            ></v-text-field> -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">Batal</v-btn>
          <v-btn color="warning" text @click="setForm">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMasuk" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline">Tambah Stok Masuk</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-date-picker
              color="warning"
              v-model="formHistoriMasuk.tanggal_histori"
              label="Tanggal Histori"
              :show-current="false"
              full-width
              required
            ></v-date-picker>
            <v-text-field
              readonly
              v-model="formHistoriMasuk.nama_bahan"
              label="Nama bahan"
              required
            ></v-text-field>
            <v-text-field
              v-model="formHistoriMasuk.jumlah_stok"
              label="Jumlah Stok"
              required
            ></v-text-field>
            <v-select
              v-model="formHistoriMasuk.unit_stok"
              :items="unit"
              label="Unit"
              required
            ></v-select>
            <v-text-field
              v-model="formHistoriMasuk.harga_stok"
              label="Harga"
              required
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">Batal</v-btn>
          <v-btn color="warning" text @click="saveHistoriMasuk">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogKeluar" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline">Tambah Stok Keluar</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-date-picker
              color="warning"
              v-model="formHistoriKeluar.tanggal_histori"
              label="Tanggal Histori"
              :show-current="false"
              full-width
              required
            ></v-date-picker>
            <v-select
              v-model="formHistoriKeluar.nama_bahan"
              :items="bahans"
              item-text="nama_bahan"
              item-value="nama_bahan"
              label="Nama bahan"
              required
            ></v-select>
            <v-text-field
              v-model="formHistoriKeluar.jumlah_stok"
              label="Jumlah Stok"
              required
            ></v-text-field>
            <v-select
              v-model="formHistoriKeluar.unit_stok"
              :items="unit"
              label="Unit"
              required
            ></v-select>
            <v-select
              v-model="formHistoriKeluar.keterangan"
              :items="keluar"
              label="Keterangan"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel">Batal</v-btn>
          <v-btn color="warning" text @click="saveHistoriKeluar">Simpan</v-btn>
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
  name: "Stok",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      keluar: ["keluar", "buang"],
      dialogMasuk: false,
      dialogKeluar: false,
      unit: ["gram", "ml"],
      headers: [
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Stok", value: "jumlah_stok" },
        { text: "Unit", value: "unit_stok" },
        // { text: "Harga", value: "harga_stok" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Stok: new FormData(),
      Histori: new FormData(),
      stoks: [],
      bahans: [],
      historis: [],
      form: {
        nama_bahan: null,
        jumlah_stok: null,
        unit_stok: null,
        // harga_stok: null
      },
      formHistoriMasuk: {
        tanggal_histori: null,
        nama_bahan: null,
        jumlah_stok: null,
        unit_stok: null,
        harga_stok: null,
      },
      formHistoriKeluar: {
        tanggal_histori: null,
        nama_bahan: null,
        jumlah_stok: null,
        unit_stok: null,
        harga_stok: null,
        keterangan: null,
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.Stok.append("nama_bahan", this.form.nama_bahan);
      this.Stok.append("jumlah_stok", this.form.jumlah_stok);
      this.Stok.append("unit_stok", this.form.unit_stok);

      let url = this.$api + "/stok/";
      this.load = true;
      this.$http
        .post(url, this.Stok, {
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

    saveHistoriMasuk() {
      this.Histori.append(
        "tanggal_histori",
        this.formHistoriMasuk.tanggal_histori
      );
      this.Histori.append("nama_bahan", this.formHistoriMasuk.nama_bahan);
      this.Histori.append(
        "jumlah_stok",
        this.formHistoriMasuk.jumlah_stok.toString()
      );
      this.Histori.append("unit_stok", this.formHistoriMasuk.unit_stok);
      this.Histori.append("harga_stok", this.formHistoriMasuk.harga_stok);

      let url = this.$api + "/histori/";
      this.load = true;
      this.$http.post(url, this.Histori, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      let jumlah =
        parseInt(this.form.jumlah_stok) +
        parseInt(this.formHistoriMasuk.jumlah_stok);

      let newData = {
        nama_bahan: this.formHistoriMasuk.nama_bahan,
        jumlah_stok: jumlah.toString(),
        unit_stok: this.formHistoriMasuk.unit_stok,
      };

      var url2 = this.$api + "/stok/" + this.formHistoriMasuk.nama_bahan;
      this.load = true;
      this.$http
        .put(url2, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.dialogMasuk = false;
          this.readData();
          this.resetFormHistori();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    saveHistoriKeluar() {
      let jumlah =
        parseInt(this.form.jumlah_stok) -
        parseInt(this.formHistoriKeluar.jumlah_stok);
      if (jumlah < 0) {
        this.error_message = "Stok keluar tidak bisa melebihi stok yang ada!";
        this.color = "red";
        this.snackbar = true;
        this.load = false;
      } else {
        let newData = {
          nama_bahan: this.formHistoriKeluar.nama_bahan,
          jumlah_stok: jumlah.toString(),
          unit_stok: this.formHistoriKeluar.unit_stok,
        };

        var url2 = this.$api + "/stok/" + this.formHistoriKeluar.nama_bahan;
        this.load = true;
        this.$http
          .put(url2, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.dialogKeluar = false;
            this.readData();
            this.resetFormHistori();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });

        this.Histori.append(
          "tanggal_histori",
          this.formHistoriKeluar.tanggal_histori
        );
        this.Histori.append("nama_bahan", this.formHistoriKeluar.nama_bahan);
        this.Histori.append("jumlah_stok", this.formHistoriKeluar.jumlah_stok);
        this.Histori.append("unit_stok", this.formHistoriKeluar.unit_stok);
        this.Histori.append("keterangan", this.formHistoriKeluar.keterangan);

        let url = this.$api + "/historiKeluar/";
        this.load = true;
        this.$http.post(url, this.Histori, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
      }
    },

    update() {
      let newData = {
        nama_bahan: this.form.nama_bahan,
        jumlah_stok: this.form.jumlah_stok,
        unit_stok: this.form.unit_stok,
      };

      var url = this.$api + "/stok/" + this.editId;
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
      var url = this.$api + "/stok/" + this.deleteId;
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
      let url = this.$api + "/stok";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.stoks = response.data.data;
        });
    },

    readBahan() {
      var url = this.$api + "/bahans";
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

    historiMasukHandler(item) {
      this.form.jumlah_stok = item.jumlah_stok;
      this.formHistoriMasuk.nama_bahan = item.nama_bahan;
      this.formHistoriMasuk.unit_stok = item.unit_stok;
      this.dialogMasuk = true;
    },

    historiKeluarHandler(item) {
      this.form.jumlah_stok = item.jumlah_stok;
      this.formHistoriKeluar.nama_bahan = item.nama_bahan;
      this.formHistoriKeluar.unit_stok = item.unit_stok;
      this.dialogKeluar = true;
    },

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_stok;
      this.form.nama_bahan = item.nama_bahan;
      this.form.jumlah_stok = item.jumlah_stok;
      this.form.unit_stok = item.unit_stok;
      this.dialog = true;
    },

    deleteHandler(id_stok) {
      this.deleteId = id_stok;
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
      this.dialogMasuk = false;
      this.dialogKeluar = false;
      this.inputType = "Tambah";
    },

    resetForm() {
      this.form = {
        nama_bahan: null,
        jumlah_stok: null,
        unit_stok: null,
      };
    },

    resetFormHistori() {
      this.formHistoriMasuk = {
        tanggal_histori: null,
        nama_bahan: null,
        jumlah_stok: null,
        unit_stok: null,
        harga_stok: null,
        histori: "masuk",
      };
      this.formHistoriKeluar = {
        tanggal_histori: null,
        nama_bahan: null,
        jumlah_stok: null,
        unit_stok: null,
        harga_stok: null,
        histori: null,
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
    this.readBahan();
  },
};
</script>
