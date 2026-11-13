import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getBasecampDetail,
  getBasecampJalurs,
} from "../../../services/user/basecampService";
import { createBooking } from "../../../services/user/tiketService";
import { getPromos } from "../../../services/user/promoService";

const extractItem = (res) =>
  res?.data?.data || res?.data?.basecamp || res?.data || null;

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

const resolveImage = (value, fallback) => {
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  try {
    const origin = new URL(process.env.REACT_APP_API_URL || "").origin;
    return `${origin}/storage/${String(value).replace(/^\/+/, "")}`;
  } catch {
    return value;
  }
};

export default function DetailBasecamp() {
  const { id, basecampId } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [basecamp, setBasecamp] = useState(null);
  const [jalurs, setJalurs] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingMsg, setBookingMsg] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    tanggal_masuk: "",
    tanggal_keluar: "",
    jumlah_pendaki: 1,
    jalur: "",
    jalur_id: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const [basecampRes, promoRes] = await Promise.allSettled([
          getBasecampDetail(basecampId),
          getPromos(),
        ]);

        if (basecampRes.status === "fulfilled") {
          const data = extractItem(basecampRes.value);
          setBasecamp(data);

          let jalurList = [];
          const embedded = data?.jalurs || data?.jalur || data?.trails || data?.routes;
          if (Array.isArray(embedded)) {
            jalurList = embedded;
          } else {
            try {
              const jalurRes = await getBasecampJalurs(basecampId);
              const list = extractList(jalurRes);
              jalurList = Array.isArray(list) ? list : [];
            } catch (err) {
              console.log("ERROR JALUR BASECAMP:", err.response?.data || err);
              jalurList = [];
            }
          }
          setJalurs(Array.isArray(jalurList) ? jalurList : []);
        } else {
          throw basecampRes.reason;
        }

        if (promoRes.status === "fulfilled") {
          const list = extractList(promoRes.value);
          setPromos(Array.isArray(list) ? list : []);
        } else {
          console.log("ERROR PROMO BASECAMP:", promoRes.reason);
          setPromos([]);
        }
      } catch (err) {
        console.log("ERROR DETAIL BASECAMP:", err.response?.data || err);
        setError("Gagal memuat detail basecamp. Silakan coba lagi.");
        setBasecamp(null);
        setJalurs([]);
      } finally {
        setLoading(false);
      }
    };

    if (basecampId) fetchDetail();
  }, [basecampId]);

  const normalizedJalurs = useMemo(() => {
    return jalurs.map((j, idx) => {
      if (typeof j === "string") return { id: idx, nama: j };
      return {
        id: j.id ?? idx,
        nama: j.nama || j.name || j.nama_jalur || j.jalur || `Jalur ${idx + 1}`,
        status: j.status || j.status_jalur || null,
        kuota: j.kuota ?? j.kuota_harian ?? j.sisa_kuota ?? null,
      };
    });
  }, [jalurs]);

  const relatedPromos = useMemo(() => {
    if (!basecamp) return promos;
    const gunungId = basecamp?.gunung_id || basecamp?.gunung?.id || id;
    const filtered = promos.filter((p) => {
      const pGunung =
        p.gunung_id ?? p.gunungId ?? p.mountain_id ?? p.gunung?.id;
      const pBasecamp =
        p.basecamp_id ?? p.basecampId ?? p.basecamp?.id;
      if (pBasecamp && String(pBasecamp) === String(basecampId)) return true;
      if (pGunung && String(pGunung) === String(gunungId)) return true;
      return false;
    });
    return filtered.length > 0 ? filtered : promos;
  }, [promos, basecamp, basecampId, id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg({ type: "", text: "" });

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!form.tanggal_masuk) {
      setBookingMsg({ type: "error", text: "Tanggal masuk wajib diisi." });
      return;
    }
    if (!form.tanggal_keluar) {
      setBookingMsg({ type: "error", text: "Tanggal keluar wajib diisi." });
      return;
    }
    if (form.tanggal_keluar < form.tanggal_masuk) {
      setBookingMsg({ type: "error", text: "Tanggal keluar tidak boleh sebelum tanggal masuk." });
      return;
    }
    if (normalizedJalurs.length > 0 && !form.jalur && !form.jalur_id) {
      setBookingMsg({ type: "error", text: "Pilih jalur pendakian terlebih dahulu." });
      return;
    }

    const gunungId = basecamp?.gunung_id || basecamp?.gunung?.id || id;

    try {
      setSubmitting(true);
      await createBooking({
        gunung_id: gunungId ? Number(gunungId) : gunungId,
        basecamp_id: Number(basecampId) || basecampId,
        jalur: form.jalur || undefined,
        jalur_id: form.jalur_id || undefined,
        tanggal_masuk: form.tanggal_masuk,
        tanggal_keluar: form.tanggal_keluar,
        tanggal: form.tanggal_masuk,
        tanggal_naik: form.tanggal_masuk,
        jumlah_pendaki: Number(form.jumlah_pendaki) || 1,
      });
      setBookingMsg({ type: "success", text: "Pemesanan berhasil dibuat. Cek tiket kamu di halaman Tiket Saya." });
      setForm((prev) => ({ ...prev, tanggal_masuk: "", tanggal_keluar: "", jumlah_pendaki: 1 }));
    } catch (err) {
      console.log("ERROR BOOKING:", err.response?.data || err);
      setBookingMsg({
        type: "error",
        text: err.response?.data?.message || "Gagal membuat pemesanan. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/gunung/${id}`)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#244275] shadow-sm hover:bg-slate-50"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200 text-slate-500">
            Memuat detail basecamp...
          </div>
        </div>
      </div>
    );
  }

  if (error || !basecamp) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/gunung/${id}`)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[#244275] shadow-sm hover:bg-slate-50"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <p className="text-red-500">{error || "Data basecamp tidak ditemukan."}</p>
          </div>
        </div>
      </div>
    );
  }

  const nama = basecamp.nama || basecamp.name || "Basecamp";
  const lokasi = basecamp.lokasi || basecamp.location || basecamp.alamat || "-";
  const deskripsi = basecamp.deskripsi || basecamp.description || "Informasi deskripsi basecamp belum tersedia.";
  const harga = basecamp.harga_tiket ?? basecamp.harga ?? basecamp.price;
  const image = resolveImage(
    basecamp.foto_utama || basecamp.foto || basecamp.image || basecamp.gambar,
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  );
  const gunungNama = basecamp.gunung?.nama || basecamp.nama_gunung || "";

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      {/* HERO: foto basecamp (opacity < 100) + info kiri + form kanan */}
      <section className="relative overflow-hidden">
        <img
          src={image}
          alt={nama}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#244275]/85 via-[#244275]/55 to-[#244275]/35"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10">
          <button
            type="button"
            onClick={() => navigate(`/gunung/${id}`)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 mb-6"
            aria-label="Kembali ke detail gunung"
          >
            <ArrowLeft size={20} />
          </button>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* KIRI: nama & deskripsi */}
              <div className="lg:col-span-2 text-white space-y-4">
                {gunungNama ? (
                  <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {gunungNama}
                  </span>
                ) : null}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{nama}</h1>
                <p className="text-blue-100 text-sm md:text-base">{lokasi}</p>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 md:p-6 max-w-2xl">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-blue-100 mb-2">Tentang Basecamp</h2>
                  <p className="text-sm md:text-base text-white/95 leading-relaxed whitespace-pre-line">
                    {deskripsi}
                  </p>
                  {harga !== null && harga !== undefined && harga !== "" ? (
                    <p className="mt-4 text-sm">
                      <span className="text-blue-100">Harga tiket: </span>
                      <span className="font-bold text-[#f3e03b]">
                        Rp {Number(harga).toLocaleString("id-ID")}
                      </span>
                    </p>
                  ) : null}
                </div>

                {normalizedJalurs.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-100 mb-3">
                      Pilih Jalur
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {normalizedJalurs.map((j) => {
                        const selected = String(form.jalur_id) === String(j.id) || form.jalur === j.nama;
                        return (
                          <button
                            type="button"
                            key={j.id}
                            onClick={() => setForm((prev) => ({ ...prev, jalur: j.nama, jalur_id: j.id }))}
                            className={`text-left px-4 py-3 rounded-xl border transition-all ${
                              selected
                                ? "bg-white text-[#244275] border-white"
                                : "bg-white/5 text-white border-white/20 hover:bg-white/10"
                            }`}
                          >
                            <p className="font-semibold text-sm">{j.nama}</p>
                            {(j.status || j.kuota !== null) && (
                              <p className={`text-xs mt-1 ${selected ? "text-slate-500" : "text-blue-100/80"}`}>
                                {j.status ? String(j.status).toUpperCase() : ""}
                                {j.status && j.kuota !== null && j.kuota !== undefined ? " • " : ""}
                                {j.kuota !== null && j.kuota !== undefined ? `Kuota: ${j.kuota}` : ""}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* KANAN: form booking */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6 space-y-4 lg:sticky lg:top-24">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Form Pemesanan</p>
                    <h3 className="text-lg font-bold text-[#244275]">Booking Basecamp</h3>
                  </div>

                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600">
                        Silakan login terlebih dahulu untuk melakukan pemesanan.
                      </p>
                      <Link
                        to="/login"
                        className="w-full block text-center bg-[#244275] hover:bg-[#1a325a] text-white text-sm font-bold py-3 px-4 rounded-xl transition-all"
                      >
                        Login untuk Booking
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleBooking} className="space-y-4">
                      {bookingMsg.text ? (
                        <div
                          className={`text-sm rounded-lg px-3 py-2 border ${
                            bookingMsg.type === "success"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {bookingMsg.text}
                          {bookingMsg.type === "success" ? (
                            <div className="mt-2">
                              <Link to="/riwayat" className="font-bold underline">Lihat Riwayat</Link>
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {normalizedJalurs.length > 0 && (
                        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          Jalur dipilih: <span className="font-bold text-[#244275]">{form.jalur || "-"}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Tanggal Masuk
                        </label>
                        <input
                          type="date"
                          value={form.tanggal_masuk}
                          onChange={(e) => setForm({ ...form, tanggal_masuk: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Tanggal Keluar
                        </label>
                        <input
                          type="date"
                          value={form.tanggal_keluar}
                          onChange={(e) => setForm({ ...form, tanggal_keluar: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                          Jumlah Pendaki
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={form.jumlah_pendaki}
                          onChange={(e) => setForm({ ...form, jumlah_pendaki: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275]"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-sm transition-all"
                      >
                        {submitting ? "Memproses..." : "Pesan Sekarang"}
                      </button>
                    </form>
                  )}

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROMO TERKAIT */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#244275]">Promo Terkait</h2>
              <p className="text-sm text-slate-500">Penawaran dan promo yang tersedia</p>
            </div>
          </div>

          {relatedPromos.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 shadow-sm">
              Belum ada promo terkait saat ini.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPromos.map((promo, idx) => {
                const title = promo.judul || promo.title || promo.nama || "Promo";
                const desc = promo.deskripsi || promo.description || "";
                const code = promo.kode || promo.code || promo.kode_promo;
                const valid = promo.masa_berlaku || promo.masaBerlaku || promo.berlaku_sampai || promo.end_date;
                const pImg = resolveImage(
                  promo.gambar || promo.image || promo.banner || promo.foto,
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
                );
                return (
                  <div
                    key={promo.id ?? idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-36 overflow-hidden">
                      <img src={pImg} alt={title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-[#244275]">{title}</h3>
                      {desc ? <p className="text-sm text-slate-600 line-clamp-2">{desc}</p> : null}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {code ? (
                          <span className="text-xs font-mono font-bold bg-[#f3e03b]/20 text-[#244275] px-2 py-1 rounded">
                            {code}
                          </span>
                        ) : null}
                        {valid ? (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {valid}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
  );
}
