import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getGunungs } from '../../services/super-admin/superAdminService';

const Gunung = () => {
  const [gunungs, setGunungs] = useState([]);

  useEffect(() => {
    fetchGunungs();
  }, []);

  const fetchGunungs = async () => {
    try {
      const res = await getGunungs();

      console.log("GUNUNG:", res.data);

      // kalau tidak pakai pagination
      setGunungs(res.data.data || []);

      // kalau pakai pagination:
      // setGunungs(res.data.data.data);

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Data Gunung
      </h1>

      {/* HEADER */}
      <div className="grid grid-cols-4 bg-[#b9d1f1] p-4 rounded-full mb-6 shadow-sm">
        <div className="text-center font-bold text-[#24426d]">Nama Gunung</div>
        <div className="text-center font-bold text-[#24426d]">Lokasi</div>
        <div className="text-center font-bold text-[#24426d]">Ketinggian</div>
        <div className="text-center font-bold text-[#24426d]">Aksi</div>
      </div>

      {/* DATA */}
      <div className="space-y-4">
        {gunungs.length > 0 ? (
          gunungs.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-4 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm"
            >
              <div className="text-center font-medium text-gray-700">
                {item.nama}
              </div>

              <div className="text-center font-medium text-gray-700">
                {item.lokasi || "-"}
              </div>

              <div className="text-center font-medium text-gray-700">
                {item.ketinggian || "-"} mdpl
              </div>

              <div className="flex justify-center gap-4">
                <button className="text-red-600 hover:scale-125 transition-transform">
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 italic">
            Tidak ada data gunung.
          </div>
        )}
      </div>

    </div>
  );
};

export default Gunung;