import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import { getArtikelDetail } from "../../../services/user/artikelService";

const extractItem = (res) =>
  res?.data?.data || res?.data?.article || res?.data?.artikel || res?.data || null;

const resolveImage = (value) => {
  if (!value) return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";
  if (/^https?:\/\//i.test(value)) return value;
  try {
    const origin = new URL(process.env.REACT_APP_API_URL || "").origin;
    return `${origin}/storage/${String(value).replace(/^\/+/, "")}`;
  } catch {
    return value;
  }
};

const formatTanggal = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function DetailArtikel() {
  const { id } = useParams();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getArtikelDetail(id);
        setArtikel(extractItem(res));
      } catch (err) {
        console.log("ERROR DETAIL ARTIKEL:", err.response?.data || err);
        setError("Gagal memuat detail artikel.");
        setArtikel(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Memuat artikel...
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !artikel) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <p className="text-red-500 mb-4">{error || "Artikel tidak ditemukan."}</p>
            <Link to="/artikel" className="text-[#244275] font-bold hover:underline">
              Kembali ke daftar artikel
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  const title = artikel.judul || artikel.title || "Artikel";
  const image = resolveImage(artikel.gambar || artikel.image || artikel.thumbnail || artikel.foto);
  const date = formatTanggal(artikel.published_at || artikel.created_at || artikel.tanggal);
  const content =
    artikel.konten || artikel.content || artikel.isi || artikel.body || artikel.deskripsi || "";

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <img src={image} alt={title} className="w-full h-72 sm:h-96 object-cover rounded-2xl" />

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#244275] mt-6">{title}</h1>

        {date ? <p className="text-slate-500 text-sm mt-2">Dipublikasikan {date}</p> : null}

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {content ? (
            <div className="text-slate-700 leading-relaxed whitespace-pre-line">{content}</div>
          ) : (
            <p className="text-slate-500 italic">Konten artikel belum tersedia.</p>
          )}
        </div>

        <div className="mt-6">
          <Link to="/artikel" className="text-[#244275] font-bold hover:underline">
            ← Kembali ke artikel
          </Link>
        </div>
      </div>
    </UserLayout>
  );
}
