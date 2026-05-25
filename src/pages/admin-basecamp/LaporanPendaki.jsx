import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

// 🔹 SERVICES
import {
  getReports,
  downloadReportPdf
} from '../../services/admin-basecamp/adminBasecampService';

const LaporanPendaki = () => {

  // =========================
  // STATE
  // =========================
  const [laporan, setLaporan] = useState([]);

  const [loading, setLoading] = useState(true);

  // FILTER
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // =========================
  // FETCH REPORTS
  // =========================
  useEffect(() => {

    fetchReports();

  }, []);

  const fetchReports = async () => {

    try {

      setLoading(true);

      const res = await getReports();

      console.log("REPORTS:", res.data);

      setLaporan(
        res.data.data?.data || res.data.data || []
      );

    } catch (err) {

      console.log(err.response?.data);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // FILTER DATA
  // =========================
  const dataTerfilter = useMemo(() => {

    return laporan.filter((item) => {

      const tanggal =
        item.created_at?.split('T')[0];

      const matchDate =
        (!startDate || tanggal >= startDate) &&
        (!endDate || tanggal <= endDate);

      return matchDate;
    });

  }, [laporan, startDate, endDate]);

  // =========================
  // STATS
  // =========================
  const stats = [

    {
      label: 'Total Booking',
      value: dataTerfilter.length
    },

    {
      label: 'Check-in',
      value: dataTerfilter.filter(
        (i) => i.status === 'checkin'
      ).length
    },

    {
      label: 'Selesai',
      value: dataTerfilter.filter(
        (i) => i.status === 'completed'
      ).length
    },

    {
      label: 'Pending',
      value: dataTerfilter.filter(
        (i) => i.status === 'pending'
      ).length
    },
  ];

  // =========================
  // EXPORT PDF
  // =========================
  const handleExportPdf = async () => {

    try {

      const res = await downloadReportPdf();

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute(
        'download',
        'laporan-pendaki.pdf'
      );

      document.body.appendChild(link);

      link.click();

    } catch (err) {

      console.log(err);

      if (err.response?.data instanceof Blob) {

        const text = await err.response.data.text();

        console.log("PDF ERROR:", JSON.parse(text));
      }

      alert("Gagal export PDF");
    }
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusColor = (status) => {

    switch (status) {

      case 'pending':
        return 'text-yellow-600';

      case 'confirmed':
        return 'text-blue-600';

      case 'checkin':
        return 'text-green-600';

      case 'completed':
        return 'text-gray-700';

      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-2">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Laporan Pendakian
      </h1>

      {/* FILTER */}
      <div className="flex flex-wrap gap-4 mb-8 items-center bg-white p-4 rounded-[30px] border border-gray-100 shadow-sm">

        {/* DATE */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-5 py-2">

          <Calendar
            size={18}
            className="text-[#24426d]"
          />

          <input
            type="date"
            className="bg-transparent outline-none text-sm text-gray-700 font-bold"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />

          <span className="text-gray-400 font-bold px-2">
            s/d
          </span>

          <input
            type="date"
            className="bg-transparent outline-none text-sm text-gray-700 font-bold"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />
        </div>

        {/* RESET */}
        <button
          onClick={() => {

            setStartDate('');
            setEndDate('');
          }}
          className="bg-[#24426d] text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-[#1a3152]"
        >
          Reset
          <Filter size={16} />
        </button>
      </div>

      {/* STAT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        {stats.map((item, idx) => (

          <div
            key={idx}
            className="bg-white p-6 rounded-[30px] text-center shadow-lg border-4 border-[#b9d1f1]"
          >

            <p className="text-[#24426d] font-bold text-xs mb-2 uppercase tracking-widest">
              {item.label}
            </p>

            <p className="text-5xl font-black text-[#24426d]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="w-full">

        {/* HEADER */}
        <div className="grid grid-cols-5 bg-[#b9d1f1] p-5 rounded-full mb-6 shadow-sm">

          {[
            'Pendaki',
            'Jalur',
            'Tanggal',
            'Status',
            'Total'
          ].map((h) => (

            <div
              key={h}
              className="text-center font-black text-[#24426d] uppercase text-xs tracking-wider"
            >
              {h}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

          {loading ? (

            <div className="text-center py-10 text-gray-400">
              Loading...
            </div>

          ) : dataTerfilter.length > 0 ? (

            dataTerfilter.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-5 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm"
              >

                {/* USER */}
                <div className="text-center font-bold text-gray-700">
                  {item.user?.name || '-'}
                </div>

                {/* JALUR */}
                <div className="text-center font-bold text-[#24426d]">
                  {item.jalur?.nama || '-'}
                </div>

                {/* DATE */}
                <div className="text-center font-bold text-gray-700">
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleDateString()
                    : '-'}
                </div>

                {/* STATUS */}
                <div
                  className={`text-center font-black uppercase ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </div>

                {/* TOTAL */}
                <div className="text-center font-black text-lg text-[#24426d]">
                  Rp {item.total_harga || 0}
                </div>
              </div>
            ))

          ) : (

            <div className="text-center py-20 text-gray-400 italic bg-gray-50 rounded-[40px] border-2 border-dashed">
              Tidak ada data laporan.
            </div>
          )}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-5 mt-10">

        <button
          onClick={handleExportPdf}
          className="bg-[#e74c3c] text-white font-bold py-4 px-12 rounded-full text-xl shadow-xl hover:bg-[#c0392b]"
        >
          Export PDF
        </button>

      </div>
    </div>
  );
};

export default LaporanPendaki;