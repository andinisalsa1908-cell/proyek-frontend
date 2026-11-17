import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  ScanQrCode,
  UserCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  LogOut,
  MapPin,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

// 🔹 SERVICES
import {
  getBookings,
  confirmBooking,
  checkinBooking,
  checkoutBooking
} from '../../services/admin-basecamp/adminBasecampService';

const QR_ELEMENT_ID = 'validasi-tiket-qr-reader';

const ambilPesanError = (err, fallback) => {
  const data = err?.response?.data;

  if (data?.errors) {
    const pesan = Object.values(data.errors).flat().join(', ');
    if (pesan) return pesan;
  }

  return data?.message || fallback;
};

const formatWaktu = (value) => {
  if (!value) return '-';

  const tanggal = new Date(value);
  if (Number.isNaN(tanggal.getTime())) return value;

  return tanggal.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ValidasiTiket = () => {
  // =========================
  // STATE
  // =========================
  const [dataTiket, setDataTiket] = useState([]);
  const [inputCari, setInputCari] = useState('');
  const [loading, setLoading] = useState(true);
  const [sudahCari, setSudahCari] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [notif, setNotif] = useState({ type: '', message: '' });

  const [scanOpen, setScanOpen] = useState(false);
  const [scanError, setScanError] = useState('');

  const scannerRef = useRef(null);
  const scanSelesaiRef = useRef(false);

  const showNotif = (type, message) => {
    setNotif({ type, message });
    setTimeout(() => setNotif({ type: '', message: '' }), 4000);
  };

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookings = async (keyword = '') => {
    setLoading(true);

    try {
      const res = await getBookings(
        keyword ? { search: keyword } : undefined
      );

      const list =
        res.data.data?.data || res.data.data || [];

      setDataTiket(Array.isArray(list) ? list : []);
    } catch (err) {
      setDataTiket([]);
      showNotif(
        'error',
        ambilPesanError(err, 'Gagal mengambil data booking')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // SCANNER QR
  // =========================
  useEffect(() => {
    if (!scanOpen) return undefined;

    let aktif = true;
    scanSelesaiRef.current = false;
    setScanError('');

    const mulaiScan = async () => {
      try {
        const scanner = new Html5Qrcode(QR_ELEMENT_ID);
        scannerRef.current = scanner;

        if (!aktif) {
          try {
            scanner.clear();
          } catch (e) {
            // abaikan
          }
          return;
        }

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (!aktif || scanSelesaiRef.current) return;

            scanSelesaiRef.current = true;

            const kode = String(decodedText).trim();

            setInputCari(kode);
            setSudahCari(true);
            setScanOpen(false);
            fetchBookings(kode);
          },
          () => {
            // abaikan error frame yang tidak terbaca
          }
        );

        if (!aktif) {
          await scanner.stop().catch(() => {});
          try {
            scanner.clear();
          } catch (e) {
            // abaikan
          }
        }
      } catch (err) {
        if (aktif) {
          setScanError(
            'Kamera tidak bisa dibuka. Pastikan izin kamera aktif dan situs diakses lewat HTTPS.'
          );
        }
      }
    };

    const timer = setTimeout(mulaiScan, 300);

    return () => {
      aktif = false;
      clearTimeout(timer);

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        scanner
          .stop()
          .catch(() => {})
          .finally(() => {
            try {
              scanner.clear();
            } catch (e) {
              // abaikan
            }
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanOpen]);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = async () => {
    const keyword = inputCari.trim();

    setSudahCari(keyword !== '');

    await fetchBookings(keyword);
  };

  const handleReset = async () => {
    setInputCari('');
    setSudahCari(false);
    await fetchBookings();
  };

  // =========================
  // AKSI (KONFIRMASI / CHECK-IN / CHECK-OUT)
  // =========================
  const jalankanAksi = async (tiket, aksi) => {
    const konfirmasi = window.confirm(
      aksi === 'confirm'
        ? `Konfirmasi booking ${tiket.kode_booking}?`
        : aksi === 'checkin'
        ? `Check-in pendaki ${tiket.user?.name || '-'}?`
        : `Check-out pendaki ${tiket.user?.name || '-'}?`
    );

    if (!konfirmasi) return;

    setProcessingId(tiket.id);

    try {
      if (aksi === 'confirm') {
        await confirmBooking(tiket.id);
        showNotif('success', 'Booking berhasil dikonfirmasi');
      } else if (aksi === 'checkin') {
        await checkinBooking(tiket.id);
        showNotif('success', 'Check-in berhasil');
      } else {
        await checkoutBooking(tiket.id);
        showNotif('success', 'Checkout berhasil');
      }

      await fetchBookings(inputCari.trim());
    } catch (err) {
      showNotif(
        'error',
        ambilPesanError(err, 'Aksi gagal, silakan coba lagi')
      );
    } finally {
      setProcessingId(null);
    }
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';

      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300';

      case 'checkin':
        return 'bg-green-100 text-green-700 border-green-300';

      case 'completed':
        return 'bg-gray-200 text-gray-700 border-gray-300';

      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const renderAksi = (tiket) => {
    const sedangProses = processingId === tiket.id;

    const tombol = (onClick, className, icon, label) => (
      <button
        onClick={onClick}
        disabled={sedangProses}
        className={`${className} font-black py-4 px-10 rounded-full text-base lg:text-lg shadow-lg transition-all active:scale-95 disabled:opacity-60 flex items-center gap-3`}
      >
        {sedangProses ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            MEMPROSES...
          </>
        ) : (
          <>
            {icon}
            {label}
          </>
        )}
      </button>
    );

    if (tiket.status === 'cancelled') {
      return (
        <div className="py-4 px-10 border-4 border-red-300 text-red-500 rounded-full font-black text-lg bg-red-50">
          TIKET DIBATALKAN
        </div>
      );
    }

    if (tiket.status === 'pending') {
      return (
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-yellow-600 text-center">
            Booking belum terkonfirmasi. Konfirmasi setelah pembayaran
            diverifikasi.
          </p>

          {tombol(
            () => jalankanAksi(tiket, 'confirm'),
            'bg-[#24426d] hover:bg-[#1b3150] text-white',
            <CheckCircle2 size={22} />,
            'KONFIRMASI BOOKING'
          )}
        </div>
      );
    }

    if (tiket.checkout_at || tiket.status === 'completed') {
      return (
        <div className="py-4 px-10 border-4 border-green-500 text-green-600 rounded-full font-black text-lg bg-green-50 flex items-center gap-3">
          <CheckCircle2 size={26} />
          PENDAKIAN SELESAI
        </div>
      );
    }

    if (tiket.checkin_at) {
      return (
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-sm font-semibold text-green-600 text-center">
            Check-in: {formatWaktu(tiket.checkin_at)}
          </p>

          {tombol(
            () => jalankanAksi(tiket, 'checkout'),
            'bg-red-600 hover:bg-red-700 text-white',
            <LogOut size={22} />,
            'CHECKOUT PENDAKI'
          )}
        </div>
      );
    }

    if (tiket.status === 'confirmed') {
      return tombol(
        () => jalankanAksi(tiket, 'checkin'),
        'bg-[#24426d] hover:bg-[#1b3150] text-white',
        <CheckCircle2 size={22} />,
        'KONFIRMASI CHECK-IN'
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 p-2">
      {/* TITLE */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl font-bold text-[#24426d]">
            Validasi Tiket
          </h1>
          <p className="text-gray-500 mt-2">
            Cari kode booking atau scan QR e-tiket, lalu konfirmasi dan
            check-in pendaki.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-white border-2 border-[#b9d1f1] text-[#24426d] px-5 py-3 rounded-full font-bold hover:bg-[#f4f7fb] w-fit"
        >
          <RefreshCw size={18} />
          Muat Semua Booking
        </button>
      </div>

      {/* NOTIF */}
      {notif.message && (
        <div
          className={`px-5 py-4 rounded-2xl text-white font-medium shadow-md ${
            notif.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notif.message}
        </div>
      )}

      {/* SEARCH */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={22}
          />

          <input
            type="text"
            placeholder="Masukkan kode booking / nama pendaki..."
            className="w-full pl-14 pr-14 py-5 border-2 border-[#b9d1f1] rounded-full shadow-lg outline-none"
            value={inputCari}
            onChange={(e) => setInputCari(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <button
            type="button"
            onClick={() => setScanOpen(true)}
            title="Scan QR e-tiket"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-[#24426d] hover:bg-[#e9f1fb]"
          >
            <ScanQrCode size={28} />
          </button>
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#24426d] text-white px-10 py-5 rounded-full font-black text-lg"
        >
          CARI DATA
        </button>
      </div>

      {/* HASIL */}
      <div className="min-h-[400px] space-y-6 flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-[#24426d]">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-bold">Memuat data booking...</p>
          </div>
        ) : dataTiket.length > 0 ? (
          dataTiket.map((tiket) => (
            <div
              key={tiket.id}
              className="w-full max-w-5xl bg-white border-[6px] border-[#b9d1f1] rounded-[45px] p-8 shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT */}
                <div className="flex flex-col items-center justify-center lg:w-[220px]">
                  <div className="bg-[#f4f7fb] p-5 rounded-[35px] shadow-inner border border-[#d8e5f7]">
                    <UserCircle
                      size={110}
                      className="text-[#24426d]"
                      strokeWidth={1.3}
                    />
                  </div>

                  <div className="mt-5 text-center">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                      Status Tiket
                    </p>

                    <span
                      className={`inline-block mt-2 px-6 py-2 rounded-full font-black text-xs uppercase border-2 ${getStatusColor(
                        tiket.status
                      )}`}
                    >
                      {tiket.status}
                    </span>

                    {tiket.checkin_at && !tiket.checkout_at && (
                      <span className="block mt-2 px-4 py-1 rounded-full font-black text-[10px] uppercase bg-green-100 text-green-700">
                        Sedang mendaki
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1">
                  {/* HEADER */}
                  <div className="border-b border-dashed border-gray-200 pb-5 mb-5">
                    <h2 className="text-3xl font-black text-[#24426d] uppercase tracking-tight">
                      {tiket.user?.name || '-'}
                    </h2>

                    <p className="text-gray-500 font-semibold italic mt-1">
                      {tiket.user?.email || '-'}
                    </p>
                  </div>

                  {/* INFO GRID */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* TANGGAL */}
                    <div className="bg-[#f7fbff] border border-[#dcecff] rounded-[25px] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar size={22} className="text-[#24426d]" />

                        <p className="text-xs uppercase font-black tracking-wider text-gray-400">
                          Tanggal Mendaki
                        </p>
                      </div>

                      <p className="text-lg font-black text-[#24426d]">
                        {tiket.tanggal_naik || '-'}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {tiket.jumlah_pendaki || 1} pendaki
                      </p>
                    </div>

                    {/* BASECAMP */}
                    <div className="bg-[#f7fbff] border border-[#dcecff] rounded-[25px] p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin size={22} className="text-[#24426d]" />

                        <p className="text-xs uppercase font-black tracking-wider text-gray-400">
                          Basecamp
                        </p>
                      </div>

                      <p className="text-lg font-black text-[#24426d]">
                        {tiket.basecamp?.nama || '-'}
                      </p>
                    </div>
                  </div>

                  {/* KODE BOOKING */}
                  <div className="mt-5 bg-[#24426d]/5 border-2 border-dashed border-[#24426d]/20 rounded-[25px] p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-black mb-2">
                      Kode Booking
                    </p>

                    <p className="text-2xl font-black tracking-[4px] text-[#24426d] break-all">
                      {tiket.kode_booking || tiket.order_id || '-'}
                    </p>
                  </div>

                  {/* STATUS VALIDASI */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-full w-fit">
                      <CheckCircle2
                        size={22}
                        className="fill-green-500 text-white"
                      />

                      <span className="font-black text-sm tracking-wide">
                        {tiket.checkout_at
                          ? 'PENDAKIAN SELESAI'
                          : tiket.checkin_at
                          ? 'SUDAH CHECK-IN'
                          : tiket.status === 'confirmed'
                          ? 'TERVERIFIKASI SISTEM'
                          : tiket.status === 'cancelled'
                          ? 'DIBATALKAN'
                          : 'BELUM DIVERIFIKASI'}
                      </span>
                    </div>

                    {tiket.checkin_at && (
                      <div className="text-xs font-semibold text-gray-500">
                        Check-in: {formatWaktu(tiket.checkin_at)}
                      </div>
                    )}

                    {tiket.checkout_at && (
                      <div className="text-xs font-semibold text-gray-500">
                        Check-out: {formatWaktu(tiket.checkout_at)}
                      </div>
                    )}
                  </div>

                  {/* ACTION */}
                  <div className="flex justify-center mt-8 pt-6 border-t border-dashed border-gray-200">
                    {renderAksi(tiket)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-red-50 border-4 border-dashed border-red-200 rounded-[50px] max-w-4xl w-full">
            <AlertCircle size={70} className="text-red-400 mb-4" />

            <p className="text-red-600 font-black text-3xl uppercase">
              {sudahCari ? 'Data Tidak Ditemukan' : 'Belum Ada Booking'}
            </p>

            <p className="text-red-400 font-semibold mt-2 text-center">
              {sudahCari
                ? `"${inputCari}" tidak ditemukan di database basecamp ini.`
                : 'Belum ada tiket yang masuk untuk basecamp ini.'}
            </p>
          </div>
        )}
      </div>

      {/* MODAL SCANNER */}
      {scanOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 relative">
            <button
              onClick={() => setScanOpen(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-[#24426d] mb-1">
              Scan QR E-Tiket
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Arahkan kamera ke QR pada e-tiket pendaki.
            </p>

            <div
              id={QR_ELEMENT_ID}
              className="w-full rounded-2xl overflow-hidden bg-black min-h-[260px]"
            />

            {scanError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl p-4">
                {scanError}
              </div>
            )}

            <button
              onClick={() => setScanOpen(false)}
              className="mt-5 w-full bg-[#24426d] text-white py-3 rounded-2xl font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidasiTiket;
