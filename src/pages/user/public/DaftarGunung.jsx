import React from "react";
import UserLayout from "../../../layouts/UserLayout";
import CardGunung from "../cardGunung";

export default function DaftarGunung() {
  const gunungs = [
    {
      id: 1,
      nama: "Gunung Ciremai",
      lokasi: "Jawa Barat",
    },
    {
      id: 2,
      nama: "Gunung Merbabu",
      lokasi: "Jawa Tengah",
    },
    {
      id: 3,
      nama: "Gunung Semeru",
      lokasi: "Jawa Timur",
    },
    {
      id: 4,
      nama: "Gunung Slamet",
      lokasi: "Jawa Tengah",
    },
  ];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-6">
          Daftar Gunung
        </h1>

        <input
          type="text"
          placeholder="Cari gunung..."
          className="w-full border p-3 rounded-lg mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {gunungs.map((gunung) => (
            <CardGunung
              key={gunung.id}
              gunung={gunung}
            />
          ))}
        </div>

      </div>
    </UserLayout>
  );
}