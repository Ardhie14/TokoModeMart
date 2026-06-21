# 🛍️ TokoModeMart - Aplikasi E-Commerce Mobile

**TokoModeMart** adalah aplikasi belanja online modern yang dibangun dengan **Expo** dan **React Native**, menggunakan **TypeScript**. Aplikasi ini dirancang untuk memberikan pengalaman berbelanja fashion yang elegan, cepat, dan aman.

---

## 📱 Tampilan dan Fitur Aplikasi

Berikut adalah setiap halaman yang tersedia dalam aplikasi TokoModeMart beserta penjelasan singkatnya:

---

### 1. Halaman Login / Masuk
| | |
|---|---|
| **Judul Halaman** | Halaman Masuk |
| **Deskripsi** | Halaman awal untuk pengguna melakukan autentikasi. Pengguna dapat memasukkan **Email** dan **Password**, serta menggunakan fitur **Lupa Password** jika diperlukan. Tersedia juga opsi **Daftar Akun Baru** bagi pengguna yang belum memiliki akun. |

---

### 2. Halaman Profil Pengguna
| | |
|---|---|
| **Judul Halaman** | Halaman Profil |
| **Deskripsi** | Halaman ini menampilkan informasi profil pengguna, termasuk nama (**Tengku Ardhie Nugraha**) dan email (**Ardhie19@gmail.com**). Pengguna dapat melihat ringkasan pesanan (Total, Diproses, Selesai) serta mengakses menu seperti **Informasi Akun**, **Riwayat Pesanan**, **Alamat Saya**, dan **Metode Pembayaran**. |

---

### 3. Halaman Riwayat Pesanan
| | |
|---|---|
| **Judul Halaman** | Riwayat Pesanan |
| **Deskripsi** | Halaman ini menampilkan daftar semua pesanan yang telah dilakukan oleh pengguna. Setiap pesanan menampilkan **nomor pesanan**, **tanggal pemesanan**, **metode pembayaran**, **alamat pengiriman**, dan **total harga**. Pengguna juga dapat menekan tombol **Bayar Sekarang** untuk pesanan yang masih menunggu pembayaran. |

---

### 4. Halaman Keranjang Belanja
| | |
|---|---|
| **Judul Halaman** | Keranjang Belanja |
| **Deskripsi** | Halaman ini menampilkan semua produk yang telah ditambahkan ke keranjang. Setiap produk menampilkan **nama produk**, **harga**, dan **jumlah** yang dapat ditambah atau dikurangi. Di bagian bawah, pengguna dapat melihat **Total** harga semua produk dan melanjutkan ke proses checkout. |

---

### 5. Halaman Beranda (Home)
| | |
|---|---|
| **Judul Halaman** | Beranda |
| **Deskripsi** | Halaman utama aplikasi yang menyambut pengguna dengan sapaan **"Halo, Selamat Belanja!"**. Terdapat fitur **pencarian produk**, kategori produk (**Sweater**, **Hoodie**, **Jacket**, **Shoes**), serta daftar produk yang ditampilkan dalam bentuk kartu dengan **nama produk**, **harga**, dan tombol **Keranjang** untuk menambahkan produk ke keranjang belanja. |

---

### 6. Halaman Checkout
| | |
|---|---|
| **Judul Halaman** | Checkout |
| **Deskripsi** | Halaman ini digunakan untuk menyelesaikan proses pemesanan. Pengguna akan melalui tiga langkah: **Alamat**, **Pembayaran**, dan **Selesai**. Halaman ini menampilkan **Detail Pesanan** (daftar produk dan total harga), form **Alamat Pengiriman**, serta pilihan **Metode Pembayaran** seperti GoPay. |

---

### 7. Halaman Detail Produk
| | |
|---|---|
| **Judul Halaman** | Detail Produk |
| **Deskripsi** | Halaman ini menampilkan informasi lengkap tentang suatu produk, termasuk **nama produk**, **harga**, **stok tersedia**, dan **deskripsi produk**. Pengguna dapat melihat ketersediaan stok (misalnya "Sisa 1!") sebelum memutuskan untuk membeli. |

---

## 🚀 Cara Menjalankan Aplikasi

Untuk menjalankan proyek ini di lingkungan pengembangan lokal, ikuti langkah-langkah berikut:

**Prasyarat**
Pastikan Anda telah menginstal **Node.js** dan **npm** atau **yarn** di komputer Anda.

**Langkah Instalasi**

1.  **Clone Repository**
    ```bash
    git clone https://github.com/Ardhie14/TokoModeMart.git
    cd TokoModeMart
