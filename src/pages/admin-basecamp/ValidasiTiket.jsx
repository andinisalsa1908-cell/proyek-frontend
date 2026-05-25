import React, { useEffect, useState } from 'react';
import {
  Search,
  ScanQrCode,
  UserCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  LogOut,
  MapPin
} from 'lucide-react';

// 🔹 SERVICES
import {
  getBookings,
  checkinBooking,
  checkoutBooking
} from '../../services/admin-basecamp/adminBasecampService';

const ValidasiTiket = () => {

  // =========================
  // STATE
  // =========================
  const [dataTiket, setDataTiket] = useState([]);

  const [inputCari, setInputCari] = useState('');

  const [hasilFilter, setHasilFilter] = useState([]);

  const [sudahCari, setSudahCari] = useState(false);

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

      setDataTiket(
        res.data.data?.data || res.data.data || []
      );

    } catch (err) {

      console.log(err.response?.data);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = () => {

    if (inputCari.trim() === "") {

      setSudahCari(false);
      setHasilFilter([]);

      return;
    }

    const filtered = dataTiket.filter((t) => {

      const kode =
        t.kode_booking?.toLowerCase() || '';

      const nama =
        t.user?.name?.toLowerCase() || '';

      return (
        kode.includes(inputCari.toLowerCase()) ||
        nama.includes(inputCari.toLowerCase())
      );
    });

    setHasilFilter(filtered);

    setSudahCari(true);
  };

  // =========================
  // CHECKIN
  // =========================
  const handleCheckIn = async (id) => {

    try {

      await checkinBooking(id);

      alert("Check-in berhasil!");

      fetchBookings();

      handleSearch();

    } catch (err) {

      console.log(err.response?.data);

      alert("Gagal check-in");
    }
  };

  // =========================
  // CHECKOUT
  // =========================
  const handleCheckOut = async (id) => {

    try {

      await checkoutBooking(id);

      alert("Checkout berhasil!");

      fetchBookings();

      handleSearch();

    } catch (err) {

      console.log(err.response?.data);

      alert("Gagal checkout");
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

      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-2">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Validasi Tiket
      </h1>

      {/* SEARCH */}
      <div className="flex items-center gap-4 mb-10">

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
            onChange={(e) =>
              setInputCari(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' && handleSearch()
            }
          />

          <ScanQrCode
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#24426d]"
            size={28}
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#24426d] text-white px-12 py-5 rounded-full font-black text-lg"
        >
          CARI DATA
        </button>
      </div>

      {/* RESULT */}
      <div className="min-h-[400px] space-y-6 flex flex-col items-center">

        {sudahCari ? (

          hasilFilter.length > 0 ? (

            hasilFilter.map((tiket) => (

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
                        className={`inline-block mt-2 px-6 py-2 rounded-full font-black text-xs uppercase border-2 ${getStatusColor(tiket.status)}`}
                      >
                        {tiket.status}
                      </span>
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
                          <Calendar
                            size={22}
                            className="text-[#24426d]"
                          />

                          <p className="text-xs uppercase font-black tracking-wider text-gray-400">
                            Tanggal Mendaki
                          </p>
                        </div>

                        <p className="text-lg font-black text-[#24426d]">
                          {tiket.tanggal_naik || '-'}
                        </p>
                      </div>

                      {/* JALUR */}
                      <div className="bg-[#f7fbff] border border-[#dcecff] rounded-[25px] p-5">

                        <div className="flex items-center gap-3 mb-2">
                          <MapPin
                            size={22}
                            className="text-[#24426d]"
                          />

                          <p className="text-xs uppercase font-black tracking-wider text-gray-400">
                            Jalur Pendakian
                          </p>
                        </div>

                        <p className="text-lg font-black text-[#24426d]">
                          {tiket.jalur?.nama || '-'}
                        </p>
                      </div>
                    </div>

                    {/* KODE BOOKING */}
                    <div className="mt-5 bg-[#24426d]/5 border-2 border-dashed border-[#24426d]/20 rounded-[25px] p-5">

                      <p className="text-xs uppercase tracking-widest text-gray-400 font-black mb-2">
                        Kode Booking
                      </p>

                      <p className="text-2xl font-black tracking-[4px] text-[#24426d] break-all">
                        {tiket.kode_booking || '-'}
                      </p>
                    </div>

                    {/* VERIFIED */}
                    <div className="mt-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-full w-fit">

                      <CheckCircle2
                        size={22}
                        className="fill-green-500 text-white"
                      />

                      <span className="font-black text-sm tracking-wide">
                        TERVERIFIKASI SISTEM
                      </span>
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-center mt-8 pt-6 border-t border-dashed border-gray-200">

                      {/* CHECKIN */}
                      {tiket.status === 'confirmed' && (

                        <button
                          onClick={() => handleCheckIn(tiket.id)}
                          className="bg-[#24426d] hover:bg-[#1b3150] text-white font-black py-4 px-12 rounded-full text-lg shadow-lg transition-all active:scale-95"
                        >
                          KONFIRMASI CHECK-IN
                        </button>
                      )}

                      {/* CHECKOUT */}
                      {tiket.status === 'checkin' && (

                        <button
                          onClick={() => handleCheckOut(tiket.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-12 rounded-full text-lg shadow-lg transition-all active:scale-95 flex items-center gap-3"
                        >
                          <LogOut size={22} />
                          CHECKOUT PENDAKI
                        </button>
                      )}

                      {/* COMPLETED */}
                      {tiket.status === 'completed' && (

                        <div className="py-4 px-12 border-4 border-green-500 text-green-600 rounded-full font-black text-lg bg-green-50 flex items-center gap-3">

                          <CheckCircle2 size={28} />

                          PENDAKIAN SELESAI
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))

          ) : (

            <div className="flex flex-col items-center justify-center p-20 bg-red-50 border-4 border-dashed border-red-200 rounded-[50px] max-w-4xl w-full">

              <AlertCircle
                size={70}
                className="text-red-400 mb-4"
              />

              <p className="text-red-600 font-black text-3xl uppercase">
                Data Tidak Ditemukan
              </p>

              <p className="text-red-400 font-semibold mt-2 text-center">
                "{inputCari}" tidak ditemukan di database.
              </p>
            </div>
          )

        ) : (

          <div className="flex flex-col items-center justify-center py-28 text-gray-300 border-4 border-dashed border-gray-200 rounded-[50px] w-full max-w-5xl bg-gray-50">

            <ScanQrCode
              size={80}
              className="mb-6 opacity-20"
            />

            <p className="text-2xl font-bold">
              Menunggu Input Pencarian...
            </p>

            <p className="font-medium opacity-60">
              Cari tiket untuk memvalidasi pendaki
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidasiTiket;