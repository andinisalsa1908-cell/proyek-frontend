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
      {/* HERO */}
      <section
        className="h-[80vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b')",
        }}
      >
        <div className="bg-black/50 p-10 rounded-xl text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            CAG
          </h1>

          <p className="text-lg mb-6">
            Sistem Pemesanan Tiket Pendakian Gunung Online
          </p>

          <Link
            to="/gunung"
            className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Jelajahi Gunung
          </Link>
        </div>
      </section>

      {/* GUNUNG POPULER */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">
          Gunung Populer
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {gunungPopuler.map((gunung) => (
            <CardGunung
              key={gunung.id}
              gunung={gunung}
            />
          ))}
        </div>
      </section>

      {/* ARTIKEL */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">
            Artikel Terbaru
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {artikelTerbaru.map((artikel) => (
              <CardArtikel
                key={artikel.id}
                artikel={artikel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CARA PESAN */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Cara Pemesanan Tiket
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="font-bold mb-2">
                1. Daftar Akun
              </h3>
              <p>Buat akun terlebih dahulu.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                2. Login
              </h3>
              <p>Masuk ke sistem.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                3. Pilih Gunung
              </h3>
              <p>Tentukan gunung dan tanggal pendakian.</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">
                4. Dapatkan Tiket
              </h3>
              <p>Tiket digital siap digunakan.</p>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}