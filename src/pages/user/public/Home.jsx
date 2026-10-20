import React, { useState } from "react";
import { Link } from "react-router-dom";

import UserLayout from "../../../layouts/UserLayout";
import CardGunung from "../cardGunung";

export default function Home() {
  const gunungPopuler = [
    {
      id: 1,
      nama: "Gunung Ciremai",
      lokasi: "Jawa Barat",
    },
    {
      id: 2,
      nama: "Gunung Semeru",
      lokasi: "Jawa Timur",
    },
    {
      id: 3,
      nama: "Gunung Merbabu",
      lokasi: "Jawa Tengah",
    },
  ];

  // Dummy Data Banner Promo (Slider Interaktif)
  const dummyPromo = [
    {
      id: 1,
      tag: "FLASH SALE 30%",
      judul: "Diskon Tiket Pendakian Akhir Pekan",
      deskripsi: "Pesan tiket rombongan minimal 5 orang dan dapatkan potongan harga spesial langsung di jalur resmi.",
      kode: "SUMMIT30",
      masaBerlaku: "Berlaku s/d 30 Nov 2026",
      bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      tag: "VOUCHER SPESIAL",
      judul: "Cashback Sewa Alat Basecamp Rp 50.000",
      deskripsi: "Lengkapi kebutuhan mendakimu lebih hemat dengan voucher sewa tenda dan carrier di basecamp.",
      kode: "SUMMITCAMP",
      masaBerlaku: "Berlaku s/d 15 Des 2026",
      bgImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      tag: "NEW MEMBER",
      judul: "Gratis Biaya Layanan Pendaki Baru",
      deskripsi: "Nikmati kemudahan registrasi tiket pertama tanpa biaya admin tambahan khusus member baru SummitGo.",
      kode: "NEWPENDAN",
      masaBerlaku: "Berlaku s/d 31 Des 2026",
      bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  const prevPromo = () => {
    setCurrentPromoIndex((prev) =>
      prev === 0 ? dummyPromo.length - 1 : prev - 1
    );
  };

  const nextPromo = () => {
    setCurrentPromoIndex((prev) =>
      prev === dummyPromo.length - 1 ? 0 : prev + 1
    );
  };

  const promoAktif = dummyPromo[currentPromoIndex];

  return (
    <UserLayout>
      {/* HERO SECTION */}
      <section className="bg-[#244275] text-white pt-36 pb-24 px-6 text-center relative overflow-hidden">
        
        {/* Bulatan 1: Kiri Atas */}
        <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] bg-[#1a325a] rounded-full opacity-60 pointer-events-none"></div>

        {/* Bulatan 2: Kanan Atas */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#1a325a] rounded-full opacity-60 pointer-events-none"></div>

        {/* Bulatan 3: Kanan Bawah */}
        <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#1a325a] rounded-full opacity-70 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide leading-tight">
            Selamat Datang di Website <br />
            SummitGo
          </h1>

          <p className="text-blue-100 text-sm md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            SummitGo adalah platform pemesanan tiket pendakian gunung secara online terintegrasi untuk mempermudah pengalaman pendakianmu di seluruh Indonesia.
          </p>

          <Link
            to="/gunung"
            className="inline-block bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold text-base px-12 py-3.5 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-0.5 tracking-wider"
          >
            SEE MORE
          </Link>
        </div>
      </section>

      {/* CONTAINER KONTEN UTAMA */}
      <div className="bg-[#f1f5f9] py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* BANNER PROMO */}
          <div className="relative group px-0 md:px-8">
            
            {/* Tombol Panah Kiri */}
            <button 
              onClick={prevPromo}
              className="absolute left-0 md:left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-[#244275] hover:text-white flex items-center justify-center font-bold transition-all z-20 border border-slate-200 cursor-pointer"
              title="Promo Sebelumnya"
            >
              &#10094;
            </button>

            {/* Main Banner Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[240px] md:min-h-[260px] flex items-center transition-all duration-500">
              
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
                style={{ backgroundImage: `url(${promoAktif.bgImage})` }}
              ></div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30"></div>

              {/* Konten Banner */}
              <div className="relative z-10 p-6 md:p-10 text-white max-w-2xl w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-red-600 text-white font-black text-[10px] md:text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow">
                    {promoAktif.tag}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-amber-300 font-semibold text-[10px] md:text-xs px-3 py-1 rounded-md">
                    {promoAktif.masaBerlaku}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-3xl font-black tracking-tight mb-2 drop-shadow">
                  {promoAktif.judul}
                </h3>
                
                <p className="text-slate-200 text-xs md:text-sm mb-4 font-normal leading-relaxed max-w-xl">
                  {promoAktif.deskripsi}
                </p>

                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold">
                  <span className="text-slate-300">Kode Promo:</span>
                  <span className="text-[#f3e03b] tracking-wider">{promoAktif.kode}</span>
                </div>
              </div>

              {/* Dot Indicators (Desktop) */}
              <div className="absolute bottom-4 right-6 z-10 hidden md:flex gap-1.5">
                {dummyPromo.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentPromoIndex(index)}
                    className={`h-2 rounded-full cursor-pointer transition-all ${
                      index === currentPromoIndex ? "w-6 bg-[#f3e03b]" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>

            </div>

            {/* Tombol Panah Kanan */}
            <button 
              onClick={nextPromo}
              className="absolute right-0 md:right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-[#244275] hover:text-white flex items-center justify-center font-bold transition-all z-20 border border-slate-200 cursor-pointer"
              title="Promo Selanjutnya"
            >
              &#10095;
            </button>

            {/* Dot Indicators (Mobile) */}
            <div className="flex md:hidden justify-center gap-1.5 mt-3">
              {dummyPromo.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`h-1.5 rounded-full cursor-pointer transition-all ${
                    index === currentPromoIndex ? "w-6 bg-[#244275]" : "w-1.5 bg-slate-300"
                  }`}
                />
              ))}
            </div>

          </div>

          {/* DAFTAR GUNUNG & SEARCH BAR */}
          <section className="text-center">
            <h2 className="text-3xl font-extrabold text-[#244275] mb-2">
              Daftar Gunung
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Nikmati pengalaman mendaki yang tak tergantikan
            </p>

            {/* Kotak Pencarian */}
            <div className="max-w-xl mx-auto mb-10 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari Gunung yang ingin kamu daki..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#244275] bg-white shadow-sm text-sm"
              />
            </div>

            {/* Kartu Gunung */}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {gunungPopuler.map((gunung) => (
                <CardGunung key={gunung.id} gunung={gunung} />
              ))}
            </div>
          </section>

          {/* CARA PEMESANAN TIKET (DIBUAT PROFESSIONAL, CLEAN, & ELEGANT) */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-center text-[#244275] mb-2">
              Cara Pemesanan Tiket
            </h2>
            <p className="text-center text-slate-500 text-xs md:text-sm mb-8">
              4 langkah mudah untuk memulai petualangan pendakianmu
            </p>

            <div className="grid md:grid-cols-4 gap-6 text-center">
              
              {/* Langkah 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col items-center">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#244275] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  1
                </div>
                <h3 className="font-bold text-[#244275] text-base mb-1">Daftar & Login</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Buat akun pengguna baru atau masuk dengan akun terdaftar.
                </p>
              </div>

              {/* Langkah 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col items-center">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#244275] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  2
                </div>
                <h3 className="font-bold text-[#244275] text-base mb-1">Pilih Gunung & Jalur</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cari gunung tujuan, cek kuota, dan tentukan jalur pendakian.
                </p>
              </div>

              {/* Langkah 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col items-center">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#244275] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  3
                </div>
                <h3 className="font-bold text-[#244275] text-base mb-1">Isi Data & Pesan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tentukan tanggal pendakian dan isi data anggota rombongan.
                </p>
              </div>

              {/* Langkah 4 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col items-center">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#244275] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  4
                </div>
                <h3 className="font-bold text-[#244275] text-base mb-1">Bayar & E-Tiket</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lakukan pembayaran dan dapatkan e-tiket resmi untuk check-in.
                </p>
              </div>

            </div>
          </section>

        </div>
      </div>
    </UserLayout>
  );
}