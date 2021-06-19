<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL HISTORI</h2>
      </v-card-title>
      <v-card-title class="pt-0">
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="historis"
        :search="search"
      ></v-data-table>
    </v-card>
  </v-main>
</template>

<script>
export default {
  name: "Histori Keluar",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      headers: [
        { text: "Tanggal Keluar", value: "tanggal_histori" },
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Stok", value: "jumlah_stok" },
        { text: "Unit", value: "unit_stok" },
        { text: "Keterangan", value: "keterangan" },
      ],
      historis: [],
    };
  },
  methods: {
    readData() {
      let url = this.$api + "/historiKeluar";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.historis = response.data.data;
        });
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
