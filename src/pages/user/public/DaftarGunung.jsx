import React, { useEffect, useMemo, useState } from "react";
import UserLayout from "../../../layouts/UserLayout";
import CardGunung from "../cardGunung";
import { getGunungs } from "../../../services/user/gunungService";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

export default function DaftarGunung() {
  const [gunungs, setGunungs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState("Semua");

  useEffect(() => {
    const fetchGunungs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getGunungs();
        const list = extractList(res);
        setGunungs(Array.isArray(list) ? list : []);
      } catch (err) {
        console.log("ERROR DAFTAR GUNUNG:", err.response?.data || err);
        setError("Gagal memuat daftar gunung. Silakan coba lagi.");
        setGunungs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGunungs();
  }, []);

  const lokasiOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        gunungs
          .map((g) => g.lokasi || g.location || g.provinsi)
          .filter(Boolean)
      )
    );
    return ["Semua", ...unique];
  }, [gunungs]);

  const filteredGunungs = useMemo(() => {
    return gunungs.filter((gunung) => {
      const nama = (gunung.nama || gunung.name || "").toLowerCase();
      const lokasi = gunung.lokasi || gunung.location || gunung.provinsi || "";
      const matchesSearch = nama.includes(searchQuery.toLowerCase());
      const matchesLokasi =
        selectedLokasi === "Semua" || lokasi === selectedLokasi;
      return matchesSearch && matchesLokasi;
    });
  }, [gunungs, searchQuery, selectedLokasi]);

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold text-[#244275]">
            Daftar Gunung
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Temukan dan pilih gunung favoritmu untuk memulai petualangan
            pendakian.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gunung..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#244275] bg-slate-50 text-xs md:text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden md:inline">
              Filter:
            </span>
            {lokasiOptions.map((lokasi) => (
              <button
                key={lokasi}
                onClick={() => setSelectedLokasi(lokasi)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedLokasi === lokasi
                    ? "bg-[#244275] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {lokasi}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Memuat daftar gunung...
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-red-500">
            {error}
          </div>
        ) : filteredGunungs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredGunungs.map((gunung) => (
              <CardGunung key={gunung.id} gunung={gunung} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-3xl mb-2">⛰️</div>
            <h3 className="text-base font-bold text-[#244275] mb-1">
              Gunung Tidak Ditemukan
            </h3>
            <p className="text-xs text-slate-500">
              {gunungs.length === 0
                ? "Belum ada data gunung yang tersedia."
                : "Coba kata kunci lain atau ubah pilihan filter wilayah."}
            </p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
