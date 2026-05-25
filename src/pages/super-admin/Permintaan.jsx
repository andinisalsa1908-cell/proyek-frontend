import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

import {
  getRequests,
  approveRequest,
  rejectRequest
} from '../../services/super-admin/superAdminService';

const Permintaan = () => {

  const [requests, setRequests] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  // =========================
  // FETCH REQUESTS
  // =========================
  const fetchRequests = async () => {

    try {

      const res = await getRequests();

      console.log("REQUESTS:", res.data);

      setRequests(res.data.data.data || []);

    } catch (err) {

      console.log(err.response?.data);

    }
  };

// =========================
// HANDLE APPROVE / REJECT
// =========================
const handleAction = async (id, tipe) => {

  try {

    setLoadingAction(id);

    let res;

    if (tipe === 'setuju') {

      res = await approveRequest(id);

      alert('Request berhasil disetujui');

    } else {

      const reason = prompt("Masukkan alasan penolakan:");

      // cancel prompt
      if (reason === null) {
        return;
      }

      // validasi kosong
      if (!reason.trim()) {

        alert("Reason wajib diisi");

        return;
      }

      res = await rejectRequest(id, {
        reason: reason.trim()
      });

      alert('Request berhasil ditolak');
    }

    console.log("ACTION RESPONSE:", res.data);

    await fetchRequests();

  } catch (err) {

    console.log("ERROR ACTION:", err.response?.data);

    alert(
      err.response?.data?.message ||
      "Aksi gagal!"
    );

  } finally {

    setLoadingAction(null);

  }
};

  return (
    <div className="space-y-6">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-[#24426d] mb-8">
        Permintaan
      </h1>

      {/* TABLE */}
      <div className="w-full">

        {/* HEADER */}
        <div className="grid grid-cols-5 bg-[#b9d1f1] p-4 rounded-full mb-6 shadow-sm">

          <div className="text-center font-bold text-[#24426d]">
            Nama
          </div>

          <div className="text-center font-bold text-[#24426d]">
            Email
          </div>

          <div className="text-center font-bold text-[#24426d]">
            Request
          </div>

          <div className="text-center font-bold text-[#24426d]">
            Status
          </div>

          <div className="text-center font-bold text-[#24426d]">
            Aksi
          </div>

        </div>

        {/* DATA */}
        <div className="space-y-4">

          {requests.length > 0 ? (

            requests.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-5 border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm bg-white"
              >

                {/* NAMA */}
                <div className="text-center font-medium text-gray-700">
                  {item.user?.name}
                </div>

                {/* EMAIL */}
                <div className="text-center font-medium text-gray-700">
                  {item.user?.email}
                </div>

                {/* REQUEST TYPE */}
                <div className="text-center font-medium text-gray-700 capitalize">
                  {item.request_type.replace('_', ' ')}
                </div>

                {/* STATUS */}
                <div className="text-center">

                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                      item.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >

                    {item.status}

                  </span>

                </div>

                {/* ACTION */}
                <div className="flex justify-center gap-4">

                  {item.status === 'pending' ? (

                    <>

                      {/* APPROVE */}
                      <button
                        disabled={loadingAction === item.id}
                        onClick={() => handleAction(item.id, 'setuju')}
                        className="text-green-600 hover:scale-110 transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 size={28} />
                      </button>

                      {/* REJECT */}
                      <button
                        disabled={loadingAction === item.id}
                        onClick={() => handleAction(item.id, 'tolak')}
                        className="text-red-600 hover:scale-110 transition-all disabled:opacity-50"
                      >
                        <XCircle size={28} />
                      </button>

                    </>

                  ) : (

                    <span className="text-gray-400 italic text-sm">
                      Sudah diproses
                    </span>

                  )}

                </div>

              </div>

            ))

          ) : (

            <div className="text-center py-10 text-gray-400 italic">

              Tidak ada permintaan.

            </div>

          )}

        </div>
      </div>
    </div>
  );
};

export default Permintaan;