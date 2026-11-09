import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  MapPin,
  Mountain,
  RefreshCcw,
  Ticket,
  Users,
} from "lucide-react";

import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { getBookings } from "../../../services/user/tiketService";
import { getPengajuan } from "../../../services/user/pengajuanService";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

const formatTanggal = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "confirmed":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "checkin":
      return "bg-green-100 text-green-700 border-green-300";
    case "completed":
      return "bg-slate-200 text-slate-700 border-slate-300";
    case "approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-slate-100 text-slate-600 border-slate-300";
  }
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase border-2 ${getStatusColor(
      status
    )}`}
  >
    {status || "-"}
  </span>
);

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-slate-300 mb-4">{icon}</div>
      <p className="text-slate-400 italic">{message}</p>
    </div>
  );
}

export default function Riwayat() {
  const [activeTab, setActiveTab] = useState("pemesanan");

  const [pemesanan, setPemesanan] = useState([]);
  const [pendaftaran, setPendaftaran] = useState([]);

  const [loadingPemesanan, setLoadingPemesanan] = useState(true);
  const [loadingPendaftaran, setLoadingPendaftaran] = useState(true);

  const loadPemesanan = useCallback(async () => {
    try {
      setLoadingPemesanan(true);

      const res = await getBookings();
      setPemesanan(extractList(res));
    } catch (err) {
      console.log("ERROR PEMESANAN:", err.response?.data || err);
    } finally {
      setLoadingPemesanan(false);
    }
  }, []);

  const loadPendaftaran = useCallback(async () => {
    try {
      setLoadingPendaftaran(true);

      const res = await getPengajuan();
      const list = extractList(res);

      // Tampilkan hanya pengajuan pendaftaran admin gunung bila tipenya tersedia.
      setPendaftaran(
        list.filter(
          (item) =>
            !item.request_type ||
            String(item.request_type).toLowerCase().includes("gunung")
        )
      );
    } catch (err) {
      console.log("ERROR PENDAFTARAN:", err.response?.data || err);
    } finally {
      setLoadingPendaftaran(false);
    }
  }, []);

  useEffect(() => {
    loadPemesanan();
    loadPendaftaran();
  }, [loadPemesanan, loadPendaftaran]);

  const tabs = [
    {
      key: "pemesanan",
      label: "Pemesanan",
      icon: <Ticket size={18} />,
      count: pemesanan.length,
    },
    {
      key: "pendaftaran",
      label: "Riwayat Pendaftaran Admin Gunung",
      icon: <Mountain size={18} />,
      count: pendaftaran.length,
    },
  ];

  return (
    <UserPrivateLayout>
      <div className="bg-[#f8fafc] min-h-screen -mx-4 -my-6 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244275] tracking-tight">
              Riwayat
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Lihat riwayat pemesanan tiket dan pendaftaran admin gunung kamu.
            </p>
          </div>

          {/* TABS */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#244275] text-white shadow"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {tab.icon}
                  <span className="text-center">{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* TAB PEMESANAN */}
          {activeTab === "pemesanan" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#244275]/10 flex items-center justify-center text-[#244275]">
                    <Ticket size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#244275]">
                      Riwayat Pemesanan Tiket
                    </h2>
                    <p className="text-xs text-slate-400">
                      Seluruh tiket yang pernah kamu pesan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={loadPemesanan}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#244275] text-sm font-bold transition-all"
                >
                  <RefreshCcw size={16} />
                  Muat Ulang
                </button>
              </div>

              {loadingPemesanan ? (
                <div className="py-16 text-center text-slate-400">
                  Memuat riwayat pemesanan...
                </div>
              ) : pemesanan.length === 0 ? (
                <EmptyState
                  icon={<Ticket size={56} />}
                  message="Belum ada riwayat pemesanan."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {pemesanan.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mountain
                              size={18}
                              className="text-[#244275] shrink-0"
                            />
                            <h3 className="font-bold text-[#244275]">
                              {item.gunung?.nama ||
                                item.gunung_nama ||
                                item.gunung ||
                                "-"}
                            </h3>
                          </div>

                          {item.jalur?.nama && (
                            <p className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin size={15} className="shrink-0" />
                              Jalur {item.jalur.nama}
                            </p>
                          )}

                          <p className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={15} className="shrink-0" />
                            Tanggal naik:{" "}
                            {formatTanggal(
                              item.tanggal_naik || item.tanggal
                            )}
                          </p>

                          {item.jumlah_pendaki && (
                            <p className="flex items-center gap-2 text-sm text-slate-500">
                              <Users size={15} className="shrink-0" />
                              {item.jumlah_pendaki} pendaki
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right space-y-2">
                          <StatusBadge status={item.status} />

                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            Kode Booking
                          </p>

                          <p className="font-extrabold tracking-widest text-[#244275] break-all">
                            {item.kode_booking || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB RIWAYAT PENDAFTARAN ADMIN GUNUNG */}
          {activeTab === "pendaftaran" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#244275]/10 flex items-center justify-center text-[#244275]">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#244275]">
                      Riwayat Pendaftaran Admin Gunung
                    </h2>
                    <p className="text-xs text-slate-400">
                      Status pengajuan pendaftaran admin gunung kamu.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={loadPendaftaran}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#244275] text-sm font-bold transition-all"
                >
                  <RefreshCcw size={16} />
                  Muat Ulang
                </button>
              </div>

              {loadingPendaftaran ? (
                <div className="py-16 text-center text-slate-400">
                  Memuat riwayat pendaftaran...
                </div>
              ) : pendaftaran.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList size={56} />}
                  message="Belum ada riwayat pendaftaran admin gunung."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendaftaran.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mountain
                              size={18}
                              className="text-[#244275] shrink-0"
                            />
                            <h3 className="font-bold text-[#244275]">
                              {item.nama_gunung ||
                                item.gunung?.nama ||
                                item.nama ||
                                "Pendaftaran Admin Gunung"}
                            </h3>
                          </div>

                          {item.lokasi && (
                            <p className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin size={15} className="shrink-0" />
                              {item.lokasi}
                            </p>
                          )}

                          <p className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={15} className="shrink-0" />
                            Diajukan: {formatTanggal(item.created_at)}
                          </p>

                          {item.deskripsi && (
                            <p className="text-sm text-slate-500 max-w-xl">
                              {item.deskripsi}
                            </p>
                          )}

                          {(item.reason || item.alasan_penolakan) && (
                            <p className="text-sm text-red-500">
                              Alasan penolakan:{" "}
                              {item.reason || item.alasan_penolakan}
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </UserPrivateLayout>
  );
}
