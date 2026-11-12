import { Link } from "react-router-dom";

const CardGunung = ({ gunung }) => {
  const rawNama = gunung?.nama || gunung?.name || "";
  const namaGunung = rawNama ? rawNama.replace(/^Gunung\s+/i, "") : "Gunung";
  const lokasi = gunung?.lokasi || gunung?.location || gunung?.provinsi || "";

  const apiBase = process.env.REACT_APP_API_URL || "";
  let apiOrigin = "";
  try {
    apiOrigin = apiBase ? new URL(apiBase).origin : "";
  } catch {
    apiOrigin = "";
  }

  const rawImage =
    gunung?.gambar ||
    gunung?.image ||
    gunung?.foto ||
    gunung?.foto_utama ||
    gunung?.thumbnail;

  const imageUrl = rawImage
    ? /^https?:\/\//i.test(rawImage)
      ? rawImage
      : apiOrigin
      ? `${apiOrigin}/storage/${String(rawImage).replace(/^\/+/, "")}`
      : rawImage
    : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b";

  return (
    <div className="relative my-4 mx-2">
      <div className="absolute inset-0 bg-[#3b5998]/30 rounded-3xl transform -translate-x-3 translate-y-3 scale-95 -z-10 blur-[1px]"></div>

      <div className="relative rounded-3xl overflow-hidden shadow-xl h-96 flex flex-col justify-end p-6 text-white group bg-slate-800">
        <img
          src={imageUrl}
          alt={rawNama || "Gunung"}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <h3 className="text-3xl font-extrabold mb-2 drop-shadow-md tracking-tight">
            {namaGunung}
          </h3>

          <p className="text-xs md:text-sm text-gray-200 mb-6 max-w-[220px] leading-snug drop-shadow">
            {lokasi
              ? `${lokasi} • Nikmati pengalaman mendaki yang tak tergantikan`
              : "Nikmati pengalaman mendaki yang tak tergantikan"}
          </p>

          <Link
            to={`/gunung/${gunung?.id}`}
            className="inline-block bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold text-xs md:text-sm px-8 py-3 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 tracking-wider uppercase"
          >
            SEE MORE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardGunung;