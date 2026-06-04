import React from "react";
import UserLayout from "../../../layouts/UserLayout";

export default function DetailArtikel() {
  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">

        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt="Artikel"
          className="w-full h-96 object-cover rounded-xl"
        />

        <h1 className="text-4xl font-bold mt-6">
          Tips Pendakian Aman
        </h1>

        <p className="text-gray-500 mt-2">
          Dipublikasikan 1 Juni 2026
        </p>

        <div className="mt-6 space-y-4">
          <p>
            Sebelum melakukan pendakian pastikan kondisi fisik
            dalam keadaan baik.
          </p>

          <p>
            Gunakan perlengkapan yang sesuai dan ikuti aturan
            yang berlaku di setiap jalur pendakian.
          </p>

          <p>
            Selalu menjaga kebersihan dan kelestarian alam.
          </p>
        </div>

      </div>
    </UserLayout>
  );
}