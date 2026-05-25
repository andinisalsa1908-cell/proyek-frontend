import React, { useEffect, useState } from "react";
import StatCard from "../../components/admin-gunung/StatCard";
import ChartSection from "../../components/admin-gunung/ChartSection";
import { getDashboard } from "../../services/admin-gunung/adminGunungService";

const AdminGunungDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();

      console.log("DASHBOARD ADMIN GUNUNG:", res.data);

      // ✅ ambil data dari backend
      setData(res.data.data);

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (!data) return <h2>Loading...</h2>;

  // ✅ biar aman kalau null
  const {
    total_gunung = 0,
    total_basecamp = 0,
    total_bookings = 0,
    total_income = 0,
    confirmed_bookings = 0,
    completed_bookings = 0,
    admin_basecamp_aktif = 0,
  } = data;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number || 0);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Dashboard Admin Gunung
      </h1>

      {/* ✅ STAT CARD FIX */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Gunung" value={total_gunung} />
        <StatCard title="Total Basecamp" value={total_basecamp} />
        <StatCard title="Total Booking" value={total_bookings} />
        <StatCard title="Booking Confirmed" value={confirmed_bookings} />
        <StatCard title="Booking Selesai" value={completed_bookings} />
        <StatCard title="Admin Basecamp Aktif" value={admin_basecamp_aktif} />
        <StatCard title="Total Income" value={formatRupiah(total_income)} />
      </div>

      {/* ✅ CHART */}
      <ChartSection data={data} />
    </div>
  );
};

export default AdminGunungDashboard;