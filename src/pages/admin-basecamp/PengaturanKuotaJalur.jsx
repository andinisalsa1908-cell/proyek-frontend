import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import {
  getJalurs,
  createJalur,
  updateJalur,
  deleteJalur,
  getKuotas,
  createKuota,
  updateKuota,
  deleteKuota,
} from "../../services/admin-basecamp/adminBasecampService";

const PengaturanKuotaJalur = () => {

  // ================= USER LOGIN =================
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const basecampId = user?.basecamp_id;

  // ================= STATE =================
  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    nama_jalur: "",
    estimasi_waktu: "",
    status: "buka",
    deskripsi: "",
    foto_utama: null,
  });

  const [kuotaForm, setKuotaForm] = useState({
    id: null,
    kuota: "",
    tanggal: "",
  });

  // ================= FETCH DATA =================
  const fetchData = async () => {

    try {

      if (!basecampId) {
        console.log("BASECAMP ID NULL");
        return;
      }

      const jalurRes = await getJalurs(basecampId);

      const kuotaRes = await getKuotas(basecampId);

      console.log("JALUR:", jalurRes);
      console.log("KUOTA:", kuotaRes);

      const jalurs =
        jalurRes?.data?.data?.data ||
        jalurRes?.data?.data ||
        [];

      const kuotas =
        kuotaRes?.data?.data?.data ||
        kuotaRes?.data?.data ||
        [];

      const merged = jalurs.map((jalur) => {

        const kuota = kuotas.find(
          (k) => Number(k.jalur_id) === Number(jalur.id)
        );

        return {
          ...jalur,
          kuota_id: kuota?.id || null,
          kuota: kuota?.kuota || 0,
          tanggal: kuota?.tanggal || "-",
        };
      });

      setData(merged);

    } catch (err) {

      console.log(err?.response?.data || err);

    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {

    fetchData();

  }, []);

  // ================= OPEN MODAL =================
  const openModal = (item = null) => {

    if (item) {

      setIsEdit(true);

      setForm({
        id: item.id,
        nama_jalur: item.nama_jalur,
        estimasi_waktu: item.estimasi_waktu,
        status: item.status,
        deskripsi: item.deskripsi || "",
        foto_utama: null,
      });

      setKuotaForm({
        id: item.kuota_id,
        kuota: item.kuota,
        tanggal: item.tanggal !== "-" ? item.tanggal : "",
      });

    } else {

      setIsEdit(false);

      setForm({
        id: null,
        nama_jalur: "",
        estimasi_waktu: "",
        status: "buka",
        deskripsi: "",
        foto_utama: null,
      });

      setKuotaForm({
        id: null,
        kuota: "",
        tanggal: "",
      });
    }

    setShowModal(true);
  };

  // ================= SAVE =================
  const handleSave = async (e) => {

    e.preventDefault();

    try {

      if (!basecampId) {
        alert("Basecamp tidak ditemukan");
        return;
      }

      const formData = new FormData();

      formData.append("nama_jalur", form.nama_jalur);

      formData.append(
        "estimasi_waktu",
        form.estimasi_waktu
      );

      formData.append("status", form.status);

      formData.append(
        "deskripsi",
        form.deskripsi
      );

      if (form.foto_utama) {

        formData.append(
          "foto_utama",
          form.foto_utama
        );
      }

      let jalurId = form.id;

      // ================= UPDATE =================
      if (isEdit) {

        formData.append("_method", "PUT");

        await updateJalur(
          basecampId,
          form.id,
          formData
        );

      }

      // ================= CREATE =================
      else {

        const res = await createJalur(
          basecampId,
          formData
        );

        console.log("CREATE:", res);

        jalurId =
          res?.data?.data?.id ||
          res?.data?.id;
      }

      // ================= KUOTA =================
      const kuotaPayload = {
        kuota: Number(kuotaForm.kuota),
        tanggal: kuotaForm.tanggal,
      };

      if (kuotaForm.id) {

        await updateKuota(
          basecampId,
          kuotaForm.id,
          kuotaPayload
        );

      } else {

        await createKuota(
          basecampId,
          kuotaPayload
        );
      }

      setShowModal(false);

      fetchData();

    } catch (err) {

      console.log(err?.response?.data || err);

      alert("Gagal simpan data");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (item) => {

    try {

      if (item.kuota_id) {

        await deleteKuota(
          basecampId,
          item.kuota_id
        );
      }

      await deleteJalur(
        basecampId,
        item.id
      );

      fetchData();

    } catch (err) {

      console.log(err?.response?.data || err);

    }
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div>

        <h1 className="text-4xl font-bold text-[#24426d]">
          Pengaturan Jalur & Kuota
        </h1>

        <p className="text-gray-500 mt-2">
          Kelola jalur pendakian dan kuota harian basecamp
        </p>

        <button
          onClick={() => openModal()}
          className="mt-4 flex items-center gap-2 bg-[#24426d] text-white px-5 py-2 rounded-xl hover:bg-[#1a3152]"
        >
          <Plus size={18} />
          Tambah Jalur
        </button>

      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="grid grid-cols-6 bg-[#b9d1f1] px-6 py-4 font-bold text-[#24426d]">

          <div>Nama Jalur</div>

          <div>Estimasi</div>

          <div>Foto</div>

          <div>Tanggal</div>

          <div>Kuota</div>

          <div className="text-center">
            Aksi
          </div>

        </div>

        {/* BODY */}
        <div className="divide-y">

          {data.length > 0 ? (

            data.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-6 px-6 py-5 items-center"
              >

                {/* Nama Jalur */}
                <div className="font-bold text-[#24426d]">
                  {item.nama_jalur}
                </div>

                {/* Estimasi */}
                <div className="text-sm text-gray-600">
                  {item.estimasi_waktu} Jam
                </div>

                {/* Foto */}
                <div>

                  {item.foto_utama ? (

                    <img
                      src={"http://127.0.0.1:8000/storage/" + item.foto_utama}
                      alt="jalur"
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                  ) : (

                    <span className="text-gray-400 text-sm">
                      Tidak ada foto
                    </span>

                  )}

                </div>

                {/* Tanggal */}
                <div className="text-sm text-gray-500">
                  {item.tanggal}
                </div>

                {/* Kuota */}
                <div className="font-bold text-[#24426d]">
                  {item.kuota}
                </div>

                {/* Aksi */}
                <div className="flex justify-center gap-4">

                  <button
                    onClick={() => openModal(item)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

              </div>
            ))

          ) : (

            <div className="py-16 text-center text-gray-400 italic">
              Belum ada data jalur
            </div>

          )}

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div
            className="absolute inset-0"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 z-10">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-[#24426d] mb-6">

              {isEdit
                ? "Edit Jalur"
                : "Tambah Jalur"}

            </h2>

            <form
              onSubmit={handleSave}
              className="space-y-4"
            >

              <input
                placeholder="Nama Jalur"
                value={form.nama_jalur}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama_jalur: e.target.value
                  })
                }
                className="w-full p-4 border rounded-2xl"
              />

              <input
                type="number"
                placeholder="Estimasi Waktu"
                value={form.estimasi_waktu}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estimasi_waktu: e.target.value
                  })
                }
                className="w-full p-4 border rounded-2xl"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    foto_utama:
                      e.target.files?.[0]
                  })
                }
                className="w-full p-4 border rounded-2xl"
              />

              <input
                type="date"
                value={kuotaForm.tanggal}
                onChange={(e) =>
                  setKuotaForm({
                    ...kuotaForm,
                    tanggal: e.target.value
                  })
                }
                className="w-full p-4 border rounded-2xl"
              />

              <input
                type="number"
                placeholder="Kuota"
                value={kuotaForm.kuota}
                onChange={(e) =>
                  setKuotaForm({
                    ...kuotaForm,
                    kuota: e.target.value
                  })
                }
                className="w-full p-4 border rounded-2xl"
              />

              <button className="w-full bg-[#24426d] text-white py-3 rounded-2xl">

                Simpan

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default PengaturanKuotaJalur;