import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ChartSection = ({ data }) => {
  if (!data) return null;

  // 🔹 BAR CHART (Statistik utama)
  const dataBar = [
    { name: "Gunung", value: data.total_gunung || 0 },
    { name: "Basecamp", value: data.total_basecamp || 0 },
    { name: "Booking", value: data.total_bookings || 0 },
    { name: "Admin BC", value: data.admin_basecamp_aktif || 0 },
  ];

  // 🔹 PIE CHART (Status Booking)
  const dataPie = [
    { name: "Confirmed", value: data.confirmed_bookings || 0 },
    { name: "Completed", value: data.completed_bookings || 0 },
  ];

  const COLORS = ["#24426d", "#f39c12"];

  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
      
      {/* 🔹 BAR CHART */}
      <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border">
        <h3 className="font-bold mb-4 text-[#24426d]">
          Statistik Admin Gunung
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBar}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#24426d" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 PIE CHART */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col items-center">
        <h3 className="font-bold mb-4 text-[#24426d] self-start">
          Status Booking
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataPie}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {dataPie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ChartSection;