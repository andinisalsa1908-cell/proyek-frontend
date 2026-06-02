import React from "react";
import { Link } from "react-router-dom";

export default function Artikel() {
  const artikel = [
    {
      id: 1,
      judul: "Tips Mendaki Aman untuk Pemula",
      deskripsi: "Panduan mendaki untuk pemula agar aman.",
    },
    {
      id: 2,
      judul: "Peralatan Wajib Saat Naik Gunung",
      deskripsi: "Daftar perlengkapan yang wajib dibawa.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Artikel</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {artikel.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              {item.judul}
            </h2>

            <p className="text-gray-600">{item.deskripsi}</p>

            <Link
              to={`/artikel/${item.id}`}
              className="text-green-600 mt-4 inline-block"
            >
              Baca Selengkapnya →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}