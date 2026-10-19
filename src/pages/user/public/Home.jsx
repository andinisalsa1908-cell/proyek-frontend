import React from "react";
import { Link } from "react-router-dom";

import UserLayout from "../../../layouts/UserLayout";
import CardGunung from "../cardGunung";
import CardArtikel from "../../../components/user/cardArtikel";

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

  const artikelTerbaru = [
    {
      id: 1,
      judul: "Tips Pendakian Aman",
      deskripsi: "Persiapan sebelum mendaki gunung.",
    },
    {
      id: 2,
      judul: "Peralatan Wajib Pendaki",
      deskripsi: "Daftar perlengkapan yang harus dibawa.",
    },
    {
      id: 3,
      judul: "Etika Pendakian",
      deskripsi: "Menjaga alam saat mendaki.",
    },
  ];

  return (
    <UserLayout>
      {/* HERO SECTION - Disamakan Warnanya dengan Banner Promo (#2a4365) */}
      <section className="bg-[#2a4365] text-white py-20 px-6 text-center relative overflow-hidden">
        {/* Ornamen Lingkaran Bulat di Latar Belakang */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-900/40 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-slate-900/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-wide leading-tight">
            Selamat Datang di Website SummitGo
          </h1>

          <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            SummitGo adalah platform pemesanan tiket pendakian gunung secara online
            terintegrasi untuk mempermudah pengalaman pendakianmu di seluruh Indonesia.
          </p>

          <Link
            className="inline-block bg-[#facc15] hover:bg-yellow-400 text-slate-900 font-bold px-10 py-3 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
            to="/gunung"
          >
            SEE MORE
          </Link>
        </div>
      </section>

      {/* CONTAINER KONTEN UTAMA - Background Abu-abu Muda */}
      <div className="bg-[#f1f5f9] py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* BANNER PROMO (#2a4365) */}
          <section className="bg-[#2a4365] rounded-2xl p-10 text-center text-white relative shadow-sm flex items-center justify-between">
            <button className="text-white hover:text-yellow-400 text-3xl font-bold px-2">
              &#10094;
            </button>
            <div className="py-4">
              <h3 className="text-2xl font-bold tracking-wide">Banner Promo</h3>
            </div>
            <button className="text-white hover:text-yellow-400 text-3xl font-bold px-2">
              &#10095;
            </button>
          </section>

          {/* DAFTAR GUNUNG POPULER & SEARCH BAR */}
          <section className="text-center">
            <h2 className="text-3xl font-extrabold text-[#2a4365] mb-2">
              Daftar Gunung
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Nikmati pengalaman mendaki yang tak tergantikan
            </p>

            {/* Form Pencarian */}
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
                className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2a4365] bg-white shadow-sm text-sm"
              />
            </div>

            {/* Komponen CardGunung */}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {gunungPopuler.map((gunung) => (
                <CardGunung key={gunung.id} gunung={gunung} />
              ))}
            </div>
          </section>

          {/* ARTIKEL TERBARU */}
          <section className="pt-6">
            <h2 className="text-2xl font-bold text-[#2a4365] mb-6 text-center">
              Artikel Terbaru
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {artikelTerbaru.map((artikel) => (
                <CardArtikel key={artikel.id} artikel={artikel} />
              ))}
            </div>
          </section>

          {/* CARA PEMESANAN TIKET */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-center text-[#2a4365] mb-8">
              Cara Pemesanan Tiket
            </h2>

            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-blue-900 mb-1">1. Daftar Akun</h3>
                <p className="text-xs text-slate-600">Buat akun terlebih dahulu.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-blue-900 mb-1">2. Login</h3>
                <p className="text-xs text-slate-600">Masuk ke sistem.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-blue-900 mb-1">3. Pilih Gunung</h3>
                <p className="text-xs text-slate-600">Tentukan gunung dan tanggal pendakian.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-blue-900 mb-1">4. Dapatkan Tiket</h3>
                <p className="text-xs text-slate-600">Tiket digital siap digunakan.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </UserLayout>
  );
}