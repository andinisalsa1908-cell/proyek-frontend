import React from "react";
import { useParams } from "react-router-dom";

export default function DetailArtikel() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
        alt=""
        className="w-full h-96 object-cover rounded-xl mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">
        Tips Mendaki Gunung dengan Aman
      </h1>

      <p className="text-gray-700 leading-8">
        Ini halaman detail artikel id: {id}. Isi artikel nanti
        bisa dari backend.
      </p>
    </div>
  );
}