import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getGunungDetail } from "../../../services/user/gunungService";
import { getBasecampsByGunung } from "../../../services/user/basecampService";

const extractItem = (res) =>
  res?.data?.data || res?.data?.gunung || res?.data || null;

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

const resolveImage = (value) => {
  if (!value) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b";
  if (/^https?:\/\//i.test(value)) return value;
  try {
    const origin = new URL(process.env.REACT_APP_API_URL || "").origin;
    return `${origin}/storage/${String(value).replace(/^\/+/, "")}`;
  } catch {
    return value;
  }
};

export default function DetailGunung() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gunung, setGunung] = useState(null);
  const [basecamps, setBasecamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const gunungRes = await getGunungDetail(id);
        const gunungData = extractItem(gunungRes);
        setGunung(gunungData);

        // Coba ambil basecamp dari relasi gunung dulu, jika tidak ada fetch endpoint khusus
        let bcList = [];
        const embedded =
          gunungData?.basecamps ||
          gunungData?.basecamp ||
          gunungData?.base_camps ||
          gunungData?.basecamp_list ||
          gunungData?.data?.basecamps;

        if (Array.isArray(embedded) && embedded.length > 0) {
          bcList = embedded;
        } else {
          try {
            const bcRes = await getBasecampsByGunung(id);
            const list = extractList(bcRes);
            bcList = Array.isArray(list) ? list : [];
          } catch (err) {
            console.log("ERROR BASECAMP BY GUNUNG:", err.response?.data || err);
            bcList = Array.isArray(embedded) ? embedded : [];
          }
        }

        // Filter berdasarkan gunung jika endpoint mengembalikan semua basecamp
        const filtered = (Array.isArray(bcList) ? bcList : []).filter((bc) => {
          const bcGunungId =
            bc.gunung_id ??
            bc.gunungId ??
            bc.mountain_id ??
            bc.gunung?.id ??
            bc.mountain?.id;
          if (bcGunungId === undefined || bcGunungId === null || bcGunungId === "") return true;
          return String(bcGunungId) === String(id);
        });

        setBasecamps(filtered.length > 0 ? filtered : (Array.isArray(bcList) ? bcList : []));
      } catch (err) {
        console.log("ERROR DETAIL GUNUNG:", err.response?.data || err);
        setError("Gagal memuat detail gunung. Silakan coba lagi.");
        setGunung(null);
        setBasecamps([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const normalizedBasecamps = useMemo(() => {
    return basecamps.map((bc, idx) => ({
      id: bc.id ?? idx,
      nama: bc.nama || bc.name || `Basecamp ${idx + 1}`,
      lokasi: bc.lokasi || bc.location || bc.alamat || "-",
      harga_tiket: bc.harga_tiket ?? bc.harga ?? bc.price ?? null,
      foto: bc.foto_utama || bc.foto || bc.image || bc.gambar || null,
      deskripsi: bc.deskripsi || bc.description || "",
      raw: bc,
    }));
  }, [basecamps]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={() => navigate("/gunung")}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#244275] shadow-sm hover:bg-slate-50"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Memuat detail gunung...
          </div>
        </div>
      </div>
    );
  }

  if (error || !gunung) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={() => navigate("/gunung")}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#244275] shadow-sm hover:bg-slate-50"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <p className="text-red-500 mb-4">{error || "Data gunung tidak ditemukan."}</p>
            <button
              type="button"
              onClick={() => navigate("/gunung")}
              className="text-[#244275] font-bold hover:underline"
            >
              Kembali ke daftar gunung
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nama = gunung.nama || gunung.name || "Gunung";
  const lokasi = gunung.lokasi || gunung.location || gunung.provinsi || "-";
  const deskripsi = gunung.deskripsi || gunung.description || "Informasi deskripsi belum tersedia.";
  const image = resolveImage(gunung.gambar || gunung.image || gunung.foto || gunung.foto_utama);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <button
          type="button"
          onClick={() => navigate("/gunung")}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#244275] shadow-sm hover:bg-slate-50"
          aria-label="Kembali ke daftar gunung"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-[360px]">
          <img src={image} alt={nama} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
            <div className="text-white space-y-1">
              <span className="bg-[#244275] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {lokasi}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight pt-2">
                {nama}
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-[#244275] border-b border-slate-100 pb-2">
            Deskripsi Gunung
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {deskripsi}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#244275]">Daftar Basecamp</h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih basecamp untuk melihat detail dan melakukan pemesanan.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {normalizedBasecamps.length} basecamp
            </span>
          </div>

          {normalizedBasecamps.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              <p className="font-semibold text-[#244275] mb-1">Belum ada basecamp tersedia</p>
              <p className="text-sm">Informasi basecamp untuk gunung ini belum tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {normalizedBasecamps.map((bc) => (
                <div
                  key={bc.id}
                  className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col"
                >
                  <div className="h-40 bg-slate-100 overflow-hidden">
                    <img
                      src={resolveImage(bc.foto)}
                      alt={bc.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-[#244275] text-base">{bc.nama}</h3>
                    <p className="text-xs text-slate-500 mt-1">{bc.lokasi}</p>
                    {bc.harga_tiket !== null && bc.harga_tiket !== undefined && bc.harga_tiket !== "" ? (
                      <p className="text-sm font-semibold text-green-700 mt-2">
                        Rp {Number(bc.harga_tiket).toLocaleString("id-ID")}
                        <span className="text-xs font-normal text-slate-400"> / tiket</span>
                      </p>
                    ) : null}
                    {bc.deskripsi ? (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{bc.deskripsi}</p>
                    ) : null}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <Link
                        to={`/gunung/${id}/basecamp/${bc.id}`}
                        className="inline-flex items-center justify-center w-full bg-[#244275] hover:bg-[#1a325a] text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-all"
                      >
                        Lihat Detail Basecamp
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
