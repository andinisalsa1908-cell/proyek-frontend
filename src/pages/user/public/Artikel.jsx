import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import CardArtikel from "../../../components/user/cardArtikel";

export default function Artikel() {
  const artikel = [
    {
      id: 1,
      judul: "Tips Pendakian Aman",
      deskripsi: "Persiapan sebelum mendaki.",
    },
    {
      id: 2,
      judul: "Peralatan Wajib Pendaki",
      deskripsi: "Daftar perlengkapan penting.",
    },
    {
      id: 3,
      judul: "Etika Pendakian",
      deskripsi: "Menjaga alam saat mendaki.",
    },
  ];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-8">
          Artikel Pendakian
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {artikel.map((item) => (
            <CardArtikel
              key={item.id}
              artikel={item}
            />
          ))}
        </div>

      </div>
    </UserLayout>
  );
}