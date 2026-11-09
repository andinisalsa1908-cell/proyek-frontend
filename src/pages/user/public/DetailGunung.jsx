import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserLayout from "../../../layouts/UserLayout";

export default function DetailGunung() {
  const { id } = useParams();
  const [selectedJalur, setSelectedJalur] = useState("");

  // Data tiruan daftar gunung (jalur diubah menjadi objek agar memiliki foto kondisi jalur)
  const dataGunung = {
    1: {
      nama: "Gunung Ciremai",
      lokasi: "Jawa Barat",
      deskripsi: "Gunung Ciremai merupakan gunung tertinggi di Jawa Barat dengan panorama alam yang indah. Menawarkan jalur pendakian yang menantang serta pemandangan alam yang memesona bagi para pendaki.",
      jalur: [
        { nama: "Apuy", foto: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
        { nama: "Linggarjati", foto: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
        { nama: "Palutungan", foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }
      ],
      statusKuota: "Tersedia",
      statusJalur: "Buka",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    },
    2: {
      nama: "Gunung Merbabu",
      lokasi: "Jawa Tengah",
      deskripsi: "Gunung Merbabu adalah gunung api stratovolcano yang terletak di Provinsi Jawa Tengah. Terkenal dengan keindahan sabana luas dan pemandangan sunrise terbaik di antara gunung-gunung Jawa.",
      jalur: [
        { nama: "Selo", foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
        { nama: "Wekas", foto: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
        { nama: "Cuntel", foto: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
        { nama: "Thekelan", foto: "https://images.unsplash.com/photo-1426604966848-d7adac902bff" }
      ],
      statusKuota: "Tersedia",
      statusJalur: "Buka",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    },
    3: {
      nama: "Gunung Semeru",
      lokasi: "Jawa Timur",
      deskripsi: "Gunung Semeru atau Mahameru adalah gunung tertinggi di Pulau Jawa, dengan puncaknya Mahameru (3.676 mdpl). Menyajikan pengalaman pendakian legendaris melalui Ranu Kumbolo.",
      jalur: [
        { nama: "Tawargo / Ranu Pane", foto: "https://images.unsplash.com/photo-1519681393784-d120267933ba" }
      ],
      statusKuota: "Terbatas",
      statusJalur: "Buka Sebagian",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba"
    },
    4: {
      nama: "Gunung Slamet",
      lokasi: "Jawa Tengah",
      deskripsi: "Gunung Slamet adalah gunung berapi kerucut yang terletak di antara lima kabupaten di Jawa Tengah. Merupakan gunung tertinggi di Jawa Tengah dengan trek pendakian yang dikenal cukup menantang.",
      jalur: [
        { nama: "Bambangan", foto: "https://images.unsplash.com/photo-1426604966848-d7adac902bff" },
        { nama: "Guci", foto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
        { nama: "Permadi", foto: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
        { nama: "Baturaden", foto: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" }
      ],
      statusKuota: "Tersedia",
      statusJalur: "Buka",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac902bff"
    }
  };

  // Ambil data berdasarkan ID dari URL, fallback ke data pertama jika tidak ditemukan
  const gunung = dataGunung[id] || dataGunung[1];

  return (
    <UserLayout>
      <div className="bg-[#f8fafc] min-h-screen pt-4 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* BANNER FOTO UTAMA */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 h-[360px]">
            <img
              src={gunung.image}
              alt={gunung.nama}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
              <div className="text-white space-y-1">
                <span className="bg-[#244275] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {gunung.lokasi}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight pt-2">
                  {gunung.nama}
                </h1>
              </div>
            </div>
          </div>

          {/* KONTEN INFORMASI & SIDEMENU */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* BAGIAN DESKRIPSI & JALUR */}
            <div className="md:col-span-2 space-y-6">
              
              {/* DESKRIPSI */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3">
                <h2 className="text-lg font-bold text-[#244275] border-b border-slate-100 pb-2">
                  Deskripsi Gunung
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {gunung.deskripsi}
                </p>
              </div>

              {/* JALUR PENDAKIAN (Dengan Foto Kondisi Jalur) */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-3">
                <h2 className="text-lg font-bold text-[#244275] border-b border-slate-100 pb-2">
                  Jalur Pendakian <span className="text-xs font-normal text-slate-400">(Pilih salah satu sebelum memesan)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                  {gunung.jalur.map((jalurObj, idx) => {
                    const isSelected = selectedJalur === jalurObj.nama;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedJalur(jalurObj.nama)}
                        className={`rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                          isSelected
                            ? "border-[#244275] ring-2 ring-[#244275] shadow-md bg-blue-50/30"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="h-28 w-full overflow-hidden relative">
                          <img
                            src={jalurObj.foto}
                            alt={jalurObj.nama}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#244275] text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
                              Dipilih ✓
                            </div>
                          )}
                        </div>
                        <div className="p-3 text-center flex-1 flex items-center justify-center">
                          <span className={`text-xs font-semibold ${isSelected ? "text-[#244275] font-bold" : "text-slate-700"}`}>
                            Jalur {jalurObj.nama}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* AKSI PESAN TIKET */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-5 sticky top-24">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Informasi Tiket
                  </span>
                  <h3 className="text-base font-bold text-[#244275]">
                    Pemesanan Online
                  </h3>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Kuota Hari Ini:</span>
                    <strong className="text-emerald-600">{gunung.statusKuota}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Status Jalur:</span>
                    <strong className="text-[#244275]">{gunung.statusJalur}</strong>
                  </div>
                  {selectedJalur && (
                    <div className="flex justify-between pt-1 border-t border-slate-100">
                      <span>Jalur Dipilih:</span>
                      <strong className="text-green-600">{selectedJalur}</strong>
                    </div>
                  )}
                </div>

                {/* Tombol Pesan Tiket dengan Validasi Jalur */}
                <div className="space-y-2">
                  {selectedJalur ? (
                    <Link
                      to={`/pesan-tiket?gunung_id=${id}&jalur=${encodeURIComponent(selectedJalur)}`}
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