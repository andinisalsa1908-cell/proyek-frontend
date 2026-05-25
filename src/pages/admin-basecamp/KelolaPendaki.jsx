import React, { useEffect, useState } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  CheckCircle,
  LogOut
} from 'lucide-react';

// 🔹 SERVICES
import {
  getBookings,
  checkinBooking,
  checkoutBooking
} from '../../services/admin-basecamp/adminBasecampService';

const KelolaPendaki = () => {

  const [daftarPendaki, setDaftarPendaki] = useState([]);

  // 🔹 FILTER
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterJalur, setFilterJalur] = useState('');

  // =========================
  // FETCH BOOKINGS
  // =========================
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {

      const res = await getBookings();

      console.log("BOOKINGS:", res.data);

      setDaftarPendaki(
        res.data.data?.data || res.data.data || []
      );

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // =========================
  // CHECKIN
  // =========================
  const handleCheckin = async (id) => {

    if (!window.confirm("Check-in pendaki ini?")) return;

    try {

      await checkinBooking(id);

      alert("Berhasil check-in");

      fetchBookings();

    } catch (err) {

      console.log(err.response?.data);

      alert("Gagal check-in");
    }
  };

  // =========================
  // CHECKOUT
  // =========================
  const handleCheckout = async (id) => {

    if (!window.confirm("Checkout pendaki ini?")) return;

    try {

      await checkoutBooking(id);

      alert("Berhasil checkout");

      fetchBookings();

    } catch (err) {

      console.log(err.response?.data);

      alert("Gagal checkout");
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

    const jalur =
      item.jalur?.nama?.toLowerCase() || '';

    const tanggal =
      item.tanggal_naik || '';

    return (
      (nama.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase())) &&

      jalur.includes(filterJalur.toLowerCase()) &&

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

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 p-2">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Kelola Pendaki
      </h1>

      {/* FILTER */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        {/* SEARCH */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Cari Nama / Email..."
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

        {/* JALUR */}
        <div className="relative">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Filter Jalur..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full"
            value={filterJalur}
            onChange={(e) =>
              setFilterJalur(e.target.value)
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
          <div className="text-center font-bold">Jalur</div>
          <div className="text-center font-bold">Tanggal</div>
          <div className="text-center font-bold">Total</div>
          <div className="text-center font-bold">Status</div>
          <div className="text-center font-bold">Aksi</div>
        </div>

        {/* DATA */}
        <div className="space-y-4">

          {dataTerfilter.length > 0 ? (

            dataTerfilter.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-7 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm"
              >

                {/* NAMA */}
                <div className="text-center font-bold">
                  {item.user?.name || '-'}
                </div>

                {/* EMAIL */}
                <div className="text-center text-sm truncate px-2">
                  {item.user?.email || '-'}
                </div>

                {/* JALUR */}
                <div className="text-center">
                  {item.jalur?.nama || '-'}
                </div>

                {/* TANGGAL */}
                <div className="text-center">
                  {item.tanggal_naik || '-'}
                </div>

                {/* TOTAL */}
                <div className="text-center">
                  Rp {item.total_harga || 0}
                </div>

                {/* STATUS */}
                <div className="text-center">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* AKSI */}
                <div className="flex justify-center gap-3">

                  {/* CHECKIN */}
                  {item.status === 'confirmed' && (
                    <button
                      onClick={() =>
                        handleCheckin(item.id)
                      }
                      className="text-green-600 hover:scale-110"
                    >
                      <CheckCircle size={22} />
                    </button>
                  )}

                  {/* CHECKOUT */}
                  {item.status === 'checkin' && (
                    <button
                      onClick={() =>
                        handleCheckout(item.id)
                      }
                      className="text-red-600 hover:scale-110"
                    >
                      <LogOut size={22} />
                    </button>
                  )}

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