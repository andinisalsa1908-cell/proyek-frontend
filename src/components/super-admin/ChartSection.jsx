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

  // 🔹 BAR CHART DATA (User & Admin)
  const dataBar = [
    { name: "Users", value: data.total_users },
    { name: "Admin Gunung", value: data.total_admin_gunung },
    { name: "Admin Basecamp", value: data.total_admin_basecamp },
  ];

  // 🔹 PIE CHART DATA (Request Status)
  const dataPie = [
    { name: "Pending", value: data.pending_requests },
    { name: "Approved", value: data.approved_requests },
    { name: "Rejected", value: data.rejected_requests },
  ];

  const COLORS = ["#facc15", "#4ade80", "#f87171"];

  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
      
      {/* BAR CHART */}
      <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border">
        <h3 className="font-bold mb-4 text-[#24426d]">
          Statistik User
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

      {/* PIE CHART */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col items-center">
        <h3 className="font-bold mb-4 text-[#24426d] self-start">
          Status Request
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