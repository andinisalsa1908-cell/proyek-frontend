import React, { useEffect, useState } from 'react';
import {
  Pencil,
  Trash2,
  Plus,
  X
} from 'lucide-react';

import {
  getGunungs,
  createGunung,
  updateGunung,
  deleteGunung,
} from "../../services/admin-gunung/adminGunungService";

const KelolaDataGunung = () => {

  const [daftarGunung, setDaftarGunung] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [notif, setNotif] = useState({
    type: "",
    message: ""
  });

  const [currentGunung, setCurrentGunung] = useState({
    id: null,
    nama: '',
    lokasi: '',
    ketinggian: '',
    deskripsi: '',
    foto_utama: null,
    status: true,
  });

  useEffect(() => {
    fetchGunungs();
  }, []);

  const fetchGunungs = async () => {
    try {

      const res = await getGunungs();

      setDaftarGunung(
        res.data.data.data || res.data.data
      );

    } catch (err) {

      console.log(err.response?.data);

    }
  };

  const showNotification = (type, message) => {

    setNotif({ type, message });

    setTimeout(() => {
      setNotif({ type: "", message: "" });
    }, 3000);
  };

  const handleSave = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      if (isEditMode) {
        formData.append('_method', 'PUT');
      }

      formData.append('nama', currentGunung.nama || '');
      formData.append('lokasi', currentGunung.lokasi || '');
      formData.append('ketinggian', currentGunung.ketinggian || '');
      formData.append('deskripsi', currentGunung.deskripsi || '');
      formData.append('status', currentGunung.status ? 1 : 0);

      if (
        currentGunung.foto_utama &&
        typeof currentGunung.foto_utama !== 'string'
      ) {

        formData.append(
          'foto_utama',
          currentGunung.foto_utama
        );
      }

      if (isEditMode) {

        await updateGunung(
          currentGunung.id,
          formData
        );

        showNotification(
          "success",
          "Gunung berhasil diupdate"
        );

      } else {

        await createGunung(formData);

        showNotification(
          "success",
          "Gunung berhasil ditambahkan"
        );
      }

      setShowModal(false);

      fetchGunungs();

    } catch (err) {

      console.log(err.response?.data);

      showNotification(
        "error",
        err.response?.data?.message ||
        "Gagal simpan data"
      );
    }
  };

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        'Yakin ingin menghapus data gunung ini?'
      )
    ) return;

    try {

      await deleteGunung(id);

      showNotification(
        "success",
        "Gunung berhasil dihapus"
      );

      fetchGunungs();

    } catch (err) {

      console.log(err.response?.data);

      showNotification(
        "error",
        "Gagal hapus data"
      );
    }
  };

  const openAddModal = () => {

    setIsEditMode(false);

    setCurrentGunung({
      id: null,
      nama: '',
      lokasi: '',
      ketinggian: '',
      deskripsi: '',
      foto_utama: null,
      status: true,
    });

    setShowModal(true);
  };

  const openEditModal = (gunung) => {

    setIsEditMode(true);

    setCurrentGunung({
      ...gunung,
      foto_utama: gunung.foto_utama || null,
    });

    setShowModal(true);
  };

  return (
    <div className="space-y-8">

      {/* NOTIF */}
      {notif.message && (
        <div className={`px-5 py-4 rounded-2xl text-white font-medium shadow-md ${
          notif.type === "success"
            ? "bg-green-500"
            : "bg-red-500"
        }`}>
          {notif.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-[#24426d]">
            Kelola Gunung
          </h1>

          <p className="text-gray-500 mt-2">
            Tambahkan dan kelola data gunung pendakian
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#24426d] text-white px-6 py-2 rounded-full hover:bg-[#1a3152]"
        >
          <Plus size={18} />
          Tambah Gunung
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        {/* HEADER TABLE */}
        <div className="grid grid-cols-7 bg-[#b9d1f1] px-6 py-4 font-bold text-[#24426d]">

          <div className="text-center">Foto</div>

          <div className="text-center">Nama</div>

          <div className="text-center">Lokasi</div>

          <div className="text-center">Ketinggian</div>

          <div className="text-center">Deskripsi</div>

          <div className="text-center">Status</div>

          <div className="text-center">Aksi</div>

        </div>

        {/* ISI TABLE */}
        <div className="divide-y">

          {daftarGunung.length > 0 ? (

            daftarGunung.map((gunung) => (

              <div
                key={gunung.id}
                className="grid grid-cols-7 px-6 py-5 items-center"
              >

                {/* FOTO */}
                <div className="flex justify-center">

                  <img
                    src={
                      gunung.foto_utama
                        ? `http://127.0.0.1:8000/storage/${gunung.foto_utama}`
                        : 'https://via.placeholder.com/80'
                    }
                    alt={gunung.nama}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                </div>

                {/* NAMA */}
                <div className="text-center">
                  {gunung.nama}
                </div>

                {/* LOKASI */}
                <div className="text-center">
                  {gunung.lokasi}
                </div>

                {/* KETINGGIAN */}
                <div className="text-center">
                  {gunung.ketinggian} mdpl
                </div>

                {/* DESKRIPSI */}
                <div className="text-center px-2 truncate">
                  {gunung.deskripsi}
                </div>

                {/* STATUS */}
                <div className="text-center">

                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                    gunung.status
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>

                    {gunung.status
                      ? 'Aktif'
                      : 'Nonaktif'}

                  </span>

                </div>

                {/* AKSI */}
                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => openEditModal(gunung)}
                    className="text-black hover:text-blue-600 transition"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(gunung.id)}
                    className="text-black hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))

          ) : (

            <div className="py-16 text-center text-gray-400 italic">
              Belum ada data gunung
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

          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 z-10">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-[#24426d] mb-6">
              {isEditMode
                ? "Edit Gunung"
                : "Tambah Gunung"}
            </h2>

            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* NAMA */}
              <input
                type="text"
                placeholder="Nama Gunung"
                value={currentGunung.nama}
                onChange={(e) =>
                  setCurrentGunung({
                    ...currentGunung,
                    nama: e.target.value
                  })
                }
                className="border p-3 rounded-xl"
                required
              />

              {/* LOKASI */}
              <input
                type="text"
                placeholder="Lokasi"
                value={currentGunung.lokasi}
                onChange={(e) =>
                  setCurrentGunung({
                    ...currentGunung,
                    lokasi: e.target.value
                  })
                }
                className="border p-3 rounded-xl"
                required
              />

              {/* KETINGGIAN */}
              <input
                type="number"
                placeholder="Ketinggian"
                value={currentGunung.ketinggian}
                onChange={(e) =>
                  setCurrentGunung({
                    ...currentGunung,
                    ketinggian: e.target.value
                  })
                }
                className="border p-3 rounded-xl"
                required
              />

              {/* DESKRIPSI */}
              <textarea
                placeholder="Deskripsi"
                value={currentGunung.deskripsi}
                onChange={(e) =>
                  setCurrentGunung({
                    ...currentGunung,
                    deskripsi: e.target.value
                  })
                }
                className="border p-3 rounded-xl md:col-span-2"
              />

              {/* FOTO */}
              <div className="md:col-span-2">

                <label className="block mb-2 font-medium text-gray-700">
                  Upload Foto Gunung
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCurrentGunung({
                      ...currentGunung,
                      foto_utama: e.target.files[0]
                    })
                  }
                  className="border p-3 rounded-xl w-full"
                />

                {/* PREVIEW */}
                {currentGunung.foto_utama && (

                  <img
                    src={
                      typeof currentGunung.foto_utama === "string"
                        ? `http://127.0.0.1:8000/storage/${currentGunung.foto_utama}`
                        : URL.createObjectURL(currentGunung.foto_utama)
                    }
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-xl mt-4"
                  />

                )}

              </div>

              {/* BUTTON */}
              <button
                className="md:col-span-2 bg-[#24426d] text-white py-3 rounded-xl hover:bg-[#1a3152]"
              >
                Simpan
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default KelolaDataGunung;