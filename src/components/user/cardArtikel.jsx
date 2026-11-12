import { Link } from "react-router-dom";

const CardArtikel = ({ artikel }) => {
  const title = artikel?.judul || artikel?.title || "Artikel";
  const desc = artikel?.deskripsi || artikel?.description || artikel?.ringkasan || "";
  const rawImage = artikel?.gambar || artikel?.image || artikel?.thumbnail || artikel?.foto;

  let apiOrigin = "";
  try {
    apiOrigin = new URL(process.env.REACT_APP_API_URL || "").origin;
  } catch {
    apiOrigin = "";
  }

  const imageUrl = rawImage
    ? /^https?:\/\//i.test(rawImage)
      ? rawImage
      : apiOrigin
      ? `${apiOrigin}/storage/${String(rawImage).replace(/^\/+/, "")}`
      : rawImage
    : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <img src={imageUrl} alt={title} className="w-full h-56 object-cover" />

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#244275]">{title}</h3>

        {desc ? (
          <p className="text-slate-600 text-sm mt-2 line-clamp-3">{desc}</p>
        ) : null}

        <div className="mt-auto pt-4">
          <Link
            to={`/artikel/${artikel?.id}`}
            className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardArtikel;