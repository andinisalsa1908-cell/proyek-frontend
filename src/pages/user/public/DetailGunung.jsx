import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";
import { getGunungDetail } from "../../../services/user/gunungService";

const extractItem = (res) =>
  res?.data?.data || res?.data?.gunung || res?.data || null;

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
  const [gunung, setGunung] = useState(null);
  const [selectedJalur, setSelectedJalur] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getGunungDetail(id);
        setGunung(extractItem(res));
      } catch (err) {
        console.log("ERROR DETAIL GUNUNG:", err.response?.data || err);
        setError("Gagal memuat detail gunung. Silakan coba lagi.");
        setGunung(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const jalurList = useMemo(() => {
    const raw =
      gunung?.jalur ||
      gunung?.jalurs ||
      gunung?.trails ||
      gunung?.routes ||
      [];
    if (!Array.isArray(raw)) return [];
    return raw.map((j, idx) => {
      if (typeof j === "string") {
        return { id: idx, nama: j, foto: null, status: null };
      }
      return {
        id: j.id ?? idx,
        nama: j.nama || j.name || j.jalur || `Jalur ${idx + 1}`,
        foto: j.foto || j.image || j.gambar || null,
        status: j.status || j.status_jalur || null,
      };
    });
  }, [gunung]);

  if (loading) {
    return (
      <UserLayout>
        <div className="bg-[#f8fafc] min-h-screen pt-10 pb-16 px-6">
          <div className="max-w-5xl mx-auto bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Memuat detail gunung...
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !gunung) {
    return (
      <UserLayout>
        <div className="bg-[#f8fafc] min-h-screen pt-10 pb-16 px-6">
          <div className="max-w-5xl mx-auto bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <p className="text-red-500 mb-4">{error || "Data gunung tidak ditemukan."}</p>
            <Link to="/gunung" className="text-[#244275] font-bold hover:underline">
              Kembali ke daftar gunung
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  const nama = gunung.nama || gunung.name || "Gunung";
  const lokasi = gunung.lokasi || gunung.location || gunung.provinsi || "-";
  const deskripsi = gunung.deskripsi || gunung.description || "Informasi deskripsi belum tersedia.";
  const statusKuota = gunung.status_kuota || gunung.statusKuota || gunung.kuota_status || "Informasi tidak tersedia";
  const statusJalur = gunung.status_jalur || gunung.statusJalur || "Informasi tidak tersedia";
  const image = resolveImage(gunung.gambar || gunung.image || gunung.foto || gunung.foto_utama);

  return (
    <UserLayout>
      <div className="bg-[#f8fafc] min-h-screen pt-4 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
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

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3">
                <h2 className="text-lg font-bold text-[#244275] border-b border-slate-100 pb-2">
                  Deskripsi Gunung
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {deskripsi}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3">
                <h2 className="text-lg font-bold text-[#244275] border-b border-slate-100 pb-2">
                  Jalur Pendakian{" "}
                  {jalurList.length > 0 && (
                    <span className="text-xs font-normal text-slate-400">
                      (Pilih salah satu sebelum memesan)
                    </span>
                  )}
                </h2>

                {jalurList.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    Informasi jalur pendakian belum tersedia.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                    {jalurList.map((jalurObj) => {
                      const isSelected = selectedJalur === jalurObj.nama;
                      return (
                        <div
                          key={jalurObj.id}
                          onClick={() => setSelectedJalur(jalurObj.nama)}
                          className={`rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                            isSelected
                              ? "border-[#244275] ring-2 ring-[#244275] shadow-md bg-blue-50/30"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="h-28 w-full overflow-hidden relative bg-slate-100">
                            <img
                              src={resolveImage(jalurObj.foto) || "https://images.unsplash.com/photo-1519681393784-d120267933ba"}
                              alt={jalurObj.nama}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-[#244275] text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
                                Dipilih ✓
                              </div>
                            )}
                          </div>
                          <div className="p-3 text-center flex-1 flex items-center justify-center flex-col gap-1">
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? "text-[#244275] font-bold" : "text-slate-700"
                              }`}
                            >
                              Jalur {jalurObj.nama}
                            </span>
                            {jalurObj.status ? (
                              <span className="text-[10px] text-slate-400 uppercase">{jalurObj.status}</span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-5 sticky top-24">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Informasi Tiket</span>
                  <h3 className="text-base font-bold text-[#244275]">Pemesanan Online</h3>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between gap-2">
                    <span>Kuota Hari Ini:</span>
                    <strong className="text-emerald-600 text-right">{String(statusKuota)}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Status Jalur:</span>
                    <strong className="text-[#244275] text-right">{String(statusJalur)}</strong>
                  </div>
                  {selectedJalur && (
                    <div className="flex justify-between gap-2 pt-1 border-t border-slate-100">
                      <span>Jalur Dipilih:</span>
                      <strong className="text-green-600 text-right">{selectedJalur}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {jalurList.length === 0 || selectedJalur ? (
                    <Link
                      to={
                        selectedJalur
                          ? `/pesan-tiket?gunung_id=${id}&jalur=${encodeURIComponent(selectedJalur)}`
                          : `/pesan-tiket?gunung_id=${id}`
                      }
                      className="w-full block text-center bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-3 px-4 rounded-lg shadow-sm transition-all"
                    >
                      Pesan Tiket
                    </Link>
                  ) : (
                    <>
                      <button
                        disabled
                        className="w-full block text-center bg-slate-200 text-slate-400 text-xs font-bold py-3 px-4 rounded-lg cursor-not-allowed shadow-none"
                      >
                        Pesan Tiket
                      </button>
                      <p className="text-[11px] text-rose-500 text-center italic mt-1">
                        *pilih jalur terlebih dahulu untuk melanjutkan pesan tiket
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
