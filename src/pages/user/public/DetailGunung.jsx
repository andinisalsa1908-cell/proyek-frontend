import React from "react";
import { Link } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";

export default function DetailGunung() {
  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto py-10 px-6">

        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
          alt="Gunung"
          className="w-full h-96 object-cover rounded-xl"
        />

        <h1 className="text-4xl font-bold mt-6">
          Gunung Ciremai
        </h1>

        <p className="text-gray-600 mt-2">
          Jawa Barat
        </p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">
            Deskripsi
          </h2>

          <p>
            Gunung Ciremai merupakan gunung tertinggi di Jawa Barat
            dengan panorama alam yang indah.
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-3">
            Jalur Pendakian
          </h2>

          <ul className="list-disc ml-6">
            <li>Apuy</li>
            <li>Linggarjati</li>
            <li>Palutungan</li>
          </ul>
        </div>

        <Link
          to="/user/login"
          className="inline-block mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Pesan Tiket
        </Link>

      </div>
    </UserLayout>
  );
}