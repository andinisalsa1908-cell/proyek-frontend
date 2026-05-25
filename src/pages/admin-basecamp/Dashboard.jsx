import React, { useEffect, useState } from "react";

import StatCard from "../../components/admin-basecamp/StatCard";
import ChartSection from "../../components/admin-basecamp/ChartSection";

// 🔹 SERVICE
import { getDashboard } from "../../services/admin-basecamp/adminBasecampService";

const AdminBasecampDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================
  // 🔹 FETCH DASHBOARD
  // =========================
  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();

      console.log("DASHBOARD ADMIN BASECAMP:", res.data);

      // ✅ sesuai response backend
      setData(res.data.data);

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // =========================
  // 🔹 LOADING
  // =========================
  if (!data) {
    return (
      <div className="p-6">
        <h2 className="text-xl text-gray-500">
          Loading dashboard...
        </h2>
      </div>
    );
  }

  // =========================
  // 🔹 AMBIL DATA BACKEND
  // =========================
  const {
    total_basecamp = 0,
    total_bookings = 0,
    total_income = 0,
    confirmed_bookings = 0,
    completed_bookings = 0,
    pending_bookings = 0,
    checkin = 0,
    pendaki_aktif = 0,
  } = data;

  // =========================
  // 🔹 FORMAT RUPIAH
  // =========================
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number || 0);
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d]">
        Dashboard Admin Basecamp
      </h1>

      {/* =========================
          🔹 STAT CARD
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Basecamp"
          value={total_basecamp}
        />

        <StatCard
          title="Total Booking"
          value={total_bookings}
        />

        <StatCard
          title="Booking Confirmed"
          value={confirmed_bookings}
        />

        <StatCard
          title="Booking Selesai"
          value={completed_bookings}
        />

        <StatCard
          title="Pending Booking"
          value={pending_bookings}
        />

        <StatCard
          title="Check In"
          value={checkin}
        />

        <StatCard
          title="Pendaki Aktif"
          value={pendaki_aktif}
        />

        <StatCard
          title="Total Income"
          value={formatRupiah(total_income)}
        />

      </div>

      {/* =========================
          🔹 CHART SECTION
      ========================= */}
      <ChartSection data={data} />

    </div>
  );
};

export default AdminBasecampDashboard;