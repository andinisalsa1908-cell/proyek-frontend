import React from "react";
import { Link } from "react-router-dom";

export default function DaftarGunung() {
  const gunung = [
    {
      id: 1,
      nama: "Gunung Semeru",
      lokasi: "Jawa Timur",
      harga: "25000",
      gambar:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    {
      id: 2,
      nama: "Gunung Rinjani",
      lokasi: "NTB",
      harga: "30000",
      gambar:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Daftar Gunung</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {gunung.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >
            <img
              src={item.gambar}
              alt={item.nama}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">
              <h2 className="text-xl font-bold">
                {item.nama}
              </h2>

              <p>{item.lokasi}</p>

              <p className="text-green-600 font-semibold mt-2">
                Rp {item.harga}
              </p>

              <Link
                to={`/gunung/${item.id}`}
                className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}