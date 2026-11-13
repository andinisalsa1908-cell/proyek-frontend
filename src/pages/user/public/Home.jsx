import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import UserLayout from "../../../layouts/UserLayout";
import CardGunung from "../cardGunung";
import { getGunungs } from "../../../services/user/gunungService";
import { getPromos } from "../../../services/user/promoService";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

export default function Home() {
  const [gunungs, setGunungs] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gunungRes, promoRes] = await Promise.allSettled([
          getGunungs(),
          getPromos(),
        ]);

        if (gunungRes.status === "fulfilled") {
          const list = extractList(gunungRes.value);
          setGunungs(Array.isArray(list) ? list : []);
        } else {
          console.log("ERROR HOME GUNUNG:", gunungRes.reason);
          setGunungs([]);
        }

        if (promoRes.status === "fulfilled") {
          const list = extractList(promoRes.value);
          setPromos(Array.isArray(list) ? list : []);
        } else {
          console.log("ERROR HOME PROMO:", promoRes.reason);
          setPromos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const gunungPopuler = useMemo(() => gunungs.slice(0, 3), [gunungs]);

  const prevPromo = () => {
    if (promos.length === 0) return;
    setCurrentPromoIndex((prev) => (prev === 0 ? promos.length - 1 : prev - 1));
  };

  const nextPromo = () => {
    if (promos.length === 0) return;
    setCurrentPromoIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1));
  };

  const promoAktif = promos[currentPromoIndex] || null;

  const promoImage = (promo) => {
    const raw = promo?.bgImage || promo?.gambar || promo?.image || promo?.banner || promo?.foto;
    if (!raw) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop";
    if (/^https?:\/\//i.test(raw)) return raw;
    try {
      const origin = new URL(process.env.REACT_APP_API_URL || "").origin;
      return `${origin}/storage/${String(raw).replace(/^\/+/, "")}`;
    } catch {
      return raw;
    }
  };

  return (
    <UserLayout>
      <section className="bg-[#244275] text-white pt-36 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] bg-[#1a325a] rounded-full opacity-60 pointer-events-none"></div>
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-[#1a325a] rounded-full opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-[#1a325a] rounded-full opacity-70 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide leading-tight">
            Selamat Datang di Website <br />
            SummitGo
          </h1>

          <p className="text-blue-100 text-sm md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            SummitGo adalah platform pemesanan tiket pendakian gunung dan
            penyewaan perlengkapan outdoor secara online yang terintegrasi untuk
            mempermudah pengalaman petualanganmu di seluruh Indonesia.
          </p>

          <Link
            to="/gunung"
            className="inline-block bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold text-base px-12 py-3.5 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-0.5 tracking-wider"
          >
            SEE MORE
          </Link>
        </div>
      </section>

      <div className="bg-[#f1f5f9] py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* BANNER PROMO */}
          <div className="relative group px-0 md:px-8">
            {promos.length === 0 ? (
              <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[240px] md:min-h-[260px] flex items-center">
                <div
                  className="absolute inset-0 bg-cover bg-center scale-105"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop)",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
                <div className="relative z-10 p-6 md:p-10 text-white max-w-2xl w-full">
                  <span className="inline-block bg-[#f3e03b] text-[#244275] font-black text-[10px] md:text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow mb-3">
                    Promo
                  </span>
                  <h3 className="text-xl md:text-3xl font-black tracking-tight mb-2 drop-shadow">
                    Promo Spesial SummitGo
                  </h3>
                  <p className="text-slate-200 text-xs md:text-sm font-normal leading-relaxed max-w-xl">
                    Pantau terus halaman ini untuk informasi promo dan penawaran menarik dari SummitGo.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={prevPromo}
                  className="absolute left-0 md:left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-[#244275] hover:text-white flex items-center justify-center font-bold transition-all z-20 border border-slate-200 cursor-pointer"
                  title="Promo Sebelumnya"
                >
                  &#10094;
                </button>

                <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[240px] md:min-h-[260px] flex items-center transition-all duration-500">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
                    style={{ backgroundImage: `url(${promoImage(promoAktif)})` }}
                  ></div>

                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/30"></div>

                  <div className="relative z-10 p-6 md:p-10 text-white max-w-2xl w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {promoAktif?.tag || promoAktif?.tipe ? (
                        <span className="bg-red-600 text-white font-black text-[10px] md:text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow">
                          {promoAktif.tag || promoAktif.tipe}
                        </span>
                      ) : null}
                      {promoAktif?.masaBerlaku || promoAktif?.masa_berlaku || promoAktif?.berlaku_sampai ? (
                        <span className="bg-white/20 backdrop-blur-md text-amber-300 font-semibold text-[10px] md:text-xs px-3 py-1 rounded-md">
                          {promoAktif.masaBerlaku || promoAktif.masa_berlaku || promoAktif.berlaku_sampai}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-xl md:text-3xl font-black tracking-tight mb-2 drop-shadow">
                      {promoAktif?.judul || promoAktif?.title || promoAktif?.nama || "Promo Spesial"}
                    </h3>

                    <p className="text-slate-200 text-xs md:text-sm mb-4 font-normal leading-relaxed max-w-xl">
                      {promoAktif?.deskripsi || promoAktif?.description || "Lihat detail promo terbaru dari SummitGo."}
                    </p>

                    {(promoAktif?.kode || promoAktif?.code || promoAktif?.kode_promo) ? (
                      <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold">
                        <span className="text-slate-300">Kode Promo:</span>
                        <span className="text-[#f3e03b] tracking-wider">
                          {promoAktif.kode || promoAktif.code || promoAktif.kode_promo}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="absolute bottom-4 right-6 z-10 hidden md:flex gap-1.5">
                    {promos.map((item, index) => (
                      <div
                        key={item.id ?? index}
                        onClick={() => setCurrentPromoIndex(index)}
                        className={`h-2 rounded-full cursor-pointer transition-all ${
                          index === currentPromoIndex ? "w-6 bg-[#f3e03b]" : "w-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={nextPromo}
                  className="absolute right-0 md:right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-[#244275] hover:text-white flex items-center justify-center font-bold transition-all z-20 border border-slate-200 cursor-pointer"
                  title="Promo Selanjutnya"
                >
                  &#10095;
                </button>

                <div className="flex md:hidden justify-center gap-1.5 mt-3">
                  {promos.map((item, index) => (
                    <div
                      key={item.id ?? index}
                      onClick={() => setCurrentPromoIndex(index)}
                      className={`h-1.5 rounded-full cursor-pointer transition-all ${
                        index === currentPromoIndex ? "w-6 bg-[#244275]" : "w-1.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <section className="text-center">
            <h2 className="text-3xl font-extrabold text-[#244275] mb-2">Gunung Populer</h2>
            <p className="text-slate-500 text-sm mb-8">
              Nikmati pengalaman mendaki yang tak tergantikan
            </p>

            {loading ? (
              <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200 text-slate-500">
                Memuat data gunung...
              </div>
            ) : gunungPopuler.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6 text-left">
                {gunungPopuler.map((gunung) => (
                  <CardGunung key={gunung.id} gunung={gunung} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-200 text-slate-500">
                Belum ada data gunung yang tersedia.
              </div>
            )}

            <div className="mt-8">
              <Link to="/gunung" className="text-[#244275] font-bold hover:underline">
                Lihat semua gunung →
              </Link>
            </div>
          </section>

          <section className="bg-gradient-to-r from-[#244275] to-[#1a325a] text-white rounded-2xl p-8 md:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
                Butuh Perlengkapan Pendakian?
              </h2>
              <p className="text-blue-100 text-xs md:text-sm max-w-xl leading-relaxed">
                Tidak perlu repot membawa beban berat dari rumah. Nikmati
                kemudahan sewa peralatan outdoor berkualitas secara praktis.
              </p>
            </div>
            <Link
              to="/sewa-alat"
              className="bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold text-sm px-8 py-3.5 rounded-full transition-all duration-300 shadow-md whitespace-nowrap transform hover:-translate-y-0.5"
            >
              Lihat Katalog Alat →
            </Link>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-center text-[#244275] mb-2">
              Cara Pemesanan Tiket
            </h2>
            <p className="text-center text-slate-500 text-xs md:text-sm mb-8">
              4 langkah mudah untuk memulai petualangan pendakianmu
            </p>

            <div className="grid md:grid-cols-4 gap-6 text-center">
              {[
                ["1", "Daftar & Login", "Buat akun pengguna baru atau masuk dengan akun terdaftar."],
                ["2", "Pilih Gunung & Jalur", "Cari gunung tujuan, cek kuota, dan tentukan jalur pendakian."],
                ["3", "Isi Data & Pesan", "Tentukan tanggal pendakian dan isi data pemesanan."],
                ["4", "Bayar & E-Tiket", "Lakukan pembayaran dan dapatkan e-tiket resmi untuk check-in."],
              ].map(([step, title, desc]) => (
                <div
                  key={step}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col items-center"
                >
                  <div className="w-12 h-12 mb-3 rounded-full bg-[#244275] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                    {step}
                  </div>
                  <h3 className="font-bold text-[#244275] text-base mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </UserLayout>
  );
}
