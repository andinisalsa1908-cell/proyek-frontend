import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import {
  getPeralatans,
  getSewaSaya,
  createSewa,
  cancelSewa,
} from "../../../services/user/sewaService";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

const resolveImage = (value) => {
  if (!value) return "https://images.unsplash.com/photo-1508873696983-2df5c92091c7?auto=format&fit=crop&w=500&q=80";
  if (/^https?:\/\//i.test(value)) return value;
  try {
    const origin = new URL(process.env.REACT_APP_API_URL || "").origin;
    return `${origin}/storage/${String(value).replace(/^\/+/, "")}`;
  } catch {
    return value;
  }
};

export default function SewaPeralatan() {
  const [alatList, setAlatList] = useState([]);
  const [pesananSewa, setPesananSewa] = useState([]);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [jumlahMap, setJumlahMap] = useState({});
  const [loadingAlat, setLoadingAlat] = useState(true);
  const [loadingSewa, setLoadingSewa] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");
  const [notifikasi, setNotifikasi] = useState(null);
  const [modalSukses, setModalSukses] = useState(null);

  const loadAlat = useCallback(async () => {
    try {
      setLoadingAlat(true);
      setError("");
      const res = await getPeralatans();
      const list = extractList(res);
      setAlatList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("ERROR GET PERALATAN:", err.response?.data || err);
      setError("Gagal memuat daftar peralatan.");
      setAlatList([]);
    } finally {
      setLoadingAlat(false);
    }
  }, []);

  const loadSewa = useCallback(async () => {
    try {
      setLoadingSewa(true);
      const res = await getSewaSaya();
      const list = extractList(res);
      setPesananSewa(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("ERROR GET SEWA:", err.response?.data || err);
      setPesananSewa([]);
    } finally {
      setLoadingSewa(false);
    }
  }, []);

  useEffect(() => {
    loadAlat();
    loadSewa();
  }, [loadAlat, loadSewa]);

  const kategoriList = useMemo(() => {
    const fromData = Array.from(
      new Set(
        alatList
          .map((a) => a.kategori || a.category || a.jenis)
          .filter(Boolean)
      )
    );
    return ["Semua", ...fromData];
  }, [alatList]);

  const alatFiltered = useMemo(() => {
    if (kategoriAktif === "Semua") return alatList;
    return alatList.filter(
      (item) => (item.kategori || item.category || item.jenis) === kategoriAktif
    );
  }, [alatList, kategoriAktif]);

  const handleUbahJumlah = (id, delta, max = Infinity) => {
    setJumlahMap((prev) => {
      const current = prev[id] || 1;
      const updated = Math.min(Math.max(1, current + delta), max || Infinity);
      return { ...prev, [id]: updated };
    });
  };

  const handleSewa = async (alat) => {
    const jumlahPesan = jumlahMap[alat.id] || 1;
    const harga = Number(alat.harga || alat.harga_sewa || alat.price || 0);

    try {
      setSubmittingId(alat.id);
      await createSewa({
        peralatan_id: alat.id,
        jumlah: jumlahPesan,
        total_harga: harga * jumlahPesan,
      });

      setModalSukses({ nama: alat.nama || alat.name || "Peralatan", jumlah: jumlahPesan });
      await loadSewa();
    } catch (err) {
      console.log("ERROR CREATE SEWA:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal melakukan penyewaan. Silakan coba lagi.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleBatalSewa = async (id) => {
    if (!id) return;
    if (!window.confirm("Batalkan pesanan sewa ini?")) return;

    try {
      await cancelSewa(id);
      setNotifikasi("Pesanan sewa peralatan berhasil dibatalkan.");
      setTimeout(() => setNotifikasi(null), 3000);
      await loadSewa();
    } catch (err) {
      console.log("ERROR CANCEL SEWA:", err.response?.data || err);
      alert(err.response?.data?.message || "Gagal membatalkan pesanan sewa.");
    }
  };

  return (
    <UserPrivateLayout>
      <div className="min-h-screen bg-gray-50 pb-16 relative -mx-4 -my-6 px-4 sm:px-6 lg:px-8 pt-6">
        {modalSukses && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl font-bold shadow-inner">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h3>
              <p className="text-sm text-gray-600 mb-6">
                Permintaan sewa <span className="font-semibold text-gray-800">{modalSukses.jumlah} {modalSukses.nama}</span> telah dikirim.
              </p>
              <button
                onClick={() => setModalSukses(null)}
                className="w-full bg-[#244275] hover:bg-[#1a3159] text-white py-3 rounded-xl font-semibold transition shadow-md"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244275]">Sewa Peralatan</h1>
            <p className="text-slate-500 text-sm mt-1">Pilih peralatan pendakian yang tersedia dan ajukan penyewaan.</p>
          </div>

          {notifikasi && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between">
              <span className="text-sm font-semibold">{notifikasi}</span>
              <button onClick={() => setNotifikasi(null)} className="text-emerald-700 font-bold text-lg">&times;</button>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-3 overflow-x-auto mb-8 border border-gray-100">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                onClick={() => setKategoriAktif(kat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  kategoriAktif === kat
                    ? "bg-[#244275] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <div className="mb-12">
            {loadingAlat ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
                Memuat peralatan...
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-red-500">
                {error}
              </div>
            ) : alatFiltered.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
                Belum ada peralatan yang tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {alatFiltered.map((alat) => {
                  const qty = jumlahMap[alat.id] || 1;
                  const nama = alat.nama || alat.name || "Peralatan";
                  const kategori = alat.kategori || alat.category || alat.jenis || "-";
                  const harga = Number(alat.harga || alat.harga_sewa || alat.price || 0);
                  const stok = alat.stok ?? alat.stock ?? alat.jumlah ?? "-";
                  const stokNum = typeof stok === "number" ? stok : Number(stok);
                  const maxQty = Number.isFinite(stokNum) && stokNum > 0 ? stokNum : 999;

                  return (
                    <div
                      key={alat.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between border border-gray-100 group"
                    >
                      <div>
                        <div className="bg-gray-100 h-44 rounded-xl mb-4 overflow-hidden relative">
                          <img
                            src={resolveImage(alat.gambar || alat.image || alat.foto || alat.thumbnail)}
                            alt={nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
                            Stok: {stok}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{nama}</h3>
                        <p className="text-xs text-gray-500 mb-2">{kategori}</p>
                        <p className="text-[#244275] font-bold text-lg">
                          Rp {harga.toLocaleString("id-ID")}
                          <span className="text-xs text-gray-500 font-normal">/Hari</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-gray-600">Jumlah:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <button
                              onClick={() => handleUbahJumlah(alat.id, -1, maxQty)}
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition text-sm"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-sm font-bold text-gray-800 bg-white">{qty}</span>
                            <button
                              onClick={() => handleUbahJumlah(alat.id, 1, maxQty)}
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSewa(alat)}
                          disabled={submittingId === alat.id || (Number.isFinite(stokNum) && stokNum <= 0)}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition shadow-sm"
                        >
                          {submittingId === alat.id ? "Memproses..." : "Sewa Sekarang"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#244275]">Pesanan Sewa Saya</h2>
              <button
                onClick={loadSewa}
                className="text-sm font-semibold text-[#244275] hover:underline"
              >
                Muat ulang
              </button>
            </div>

            {loadingSewa ? (
              <p className="text-gray-500 italic py-4">Memuat pesanan sewa...</p>
            ) : pesananSewa.length === 0 ? (
              <p className="text-gray-500 italic py-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Belum ada peralatan yang disewa saat ini.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#244275] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-l-lg">Nama Alat</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-r-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pesananSewa.map((item, idx) => {
                      const nama =
                        item.peralatan?.nama ||
                        item.peralatan?.name ||
                        item.nama_alat ||
                        item.nama ||
                        "Peralatan";
                      const kategori =
                        item.peralatan?.kategori ||
                        item.peralatan?.category ||
                        item.kategori ||
                        "-";
                      const jumlah = item.jumlah ?? item.qty ?? 1;
                      const total = Number(item.total_harga || item.total || item.harga_total || 0);
                      const status = String(item.status || "pending");
                      const canCancel = ["pending", "menunggu", "approved"].includes(status.toLowerCase());

                      return (
                        <tr key={item.id ?? idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{nama}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{kategori}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800">{jumlah} Pcs</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#244275] font-bold">
                            Rp {total.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-slate-100 text-slate-700 capitalize">
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            {canCancel && item.id ? (
                              <button
                                onClick={() => handleBatalSewa(item.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-lg border border-red-200 transition font-semibold text-xs"
                              >
                                Batalkan
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserPrivateLayout>
  );
}
