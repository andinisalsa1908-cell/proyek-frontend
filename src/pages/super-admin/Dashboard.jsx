import React, { useEffect, useState } from 'react';
import StatCard from '../../components/super-admin/StatCard';
import ChartSection from '../../components/super-admin/ChartSection';
import { getDashboard } from '../../services/super-admin/superAdminService';

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();

      console.log("DASHBOARD:", res.data);

      setData(res.data.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
    }
  };

  if (!data) return <h2>Loading...</h2>;

  // 🔹 HITUNG TOTAL ADMIN
  const totalAdmin =
    data.total_admin_gunung + data.total_admin_basecamp;

  // 🔹 FORMAT RUPIAH
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  // 🔹 DATA CARD (BIAR CLEAN)
  const cards = [
    { title: "Total Admin", value: totalAdmin },
    { title: "Total Gunung", value: data.total_gunung },
    { title: "Total User", value: data.total_users },
    { title: "Total Income", value: formatRupiah(data.total_income) },
    { title: "Pending Request", value: data.pending_requests },
    { title: "Approved Request", value: data.approved_requests },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Dashboard Super Admin
      </h1>

      {/* 🔹 STAT CARD */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {cards.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      {/* 🔹 CHART */}
      <ChartSection data={data} />
    </div>
  );
};

export default SuperAdminDashboard;