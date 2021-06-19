<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL MENU</h2>
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
        <v-btn color="warning" @click="dialog = true" class="elevation-0 rounded-0">Tambah Menu</v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="menus" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editHandler(item)" dark color="warning">mdi-pencil</v-icon>
          <v-icon small @click="deleteHandler(item.id_menu)" dark color="error">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Menu</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_menu"
              label="Nama Menu"
              required
            ></v-text-field>
            <v-select
              v-model="form.id_bahan"
              :items="bahans"
              item-text="nama_bahan"
              item-value="id"
              label="Nama bahan"
              required
            ></v-select>
            <v-select
              v-model="form.kategori_menu"
              label="Kategori Menu"
              :items="items_kategori"
              required
            ></v-select>
            <v-textarea
              v-model="form.deskripsi_menu"
              label="Deskripsi Menu"
              required
            ></v-textarea>
            <v-text-field
              v-model="form.harga"
              label="Harga Menu"
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
      items_kategori: ["Makanan Utama", "Side Dish", "Minuman"],
      headers: [
        { text: "Nama Menu", value: "nama_menu" },
        { text: "Bahan", value: "nama_bahan" },
        { text: "Kategori Menu", value: "kategori_menu" },
        { text: "Deskripsi Menu", value: "deskripsi_menu" },
        { text: "Harga Menu", value: "harga" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Menu: new FormData(),
      menus: [],
      bahans: [],
      form: {
        nama_menu: null,
        id_bahan: null,
        kategori_menu: null,
        deskripsi_menu: null,
        harga: null,
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.Menu.append("nama_menu", this.form.nama_menu);
      this.Menu.append('id_bahan', this.form.id_bahan);
      this.Menu.append("kategori_menu", this.form.kategori_menu);
      this.Menu.append("deskripsi_menu", this.form.deskripsi_menu);
      this.Menu.append("harga", this.form.harga);

      let url = this.$api + "/menu2/";
      this.load = true;
      this.$http
        .post(url, this.Menu, {
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
        nama_menu: this.form.nama_menu,
        kategori_menu: this.form.kategori_menu,
        deskripsi_menu: this.form.deskripsi_menu,
        harga: this.form.harga,
      };

      var url = this.$api + "/menu2/" + this.editId;
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
      var url = this.$api + "/menu2/" + this.deleteId;
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
      let url = this.$api + "/menu2";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.menus = response.data.data;
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

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_menu;
      this.form.nama_menu = item.nama_menu;
      this.form.kategori_menu = item.kategori_menu;
      this.form.deskripsi_menu = item.deskripsi_menu;
      this.form.harga = item.harga;
      this.dialog = true;
    },

    deleteHandler(id_menu) {
      this.deleteId = id_menu;
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
        nama_menu: null,
        kategori_menu: null,
        deskripsi_menu: null,
        harga: null,
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
