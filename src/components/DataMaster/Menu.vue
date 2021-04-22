<template>
  <v-main>
    <h3 class="text-h3 font-weight-medium mb-5">Menu</h3>
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
        <v-btn color="warning" @click="dialog = true"> Tambah Menu </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="menus" :search="search">
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
          <span class="headline">{{ formTitle }} Menu</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_menu"
              label="Nama Menu"
              required
            ></v-text-field>
            <v-select
              v-model="form.kategori_menu"
              label="Kategori Menu"
              :items="items_kategori"
              required
            ></v-select>
            <v-text-field
              v-model="form.harga"
              label="Harga Menu"
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
        { text: "Kategori Menu", value: "kategori_menu" },
        { text: "Harga Menu", value: "harga" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Menu: new FormData(),
      menus: [],
      form: {
        nama_menu: null,
        kategori_menu: null,
        harga: null,
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    save() {
      this.Menu.append("nama_menu", this.form.nama_menu);
      this.Menu.append("kategori_menu", this.form.kategori_menu);
      this.Menu.append("harga", this.form.harga);

      let url = this.$api + "/menus/";
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
        harga: this.form.harga,
      };

      var url = this.$api + "/menus/" + this.editId;
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
      var url = this.$api + "/menus/" + this.deleteId;
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
      let url = this.$api + "/menus";
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

    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_menu = item.nama_menu;
      this.form.kategori_menu = item.kategori_menu;
      this.form.harga = item.harga;
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
        nama_menu: null,
        kategori_menu: null,
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
  },
};
</script>
