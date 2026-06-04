import { Link } from "react-router-dom";

const CardGunung = ({ gunung }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <img
        src={
          gunung.gambar ||
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
        }
        alt={gunung.nama}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">

        <h3 className="text-xl font-bold">
          {gunung.nama}
        </h3>

        <p className="text-gray-600 mt-2">
          {gunung.lokasi}
        </p>

        <Link
          to={`/gunung/${gunung.id}`}
          className="inline-block mt-4 bg-green-700 text-white px-4 py-2 rounded"
        >
          Lihat Detail
        </Link>

      </div>
    </div>
  );
};

export default CardGunung;