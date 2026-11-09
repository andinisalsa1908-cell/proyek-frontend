import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { 
  User, 
  Edit3, 
  Lock, 
  FileText, 
  Info, 
  ShieldCheck, 
  FileLock, 
  ChevronRight,
  ArrowLeft,
  Mountain,
  Ticket,
  Calendar,
  CheckCircle2,
  Camera,
  Check,
  ShoppingBag,
  Compass,
  Tag,
  Target,
  ListChecks
} from "lucide-react";

export default function Profile() {
  // State data profil dummy awal
  const [profile, setProfile] = useState({
    name: "Andini Salsabila",
    email: "andinisalsa1908@gmail.com",
    phone: "0899878987898",
    avatar: "",
  });

  // State untuk melacak view aktif: 'main', 'tentang', 'syarat', 'privasi', 'ubah-profil', 'kata-sandi', 'riwayat'
  const [currentView, setCurrentView] = useState("main");
  
  // State sementara untuk form ubah profil
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // State untuk pop-up modal di tengah layar
  const [modalMessage, setModalMessage] = useState("");

  // Handler untuk memilih gambar foto profil (preview lokal)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler Submit Ubah Profil (Simpan & Munculkan Modal Tengah)
  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      avatar: editForm.avatar,
    });
    setModalMessage("Profil dan foto berhasil diperbarui!");
  };

  // Handler Submit Ganti Kata Sandi
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setModalMessage("Kata sandi berhasil diubah!");
  };

  // Tombol OK pada Modal untuk menutup pop-up dan kembali ke profil utama
  const handleCloseModal = () => {
    setModalMessage("");
    setCurrentView("main");
  };

  // ================= KONTEN HALAMAN INFORMASI & PENGATURAN =================
  const renderDynamicContent = () => {
    switch (currentView) {
      // --- UBAH PROFIL ---
      case "ubah-profil":
        return {
          title: "Ubah Profil",
          subtitle: "Perbarui informasi username dan foto profil Anda",
          icon: <Edit3 className="w-8 h-8 text-[#244275]" />,
          content: (
            <form onSubmit={handleUpdateProfileSubmit} className="space-y-6 max-w-2xl">
              
              {/* Bagian Ganti Foto Profil */}
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden border-2 border-slate-200 shadow-inner">
                  {editForm.avatar ? (
                    <img src={editForm.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center space-x-2 transition">
                    <Camera className="w-4 h-4 text-[#244275]" />
                    <span>Pilih Foto Baru</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                  <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG atau GIF (Maks. 2MB)</p>
                </div>
              </div>

              {/* Form Input Username / Nama */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pengguna (Username)</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">No. Telepon</label>
                <input
                  type="text"
                  value={editForm.phone || ""}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#244275] text-white font-medium hover:bg-blue-950 transition shadow-sm cursor-pointer"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView("main")}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          ),
        };

      // --- KATA SANDI ---
      case "kata-sandi":
        return {
          title: "Ubah Kata Sandi",
          subtitle: "Pastikan akun Anda menggunakan kata sandi yang aman",
          icon: <Lock className="w-8 h-8 text-[#244275]" />,
          content: (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#244275] text-white font-medium hover:bg-blue-950 transition shadow-sm cursor-pointer"
                >
                  Perbarui Kata Sandi
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView("main")}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          ),
        };

      // --- RIWAYAT PENDAKIAN ---
      case "riwayat":
        return {
          title: "Riwayat Pendakian",
          subtitle: "Daftar pemesanan tiket dan riwayat petualangan Anda",
          icon: <FileText className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-base">Gunung Rinjani</span>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> Jalur Sembalun • 15 Agustus 2025
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Tiket ID</span>
                  <span className="font-mono text-sm font-semibold text-slate-700">#TKT-8921</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-base">Gunung Prau</span>
                    <span className="bg-blue-100 text-[#244275] text-xs px-2.5 py-0.5 rounded-full font-medium">
                      Aktif / Terjadwal
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" /> Jalur Dieng • 20 Desember 2026
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Tiket ID</span>
                  <span className="font-mono text-sm font-semibold text-slate-700">#TKT-9042</span>
                </div>
              </div>
            </div>
          ),
        };

      // --- TENTANG WEBSITE ---
      case "tentang":
        return {
          title: "Tentang Website",
          subtitle: "Kenali lebih dekat platform SummitGo",
          icon: <Info className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-7 text-slate-600 leading-relaxed">
              <div>
                <p className="text-lg font-semibold text-[#244275] mb-2">Selamat Datang di SummitGo!</p>
                <p className="mb-3">
                  <strong>SummitGo</strong> merupakan platform digital yang dikembangkan untuk mempermudah pengguna dalam mengakses informasi dan layanan pendakian gunung. Melalui SummitGo, pengguna dapat mencari informasi gunung, melihat jalur pendakian, memeriksa kuota dan jadwal, melakukan pemesanan tiket, serta menyewa perlengkapan pendakian dalam satu platform.
                </p>
                <p>
                  SummitGo hadir sebagai solusi digital untuk membantu pendaki dalam merencanakan kegiatan pendakian agar lebih mudah, praktis, dan terorganisir.
                </p>
              </div>

              {/* FITUR UTAMA */}
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Fitur Utama SummitGo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <Mountain className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">1. Informasi Gunung</h4>
                    <p className="text-xs text-slate-600">Menyediakan informasi mengenai gunung, jalur pendakian, kuota, dan jadwal pendakian yang tersedia.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <Ticket className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">2. Pemesanan Tiket Pendakian</h4>
                    <p className="text-xs text-slate-600">Memudahkan pengguna melakukan pemesanan tiket berdasarkan gunung, jalur, dan tanggal pendakian yang dipilih.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <ShoppingBag className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">3. Penyewaan Peralatan</h4>
                    <p className="text-xs text-slate-600">Menyediakan informasi perlengkapan pendakian beserta ketersediaan stok yang dapat disewa oleh pengguna.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <Compass className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">4. Rekomendasi Gunung</h4>
                    <p className="text-xs text-slate-600">Membantu pengguna menemukan pilihan gunung berdasarkan profil dan preferensi yang dimiliki.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 sm:col-span-2 border border-blue-100">
                    <Tag className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">5. Informasi Promo</h4>
                    <p className="text-xs text-slate-600">Menampilkan informasi promo yang tersedia untuk diketahui oleh pengguna.</p>
                  </div>
                </div>
              </div>

              {/* VISI & MISI */}
              <div className="space-y-4 pt-2">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#244275]" />
                    <h3 className="font-bold text-slate-800">Visi</h3>
                  </div>
                  <p className="text-sm text-slate-600">Menjadi platform digital yang mempermudah akses informasi dan layanan pendakian gunung melalui sistem yang terintegrasi.</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="w-5 h-5 text-[#244275]" />
                    <h3 className="font-bold text-slate-800">Misi</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                    <li>Mempermudah pengguna memperoleh informasi pendakian gunung.</li>
                    <li>Menyediakan layanan pemesanan tiket pendakian secara digital.</li>
                    <li>Mempermudah proses penyewaan perlengkapan pendakian.</li>
                    <li>Memberikan rekomendasi gunung sesuai profil dan preferensi pengguna.</li>
                    <li>Mendukung pengelolaan layanan pendakian secara lebih terorganisir.</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        };

      // --- SYARAT & KETENTUAN ---
      case "syarat":
        return {
          title: "Syarat & Ketentuan",
          subtitle: "Ketentuan penggunaan layanan SummitGo",
          icon: <ShieldCheck className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                Selamat datang di <strong>SummitGo</strong>. Syarat dan Ketentuan ini dibuat sebagai pedoman bagi seluruh pengguna dalam menggunakan layanan yang tersedia pada platform SummitGo. Dengan melakukan pendaftaran, mengakses, atau menggunakan layanan SummitGo, pengguna dianggap telah membaca dan memahami ketentuan berikut.
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">1. Ketentuan Akun Pengguna</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Pengguna wajib melakukan pendaftaran untuk menggunakan layanan yang membutuhkan akun.</li>
                  <li>Pengguna harus memberikan informasi pribadi yang benar dan sesuai.</li>
                  <li>Pengguna bertanggung jawab menjaga kerahasiaan akun dan kata sandi.</li>
                  <li>Pengguna bertanggung jawab atas aktivitas yang dilakukan melalui akun miliknya.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">2. Ketentuan Pemesanan Tiket Pendakian</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Pengguna dapat memilih gunung, jalur, tanggal, dan jadwal pendakian yang tersedia.</li>
                  <li>Pemesanan tiket mengikuti kuota yang telah ditentukan oleh pengelola gunung.</li>
                  <li>Pengguna wajib memastikan data pemesanan sudah benar sebelum melakukan pemesanan.</li>
                  <li>Pengguna dapat melakukan pembatalan tiket sesuai ketentuan sistem.</li>
                  <li>Tiket yang telah digunakan tidak dapat dibatalkan.</li>
                  <li>Pengguna wajib mengikuti peraturan pendakian yang berlaku di gunung yang dipilih.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">3. Ketentuan Penyewaan Peralatan</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Pengguna dapat melihat daftar peralatan pendakian yang tersedia untuk disewa.</li>
                  <li>Penyewaan bergantung pada ketersediaan stok peralatan.</li>
                  <li>Pengguna bertanggung jawab menjaga kondisi peralatan yang disewa.</li>
                  <li>Pengguna dapat membatalkan pesanan selama pesanan belum diproses.</li>
                  <li>Pesanan penyewaan yang telah diproses tidak dapat dibatalkan.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">4. Ketentuan Promo</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Pengguna dapat melihat informasi promo yang tersedia pada SummitGo.</li>
                  <li>Penggunaan promo mengikuti ketentuan yang tercantum pada informasi promo.</li>
                  <li>Informasi promo dapat berubah sesuai pembaruan dari pengelola.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">5. Ketentuan Penggunaan Platform</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Pengguna wajib menggunakan SummitGo sesuai dengan fungsi dan layanan yang tersedia.</li>
                  <li>Pengguna dilarang memberikan informasi palsu atau melakukan penyalahgunaan sistem.</li>
                  <li>Pengguna tidak diperkenankan menggunakan platform untuk kegiatan yang melanggar hukum.</li>
                  <li>Pengguna wajib mengikuti ketentuan yang berlaku pada setiap layanan pendakian.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">6. Perubahan Syarat dan Ketentuan</h3>
                <p className="text-sm">
                  SummitGo dapat melakukan perubahan terhadap Syarat dan Ketentuan apabila terdapat pembaruan fitur, layanan, atau kebutuhan pengelolaan sistem. Pengguna disarankan untuk membaca halaman ini secara berkala.
                </p>
                <p className="text-sm italic font-medium text-slate-700">
                  Dengan menggunakan layanan SummitGo, pengguna dianggap telah memahami dan menyetujui Syarat dan Ketentuan yang berlaku.
                </p>
              </section>
            </div>
          ),
        };

      // --- KEBIJAKAN PRIVASI ---
      case "privasi":
        return {
          title: "Kebijakan Privasi",
          subtitle: "Bagaimana SummitGo mengelola informasi pengguna",
          icon: <FileLock className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                <strong>SummitGo</strong> menghargai privasi dan keamanan informasi setiap pengguna. Kebijakan Privasi ini menjelaskan bagaimana informasi pengguna dikumpulkan, digunakan, dan dilindungi selama menggunakan layanan SummitGo.
              </p>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">1. Informasi yang Dikumpulkan</h3>
                <p className="text-sm">Untuk mendukung penggunaan layanan, SummitGo dapat mengelola informasi yang diberikan pengguna, meliputi:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Nama lengkap</li>
                  <li>Alamat email</li>
                  <li>Nomor telepon</li>
                  <li>Alamat tempat tinggal</li>
                  <li>Tanggal lahir</li>
                  <li>Jenis kelamin</li>
                  <li>Informasi pemesanan tiket pendakian</li>
                  <li>Informasi penyewaan peralatan pendakian</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">2. Penggunaan Informasi</h3>
                <p className="text-sm">Informasi yang diberikan pengguna digunakan untuk mendukung operasional layanan SummitGo, antara lain:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Membuat dan mengelola akun pengguna.</li>
                  <li>Mendukung proses pemesanan tiket pendakian.</li>
                  <li>Mengelola informasi penyewaan peralatan.</li>
                  <li>Menyimpan informasi dan riwayat pemesanan.</li>
                  <li>Memberikan rekomendasi gunung berdasarkan profil dan preferensi pengguna.</li>
                  <li>Membantu pengelola dalam mengelola data layanan pendakian.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">3. Perlindungan Data Pengguna</h3>
                <p className="text-sm">
                  SummitGo berupaya menjaga keamanan informasi pengguna dengan menerapkan perlindungan terhadap data akun dan transaksi, termasuk pengamanan kata sandi untuk mengurangi risiko akses yang tidak berwenang.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">4. Pengelolaan dan Akses Informasi</h3>
                <p className="text-sm">Pengelolaan informasi dilakukan berdasarkan hak akses dan tanggung jawab masing-masing pengguna sistem:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Pengguna:</strong> dapat menggunakan informasi akun untuk kebutuhan layanan pribadi.</li>
                  <li><strong>Admin Gunung:</strong> bertanggung jawab mengelola informasi gunung, jalur, kuota, dan layanan pendakian.</li>
                  <li><strong>Admin Basecamp:</strong> bertanggung jawab mengelola data pendaki, peralatan, stok, dan penyewaan.</li>
                  <li><strong>Super Admin:</strong> bertanggung jawab mengelola pengguna dan pengaturan sistem sesuai kewenangannya.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">5. Tanggung Jawab Pengguna</h3>
                <p className="text-sm">Pengguna diharapkan untuk:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Memberikan informasi yang benar saat melakukan pendaftaran.</li>
                  <li>Menjaga kerahasiaan akun dan kata sandi.</li>
                  <li>Tidak membagikan informasi login kepada orang lain.</li>
                  <li>Menggunakan layanan SummitGo secara bertanggung jawab.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-800">6. Perubahan Kebijakan Privasi</h3>
                <p className="text-sm">
                  Kebijakan Privasi dapat diperbarui apabila terdapat perubahan pada fitur atau pengelolaan data SummitGo. Setiap perubahan akan ditampilkan pada halaman Kebijakan Privasi agar dapat diketahui oleh pengguna.
                </p>
              </section>

              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-center mt-4">
                <p className="text-xs font-semibold text-[#244275]">Komitmen SummitGo</p>
                <p className="text-xs text-slate-600 mt-0.5">Kami berupaya menjaga informasi pengguna dan menyediakan layanan pendakian digital yang aman, nyaman, dan mudah digunakan.</p>
              </div>
            </div>
          ),
        };

      default:
        return null;
    }
  };

  return (
    <UserPrivateLayout>
      <div className="min-h-screen bg-slate-50 py-10 pb-16 relative">
        
        {/* MODAL POP-UP DI TENGAH LAYAR */}
        {modalMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs px-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center border border-slate-100 transform transition-all scale-100">
              <div className="w-16 h-16 bg-blue-50 text-[#244275] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Berhasil!</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{modalMessage}</p>
              <button
                onClick={handleCloseModal}
                className="w-full py-3 px-6 rounded-xl bg-[#244275] text-white font-semibold hover:bg-blue-950 transition shadow-md cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* KONDISI 1: TAMPILAN DETAIL/FORM (LEBAR PENUH) */}
        {currentView !== "main" ? (
          <div className="max-w-4xl mx-auto px-4">
            
            <div className="mb-5">
              <button
                onClick={() => setCurrentView("main")}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-[#244275] hover:text-blue-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Profil</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-100">
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  {renderDynamicContent().icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {renderDynamicContent().title}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {renderDynamicContent().subtitle}
                  </p>
                </div>
              </div>

              <div className="border-b border-slate-100 mb-6" />

              <div>{renderDynamicContent().content}</div>

              <div className="mt-8 pt-5 border-t border-slate-100 text-center">
                <p className="text-sm font-semibold text-[#244275]">SummitGo</p>
                <p className="text-xs text-slate-400 mt-1">Temukan Informasi, Rencanakan Pendakianmu.</p>
              </div>
            </div>
          </div>
        ) : (
          
          /* KONDISI 2: TAMPILAN HALAMAN PROFIL UTAMA */
          <div className="max-w-4xl mx-auto px-4">
            
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center space-x-6 border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden shadow-inner border border-slate-200">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{profile.name || "Nama Pengguna"}</h2>
                <p className="text-slate-500 text-sm">{profile.email || "email@domain.com"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Kotak 1: Pengaturan Akun */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-base font-bold text-[#244275] mb-4">Pengaturan akun</h3>
                <div className="space-y-3">
                  
                  <button
                    onClick={() => {
                      setEditForm(profile);
                      setCurrentView("ubah-profil");
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <Edit3 className="w-5 h-5 text-[#244275]" />
                      <span>Ubah Profil</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setCurrentView("kata-sandi")}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-[#244275]" />
                      <span>Kata Sandi</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setCurrentView("riwayat")}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-[#244275]" />
                      <span>Riwayat Pendakian</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                </div>
              </div>

              {/* Kotak 2: Seputar Website */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-base font-bold text-[#244275] mb-4">Seputar Website</h3>
                <div className="space-y-3">
                  
                  <button
                    onClick={() => setCurrentView("tentang")}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <Info className="w-5 h-5 text-[#244275]" />
                      <span>Tentang Website</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setCurrentView("syarat")}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <ShieldCheck className="w-5 h-5 text-[#244275]" />
                      <span>Syarat & Ketentuan</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setCurrentView("privasi")}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <FileLock className="w-5 h-5 text-[#244275]" />
                      <span>Kebijakan Privasi</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </UserPrivateLayout>
  );
}