import { Link } from "react-router-dom";

const CardArtikel = ({ artikel }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <img
        src={
          artikel.gambar ||
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        }
        alt={artikel.judul}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">

        <h3 className="text-xl font-bold">
          {artikel.judul}
        </h3>

        <p className="text-gray-600 mt-2">
          {artikel.deskripsi}
        </p>

        <Link
          to={`/artikel/${artikel.id}`}
          className="inline-block mt-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Baca Selengkapnya
        </Link>

      </div>
    </div>
  );
};

export default CardArtikel;