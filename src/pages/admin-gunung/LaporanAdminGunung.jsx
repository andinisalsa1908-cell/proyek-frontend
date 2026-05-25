import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

import {
  getReports,
  downloadReportPDF
} from "../../services/admin-gunung/adminGunungService";

const Laporan = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await getReports();

      setData(res.data.data);

    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await downloadReportPDF();

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "laporan-gunung.pdf");

      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log(err.response?.data);
      alert("Gagal download PDF");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10 text-gray-400">
        Tidak ada data laporan
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Laporan Admin Gunung
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">

        <StatCard label="Total Gunung" value={data.total_gunung} />
        <StatCard label="Gunung Aktif" value={data.gunung_aktif} />
        <StatCard label="Gunung Tidak Aktif" value={data.gunung_tidak_aktif} />
        <StatCard label="Total Galeri" value={data.total_galeri} />
        <StatCard label="Total Request" value={data.total_request} />

      </div>

      {/* TABLE (placeholder UI style biar konsisten) */}
      <div className="w-full">

        <div className="grid grid-cols-5 bg-[#b9d1f1] p-5 rounded-full mb-6 shadow-sm">

          {["Kategori", "Nilai", "Status", "Info", "Keterangan"].map((h) => (
            <div
              key={h}
              className="text-center font-black text-[#24426d] uppercase text-xs tracking-wider"
            >
              {h}
            </div>
          ))}

        </div>

        <div className="space-y-4">

          <div className="grid grid-cols-5 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm">

            <div className="text-center font-bold">Gunung</div>
            <div className="text-center">{data.total_gunung}</div>
            <div className="text-center">Aktif System</div>
            <div className="text-center">Database</div>
            <div className="text-center">Valid</div>

          </div>

        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-5 mt-10">

        <button
          onClick={handleDownload}
          className="bg-[#e74c3c] text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:bg-[#c0392b]"
        >
          Export PDF
        </button>

      </div>
    </div>
  );
};

/* =========================
   CARD COMPONENT
========================= */
const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-[30px] text-center shadow-lg border-4 border-[#b9d1f1]">

    <p className="text-[#24426d] font-bold text-xs mb-2 uppercase tracking-widest">
      {label}
    </p>

    <p className="text-5xl font-black text-[#24426d]">
      {value ?? 0}
    </p>

  </div>
);

export default Laporan;