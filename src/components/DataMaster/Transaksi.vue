<template>
  <v-main>
    <v-card class="mt-1 rounded-0 elevation-0">
      <v-card-title class="pb-0">
        <h2>TABEL TRANSAKSI</h2>
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
        <v-btn tile elevation="0" color="warning" @click="exportToPDF">Print</v-btn>
      </v-card-title>
      <div ref="printTransaksi">
        <v-data-table
          :headers="headers"
          :items="transaksis"
          :search="search"
        >
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
              small
              class="mr-2"
              @click="deleteHandler(item)"
              dark
              color="error"
              >mdi-delete</v-icon
            >
            <v-icon small dark color="success">mdi-file-table-outline</v-icon>
            <!-- <v-btn
            class="mb-1 mt-1"
            @click="lunasHandler(item.nama_customer)"
            dark
            color="success"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn> -->
          </template>
        </v-data-table>
      </div>
    </v-card>

    <v-dialog v-model="dialogStruk" max-width="600px">
      <v-card>
        <v-card-title>Struk</v-card-title>
        <v-data-table :headers="headerStruk" :items="pesanans"></v-data-table>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-toolbar dark color="warning">
          <v-toolbar-title class="headline"
            >{{ formTitle }} Transaksi</v-toolbar-title
          >
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_customer"
              label="Nama Customer"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="formPegawai.nama_pegawai"
              label="Nama Pegawai"
              readonly
            ></v-text-field>
            <v-select
              v-model="form.jenis_pembayaran"
              :items="jenisBayar"
              label="Jenis Pembayaran"
              required
            ></v-select>
            <v-select
              v-model="form.nama_pemilik_kartu"
              label="Nama Pemilik Kartu"
              :items="kartus"
              item-text="nama_pemilik_kartu"
              item-value="nama_pemilik_kartu"
              required
            >
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.nama_pemilik_kartu"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="data.item.jenis_kartu"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-select>
            <v-text-field
              v-model="form.kode_verifikasi"
              label="Kode Verifikasi"
            ></v-text-field>
            <v-text-field
              v-model="form.total_transaksi"
              label="Total Transaksi"
              readonly
            ></v-text-field>
            <v-select
              v-model="form.status_transaksi"
              :items="bayar"
              label="Status Transaksi"
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
import print from "vue-print-nb";
import html2pdf from "html2pdf.js";

export default {
  directives: {
    print,
  },
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
      dialogStruk: false,
      bayar: ["Lunas", "Belum Lunas"],
      jenisBayar: ["Cash", "Kredit", "Debit"],
      headerStruk: [
        { text: "Qty", value: "jumlah" },
        { text: "Menu", value: "nama_menu" },
        { text: "Harga", value: "harga" },
        { text: "Subtotal", value: "subtotal" },
      ],
      headers: [
        { text: "Customer", value: "nama_customer" },
        { text: "Staff", value: "nama_pegawai" },
        { text: "Pembayaran", value: "jenis_pembayaran" },
        { text: "Nama Kartu", value: "nama_pemilik_kartu" },
        { text: "Kode Verifikasi", value: "kode_verifikasi" },
        { text: "Total", value: "total_transaksi" },
        { text: "Status", value: "status_transaksi" },
        { text: "Timestamp", value: "created_at" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      Transaksi: new FormData(),
      transaksis: [],
      pesanans: [],
      kartus: [],
      form: {
        nama_customer: "",
        nama_pegawai: "",
        jenis_pembayaran: "",
        nama_pemilik_kartu: "",
        kode_verifikasi: "",
        total_transaksi: null,
        status_transaksi: "",
      },
      users: [],
      formPegawai: {
        nama_pegawai: null,
        email_pegawai: null,
        posisi_pegawai: null,
      },
      editId: "",
      deleteId: "",
    };
  },
  methods: {
    exportToPDF() {
      html2pdf(this.$refs.printTransaksi, {
        margin: 3,
        filename: "document.pdf",
        image: { type: "png", quality: 1 },
        html2canvas: { dpi: 200, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    },
    save() {
      this.Transaksi.append("nama_customer", this.form.nama_customer);
      this.Transaksi.append("nama_pegawai", this.formPegawai.nama_pegawai);
      this.Transaksi.append("jenis_pembayaran", this.form.jenis_pembayaran);
      this.Transaksi.append("nama_pemilik_kartu", this.form.nama_pemilik_kartu);
      this.Transaksi.append("kode_verifikasi", this.form.kode_verifikasi);
      this.Transaksi.append("total_transaksi", this.form.total_transaksi);
      this.Transaksi.append("status_transaksi", this.form.status_transaksi);

      let url = this.$api + "/transaksi/";
      this.load = true;
      this.$http
        .post(url, this.Pesanan, {
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
        nama_pegawai: this.formPegawai.nama_pegawai,
        jenis_pembayaran: this.form.jenis_pembayaran,
        nama_pemilik_kartu: this.form.nama_pemilik_kartu,
        kode_verifikasi: this.form.kode_verifikasi,
        total_transaksi: this.form.total_transaksi,
        status_transaksi: this.form.status_transaksi,
      };

      var url = this.$api + "/transaksi/" + this.editId;
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

      if (newData.status_transaksi == "Lunas") {
        //mengahapus data
        var urlDelete = this.$api + "/pesanan/" + this.deleteId;
        //data dihapus berdasarkan id
        this.$http.delete(urlDelete, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
      }
    },

    readKartu() {
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

    deleteData() {
      //mengahapus data
      var url = this.$api + "/transaksi/" + this.deleteId;
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

    readPesanan() {
      let url = this.$api + "/pesananMobile/" + this.form.nama_customer;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.transaksis = response.data.data;
        });
    },

    readData() {
      let url = this.$api + "/transaksi";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.transaksis = response.data.data;
        });
    },

    readPegawai() {
      let url = this.$api + "/users/" + localStorage.getItem("id");
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.users = response.data.data;
          this.formPegawai.nama_pegawai = this.users.nama_pegawai;
          this.formPegawai.email_pegawai = this.users.email_pegawai;
          this.formPegawai.posisi_pegawai = this.users.posisi_pegawai;
        });
    },

    strukHandler(item) {
      this.form.nama_customer = item.nama_customer;
      this.readPesanan();
      this.dialogStruk = true;
    },

    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id_transaksi;
      this.deleteId = item.nama_customer;
      this.form.nama_customer = item.nama_customer;
      this.form.nama_pegawai = item.nama_pegawai;
      this.form.jenis_pembayaran = item.jenis_pembayaran;
      this.form.nama_pemilik_kartu = item.nama_pemilik_kartu;
      this.form.kode_verifikasi = item.kode_verifikasi;
      this.form.total_transaksi = item.total_transaksi;
      this.form.status_transaksi = item.status_transaksi;
      this.dialog = true;
    },

    deleteHandler(item) {
      this.deleteId = item.id_transaksi;
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
        nama_customer: "",
        nama_pegawai: "",
        jenis_pembayaran: "",
        nama_pemilik_kartu: "",
        kode_verifikasi: "",
        total_transaksi: null,
        status_transaksi: "",
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
    this.readPegawai();
    this.readKartu();
  },
};
</script>
