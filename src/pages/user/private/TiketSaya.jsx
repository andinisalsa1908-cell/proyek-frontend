import { useCallback, useEffect, useState } from "react";
import { CalendarDays, MapPin, Mountain, RefreshCcw, Ticket } from "lucide-react";

import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import {
  getBookings,
  cancelBooking,
} from "../../../services/user/tiketService";

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
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "confirmed":
    case "approved":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "checkin":
    case "checked_in":
      return "bg-green-100 text-green-700 border-green-300";
    case "completed":
    case "selesai":
      return "bg-slate-200 text-slate-700 border-slate-300";
    case "cancelled":
    case "canceled":
    case "rejected":
    case "ditolak":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-slate-100 text-slate-600 border-slate-300";
  }
};

const canCancel = (status) => {
  const s = String(status || "").toLowerCase();
  return ["pending", "confirmed", "approved"].includes(s);
};

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-slate-300 mb-4">{icon}</div>
      <p className="text-slate-400 italic">{message}</p>
    </div>
  );
}

export default function TiketSaya() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getBookings();
      const list = extractList(res);
      setTickets(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("ERROR TIKET SAYA:", err.response?.data || err);
      setError("Gagal memuat tiket. Silakan coba lagi.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCancel = async (id) => {
    if (!window.confirm("Yakin ingin membatalkan tiket ini?")) return;

    try {
      await cancelBooking(id);
      await loadTickets();
    } catch (err) {
      console.log("ERROR BATAL TIKET:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          "Gagal membatalkan tiket. Silakan coba lagi."
      );
    }
  };

  return (
    <UserPrivateLayout>
      <div className="bg-[#f8fafc] min-h-screen -mx-4 -my-6 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244275] tracking-tight">
              Tiket Saya
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Lihat dan kelola tiket pendakian yang sudah kamu pesan.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#244275]/10 flex items-center justify-center text-[#244275]">
                  <Ticket size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#244275]">
                    Daftar Tiket
                  </h2>
                  <p className="text-xs text-slate-400">
                    Status pemesanan tiket kamu.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadTickets}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#244275] text-sm font-bold transition-all"
              >
                <RefreshCcw size={16} />
                Muat Ulang
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">
                Memuat tiket...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-500 px-6">
                {error}
              </div>
            ) : tickets.length === 0 ? (
              <EmptyState
                icon={<Ticket size={56} />}
                message="Belum ada tiket yang dipesan."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {tickets.map((ticket, index) => {
                  const gunungNama =
                    ticket.gunung?.nama ||
                    ticket.gunung_nama ||
                    (typeof ticket.gunung === "string" ? ticket.gunung : null) ||
                    "-";
                  const tanggal = formatTanggal(
                    ticket.tanggal_naik || ticket.tanggal
                  );
                  const jalurNama =
                    ticket.jalur?.nama ||
                    (typeof ticket.jalur === "string" ? ticket.jalur : null);

                  return (
                    <div
                      key={ticket.id ?? index}
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
                              {gunungNama}
                            </h3>
                          </div>

                          {jalurNama && (
                            <p className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin size={15} className="shrink-0" />
                              Jalur {jalurNama}
                            </p>
                          )}

                          <p className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={15} className="shrink-0" />
                            Tanggal: {tanggal}
                          </p>

                          {ticket.jumlah_pendaki ? (
                            <p className="text-sm text-slate-500">
                              Jumlah pendaki: {ticket.jumlah_pendaki}
                            </p>
                          ) : null}

                          {ticket.kode_booking ? (
                            <p className="text-xs text-slate-400">
                              Kode booking:{" "}
                              <span className="font-bold tracking-widest text-[#244275]">
                                {ticket.kode_booking}
                              </span>
                            </p>
                          ) : null}
                        </div>

                        <div className="sm:text-right space-y-3">
                          <span
                            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase border-2 ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status || "-"}
                          </span>

                          {canCancel(ticket.status) && ticket.id ? (
                            <div>
                              <button
                                type="button"
                                onClick={() => handleCancel(ticket.id)}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all"
                              >
                                Batalkan
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserPrivateLayout>
  );
}
