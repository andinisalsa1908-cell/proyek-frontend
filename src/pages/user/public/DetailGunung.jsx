import React from "react";
import { Link, useParams } from "react-router-dom";

export default function DetailGunung() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
        alt=""
        className="w-full h-[450px] object-cover rounded-xl"
      />

      <div className="mt-8">
        <h1 className="text-4xl font-bold mb-4">
          Gunung Detail #{id}
        </h1>

        <p className="text-gray-700 mb-4">
          Gunung ini memiliki jalur pendakian yang indah dan
          cocok untuk wisata pendaki.
        </p>

        <div className="space-y-2">
          <p>📍 Lokasi: Jawa Timur</p>
          <p>🎫 Harga Tiket: Rp 25.000</p>
          <p>⛰️ Status: Buka</p>
        </div>

        <Link
          to="/user/login"
          className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Pesan Tiket
        </Link>
      </div>
    </div>
  );
}