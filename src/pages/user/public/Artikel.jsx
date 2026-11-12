import React, { useEffect, useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import CardArtikel from "../../../components/user/cardArtikel";
import { getArtikels } from "../../../services/user/artikelService";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

export default function Artikel() {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtikels = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getArtikels();
        const list = extractList(res);
        setArtikels(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log("ERROR ARTIKEL:", err.response?.data || err);
        setError("Gagal memuat artikel. Silakan coba lagi.");
        setArtikels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtikels();
  }, []);

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#244275] mb-2">
          Artikel Pendakian
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Informasi, tips, dan panduan seputar pendakian gunung.
        </p>

        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Memuat artikel...
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-red-500">
            {error}
          </div>
        ) : artikels.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Belum ada artikel yang tersedia.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {artikels.map((item) => (
              <CardArtikel key={item.id} artikel={item} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
