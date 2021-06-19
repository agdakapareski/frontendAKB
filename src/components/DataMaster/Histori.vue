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
        <v-spacer></v-spacer>
        <v-btn tile color="warning" elevation="0" @click="exportToPDF">Print</v-btn>
      </v-card-title>
      <div ref="printHistori">
        <v-data-table
          :headers="headers"
          :items="historis"
          :search="search"
        ></v-data-table>
      </div>
    </v-card>
  </v-main>
</template>

<script>
import print from "vue-print-nb";
import html2pdf from "html2pdf.js";

export default {
  directives: {
    print,
  },
  name: "Histori",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      headers: [
        { text: "Tanggal Masuk", value: "tanggal_histori" },
        { text: "Nama Bahan", value: "nama_bahan" },
        { text: "Stok", value: "jumlah_stok" },
        { text: "Unit", value: "unit_stok" },
        { text: "Harga", value: "harga_stok" },
      ],
      historis: [],
    };
  },
  methods: {
    exportToPDF() {
      html2pdf(this.$refs.printHistori, {
        margin: 3,
        filename: "document.pdf",
        image: { type: "png", quality: 1 },
        html2canvas: { dpi: 200, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    },
    readData() {
      let url = this.$api + "/histori";
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
