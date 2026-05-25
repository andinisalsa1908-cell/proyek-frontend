import React, { useEffect, useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  RefreshCcw
} from 'lucide-react';

// 🔹 SERVICE
import {
  getActivityLogs
} from '../../services/super-admin/superAdminService';

const ActivityLog = () => {

  // =========================
  // STATE
  // =========================
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  // =========================
  // FETCH LOGS
  // =========================
  const fetchLogs = async () => {

    try {

      setLoading(true);

      const res = await getActivityLogs(moduleFilter);

      console.log("ACTIVITY LOGS:", res.data);

      setLogs(res.data.data.data || []);

    } catch (err) {

      console.log(err.response?.data);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  // =========================
  // FILTER SEARCH
  // =========================
  const filteredLogs = logs.filter((item) => {

    const keyword = search.toLowerCase();

    return (
      item.description?.toLowerCase().includes(keyword) ||
      item.module?.toLowerCase().includes(keyword) ||
      item.user?.name?.toLowerCase().includes(keyword)
    );
  });

  // =========================
  // BADGE COLOR
  // =========================
  const getBadgeColor = (module) => {

    switch (module) {

      case 'booking':
        return 'bg-blue-100 text-blue-700';

      case 'request':
        return 'bg-yellow-100 text-yellow-700';

      case 'user':
        return 'bg-green-100 text-green-700';

      case 'jalur':
        return 'bg-purple-100 text-purple-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 p-2">

      {/* TITLE */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-[#24426d]">
            Activity Log
          </h1>

          <p className="text-gray-500 mt-2">
            Riwayat seluruh aktivitas sistem
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="bg-[#24426d] text-white px-5 py-3 rounded-full flex items-center gap-2 hover:bg-[#1a3152] transition-all"
        >
          <RefreshCcw size={18} />
          Refresh
        </button>

      </div>

      {/* FILTER */}
      <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 flex flex-wrap gap-4 items-center">

        {/* SEARCH */}
        <div className="flex-1 relative min-w-[250px]">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
          />

        </div>

        {/* FILTER MODULE */}
        <div className="relative">

          <Filter
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="pl-12 pr-10 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d] bg-white"
          >
            <option value="">Semua Module</option>
            <option value="booking">Booking</option>
            <option value="request">Request</option>
            <option value="user">User</option>
            <option value="jalur">Jalur</option>
          </select>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-5 bg-[#b9d1f1] px-6 py-4">

          <div className="font-bold text-[#24426d] text-center">
            User
          </div>

          <div className="font-bold text-[#24426d] text-center">
            Module
          </div>

          <div className="font-bold text-[#24426d] text-center">
            Aktivitas
          </div>

          <div className="font-bold text-[#24426d] text-center">
            Tanggal
          </div>

          <div className="font-bold text-[#24426d] text-center">
            Status
          </div>

        </div>

        {/* BODY */}
        <div className="divide-y divide-gray-100">

          {loading ? (

            <div className="py-20 text-center text-gray-400">
              Loading...
            </div>

          ) : filteredLogs.length > 0 ? (

            filteredLogs.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-5 px-6 py-5 items-center hover:bg-gray-50 transition-all"
              >

                {/* USER */}
                <div className="flex items-center justify-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#24426d]/10 flex items-center justify-center">
                    <Activity
                      size={18}
                      className="text-[#24426d]"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-[#24426d] text-sm">
                      {item.user?.name || '-'}
                    </p>

                    <p className="text-xs text-gray-400">
                      {item.user?.email || '-'}
                    </p>
                  </div>

                </div>

                {/* MODULE */}
                <div className="text-center">

                  <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getBadgeColor(item.module)}`}>
                    {item.module}
                  </span>

                </div>

                {/* DESCRIPTION */}
                <div className="text-center text-gray-700 font-medium text-sm px-3">
                  {item.description || '-'}
                </div>

                {/* DATE */}
                <div className="text-center text-gray-500 text-sm">
                  {new Date(item.created_at).toLocaleString()}
                </div>

                {/* STATUS */}
                <div className="flex justify-center">

                  <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                    Success
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="py-20 text-center text-gray-400 italic">
              Tidak ada activity log.
            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default ActivityLog;