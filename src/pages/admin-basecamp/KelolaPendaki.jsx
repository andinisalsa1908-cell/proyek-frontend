import React, { useEffect, useState } from 'react';
import {
  Search,
  Calendar,
  CheckCircle,
  LogOut,
  BadgeCheck,
  Loader2
} from 'lucide-react';

// 🔹 SERVICES
import {
  getBookings,
  confirmBooking,
  checkinBooking,
  checkoutBooking
} from '../../services/admin-basecamp/adminBasecampService';

const ambilPesanError = (err, fallback) => {
  const data = err?.response?.data;

  if (data?.errors) {
    const pesan = Object.values(data.errors).flat().join(', ');
    if (pesan) return pesan;
  }

  return data?.message || fallback;
};

const KelolaPendaki = () => {

  const [daftarPendaki, setDaftarPendaki] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 🔹 FILTER
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  // =========================
  // FETCH BOOKINGS
  // =========================
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);

    try {

      const res = await getBookings();

      setDaftarPendaki(
        res.data.data?.data || res.data.data || []
      );

    } catch (err) {

      console.log(err.response?.data);

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AKSI
  // =========================
  const handleAction = async (id, aksi) => {

    const label = {
      confirm: 'Konfirmasi booking pendaki ini?',
      checkin: 'Check-in pendaki ini?',
      checkout: 'Checkout pendaki ini?'
    }[aksi];

    if (!window.confirm(label)) return;

    setProcessingId(id);

    try {

      if (aksi === 'confirm') {
        await confirmBooking(id);
        alert("Berhasil konfirmasi booking");
      } else if (aksi === 'checkin') {
        await checkinBooking(id);
        alert("Berhasil check-in");
      } else {
        await checkoutBooking(id);
        alert("Berhasil checkout");
      }

      await fetchBookings();

    } catch (err) {

      console.log(err.response?.data);

      alert(ambilPesanError(err, "Aksi gagal"));
    } finally {
      setProcessingId(null);
    }
  };

  // =========================
  // FILTER DATA
  // =========================
  const dataTerfilter = daftarPendaki.filter((item) => {

    const nama =
      item.user?.name?.toLowerCase() || '';

    const email =
      item.user?.email?.toLowerCase() || '';

    const kode =
      (item.kode_booking || item.order_id || '').toLowerCase();

    const tanggal =
      item.tanggal_naik || '';

    const keyword = searchTerm.toLowerCase();

    return (
      (nama.includes(keyword) ||
        email.includes(keyword) ||
        kode.includes(keyword)) &&

      (filterTanggal === '' ||
        tanggal === filterTanggal)
    );
  });

  // =========================
  // STATUS BADGE
  // =========================
  const getStatusBadge = (status) => {

    switch (status) {

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'confirmed':
        return 'bg-blue-100 text-blue-700';

      case 'checkin':
        return 'bg-green-100 text-green-700';

      case 'completed':
        return 'bg-gray-200 text-gray-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderAksi = (item) => {
    const sedangProses = processingId === item.id;

    if (sedangProses) {
      return (
        <Loader2 size={22} className="text-[#24426d] animate-spin" />
      );
    }

    // Belum dibayar / belum dikonfirmasi
    if (item.status === 'pending') {
      return (
        <button
          onClick={() => handleAction(item.id, 'confirm')}
          className="text-blue-600 hover:scale-110"
          title="Konfirmasi booking"
        >
          <BadgeCheck size={22} />
        </button>
      );
    }

    // Sudah selesai
    if (item.status === 'completed' || item.checkout_at) {
      return (
        <span
          className="text-green-600"
          title={`Selesai ${item.checkout_at ? new Date(item.checkout_at).toLocaleString('id-ID') : ''}`}
        >
          <CheckCircle size={22} />
        </span>
      );
    }

    // Sudah check-in, belum checkout
    if (item.checkin_at) {
      return (
        <button
          onClick={() => handleAction(item.id, 'checkout')}
          className="text-red-600 hover:scale-110"
          title="Checkout pendaki"
        >
          <LogOut size={22} />
        </button>
      );
    }

    // Sudah dikonfirmasi, belum check-in
    if (item.status === 'confirmed') {
      return (
        <button
          onClick={() => handleAction(item.id, 'checkin')}
          className="text-green-600 hover:scale-110"
          title="Check-in pendaki"
        >
          <CheckCircle size={22} />
        </button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 p-2">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Kelola Pendaki
      </h1>

      {/* FILTER */}
      <div className="grid grid-cols-2 gap-4 mb-8">

        {/* SEARCH */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Cari Nama / Email / Kode Booking..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {/* DATE */}
        <div className="relative">
          <Calendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="date"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full"
            value={filterTanggal}
            onChange={(e) =>
              setFilterTanggal(e.target.value)
            }
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full">

        {/* HEADER */}
        <div className="grid grid-cols-7 bg-[#b9d1f1] p-4 rounded-full mb-6 shadow-sm">
          <div className="text-center font-bold">Nama</div>
          <div className="text-center font-bold">Email</div>
          <div className="text-center font-bold">Basecamp</div>
          <div className="text-center font-bold">Tanggal</div>
          <div className="text-center font-bold">Total</div>
          <div className="text-center font-bold">Status</div>
          <div className="text-center font-bold">Aksi</div>
        </div>

        {/* DATA */}
        <div className="space-y-4">

          {loading ? (

            <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-3">
              <Loader2 size={40} className="animate-spin" />
              Memuat data pendaki...
            </div>

          ) : dataTerfilter.length > 0 ? (

            dataTerfilter.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-7 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm"
              >

                {/* NAMA */}
                <div className="text-center font-bold">
                  {item.user?.name || '-'}
                </div>

                {/* EMAIL / KODE */}
                <div className="text-center text-sm truncate px-2">
                  <div className="truncate">{item.user?.email || '-'}</div>
                  <div className="text-[10px] text-gray-400 font-semibold truncate">
                    {item.kode_booking || item.order_id || '-'}
                  </div>
                </div>

                {/* BASECAMP */}
                <div className="text-center">
                  {item.basecamp?.nama || '-'}
                </div>

                {/* TANGGAL */}
                <div className="text-center">
                  {item.tanggal_naik || '-'}
                </div>

                {/* TOTAL */}
                <div className="text-center">
                  Rp {Number(item.total_price || 0).toLocaleString('id-ID')}
                </div>

                {/* STATUS */}
                <div className="text-center">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>

                  {item.checkin_at && !item.checkout_at && (
                    <div className="text-[10px] text-green-600 font-bold mt-1 uppercase">
                      Sedang mendaki
                    </div>
                  )}
                </div>

                {/* AKSI */}
                <div className="flex justify-center gap-3">
                  {renderAksi(item)}
                </div>
              </div>
            ))

          ) : (

            <div className="text-center py-20 text-gray-400 italic">
              Tidak ada data booking
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KelolaPendaki;
