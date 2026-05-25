import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

import {
  getRequests,
  createRequestAdminBasecamp
} from "../../services/admin-gunung/adminGunungService";

const Pengajuan = () => {

  const [dataPermintaan, setDataPermintaan] = useState([]);

  const [userId, setUserId] = useState("");

  const [basecampId, setBasecampId] = useState("");

  const [basecamps, setBasecamps] = useState([]);

  const [notif, setNotif] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetchRequests();
    fetchBasecamp();
  }, []);

  // ================= GET BASECAMPS =================
  const fetchBasecamp = async () => {
    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/admin-gunung/basecamps",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      console.log("BASECAMP RESPONSE:", data);

      setBasecamps(data?.data?.data || data?.data || []);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= GET REQUEST =================
  const fetchRequests = async () => {
    try {

      const res = await getRequests();

      console.log("REQUEST:", res.data);

      setDataPermintaan(
        res.data.data?.data || res.data.data
      );

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ================= CREATE REQUEST =================
  const handleTambah = async () => {

    if (!userId) {
      return setNotif({
        type: "error",
        message: "Masukkan user terlebih dahulu",
      });
    }

    if (!basecampId) {
      return setNotif({
        type: "error",
        message: "Pilih basecamp terlebih dahulu",
      });
    }

    try {

      await createRequestAdminBasecamp({
        user_id: userId,
        basecamp_id: basecampId
      });

      setNotif({
        type: "success",
        message: "Berhasil mengajukan admin basecamp",
      });

      setUserId("");
      setBasecampId("");

      fetchRequests();

    } catch (err) {

      console.log(err.response?.data);

      setNotif({
        type: "error",
        message:
          err.response?.data?.message ||
          "Gagal mengajukan",
      });
    }

    setTimeout(() => {
      setNotif({
        type: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-4xl font-bold text-[#24426d]">
          Pengajuan Admin Basecamp
        </h1>

        <p className="text-gray-500 mt-2">
          Ajukan admin basecamp untuk basecamp tertentu
        </p>
      </div>

      {/* NOTIF */}
      {notif.message && (
        <div
          className={`px-5 py-4 rounded-2xl text-white font-medium shadow-md
          ${
            notif.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {notif.message}
        </div>
      )}

      {/* FORM */}
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">

        <h2 className="text-2xl font-bold text-[#24426d] mb-6">
          Form Pengajuan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* USER ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              ID User
            </label>

            <input
              type="number"
              placeholder="Masukkan ID User"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-[#f9fafb] border border-gray-200 focus:border-[#24426d] outline-none p-4 rounded-2xl"
            />
          </div>

          {/* BASECAMP */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Pilih Basecamp
            </label>

            <select
              value={basecampId}
              onChange={(e) =>
                setBasecampId(e.target.value)
              }
              className="w-full bg-[#f9fafb] border border-gray-200 focus:border-[#24426d] outline-none p-4 rounded-2xl"
            >
              <option value="">
                Pilih Basecamp
              </option>

              {basecamps.map((basecamp) => (
                <option
                  key={basecamp.id}
                  value={basecamp.id}
                >
                  {basecamp.nama}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button
              onClick={handleTambah}
              className="w-full bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold py-4 rounded-2xl shadow-md transition"
            >
              Ajukan
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="grid grid-cols-4 bg-[#b9d1f1] px-6 py-4 text-[#24426d] font-bold">
          <div className="text-center">Nama</div>
          <div className="text-center">Role</div>
          <div className="text-center">Tanggal</div>
          <div className="text-center">Status</div>
        </div>

        {/* DATA */}
        <div className="divide-y">

          {dataPermintaan.length > 0 ? (

            dataPermintaan.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-4 items-center px-6 py-5 hover:bg-gray-50 transition"
              >

                {/* NAMA */}
                <div className="text-center font-medium text-gray-700">
                  {item.user?.name || "-"}
                </div>

                {/* ROLE */}
                <div className="text-center text-gray-600">
                  Admin Basecamp
                </div>

                {/* TANGGAL */}
                <div className="text-center text-gray-600">
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleDateString()
                    : "-"}
                </div>

                {/* STATUS */}
                <div className="flex justify-center">

                  <div className="bg-[#24426d] text-white rounded-full p-2">
                    <Clock size={18} />
                  </div>

                </div>

              </div>
            ))

          ) : (

            <div className="py-16 text-center text-gray-400 italic">
              Tidak ada pengajuan
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Pengajuan;