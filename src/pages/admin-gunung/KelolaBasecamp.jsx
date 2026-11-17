import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import {
  getBasecamps,
  createBasecamp,
  updateBasecamp,
  deleteBasecamp,
} from "../../services/admin-gunung/adminGunungService";

const KelolaBasecamp = () => {
  const [basecamps, setBasecamps] = useState([]);

  const [notif, setNotif] = useState({
    type: "",
    message: "",
  });

  const [showForm, setShowForm] = useState(false);

  const [current, setCurrent] = useState({
    id: null,
    nama: "",
    gunung_id: "",
    lokasi: "",
    latitude: "",
    longitude: "",
    foto_utama: null,
  });

  useEffect(() => {
    fetchBasecamps();
  }, []);

  const fetchBasecamps = async () => {
    try {
      const res = await getBasecamps();
      setBasecamps(res.data.data?.data || res.data.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nama", current.nama);
      formData.append("gunung_id", current.gunung_id);
      formData.append("lokasi", current.lokasi);

      // Koordinat dipakai sebagai titik pusat basecamp pada peta tracking.
      formData.append("latitude", current.latitude ?? "");
      formData.append("longitude", current.longitude ?? "");

      if (current.foto_utama) {
        formData.append("foto_utama", current.foto_utama);
      }

      if (current.id) {
        formData.append("_method", "PUT");
        await updateBasecamp(current.id, formData);

        setNotif({
          type: "success",
          message: "Basecamp berhasil diupdate",
        });
      } else {
        await createBasecamp(formData);

        setNotif({
          type: "success",
          message: "Basecamp berhasil ditambahkan",
        });
      }

      setCurrent({
        id: null,
        nama: "",
        gunung_id: "",
        lokasi: "",
        latitude: "",
        longitude: "",
        foto_utama: null,
      });

      setShowForm(false);

      fetchBasecamps();
    } catch (err) {
      setNotif({
        type: "error",
        message: err.response?.data?.message || "Gagal simpan data",
      });
    }

    setTimeout(() => {
      setNotif({ type: "", message: "" });
    }, 3000);
  };

  const handleEdit = (item) => {
    setCurrent({
      id: item.id,
      nama: item.nama,
      gunung_id: item.gunung_id,
      lokasi: item.lokasi,
      latitude: item.latitude ?? "",
      longitude: item.longitude ?? "",
      foto_utama: null,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus basecamp?")) return;

    try {
      await deleteBasecamp(id);

      setNotif({
        type: "success",
        message: "Basecamp berhasil dihapus",
      });

      fetchBasecamps();
    } catch (err) {
      setNotif({
        type: "error",
        message: "Gagal menghapus basecamp",
      });
    }

    setTimeout(() => {
      setNotif({ type: "", message: "" });
    }, 3000);
  };

  // Ambil koordinat perangkat untuk mengisi titik basecamp.
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setNotif({
        type: "error",
        message: "Browser tidak mendukung geolokasi",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrent((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7),
        }));

        setNotif({
          type: "success",
          message: "Koordinat lokasi Anda berhasil diisi",
        });

        setTimeout(() => setNotif({ type: "", message: "" }), 3000);
      },
      () => {
        setNotif({
          type: "error",
          message:
            "Gagal mengambil lokasi. Izinkan akses lokasi pada browser lalu coba lagi.",
        });

        setTimeout(() => setNotif({ type: "", message: "" }), 3000);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#24426d]">
          Kelola Basecamp
        </h1>

        <p className="text-gray-500 mt-2">
          Tambahkan dan kelola data basecamp pendakian
        </p>
        </div>

        <button
          onClick={() => {
            setCurrent({
              id: null,
              nama: "",
              gunung_id: "",
              lokasi: "",
              latitude: "",
              longitude: "",
              foto_utama: null,
            });

            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#24426d] text-white px-6 py-2 rounded-full hover:bg-[#1a3152]"
        >
          <Plus size={18} />
            Tambah Basecamp
        </button>
      </div>

      {/* NOTIF */}
      {notif.message && (
        <div
          className={`px-5 py-4 rounded-2xl text-white font-medium shadow-md ${
            notif.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notif.message}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        <div className="grid grid-cols-7 bg-[#b9d1f1] px-6 py-4 font-bold text-[#24426d]">
          <div className="text-center">Foto</div>
          <div className="text-center">Nama</div>
          <div className="text-center">Gunung</div>
          <div className="text-center">Lokasi</div>
          <div className="text-center">Koordinat</div>
          <div className="text-center">Harga</div>
          <div className="text-center">Aksi</div>
        </div>

        <div className="divide-y">
          {basecamps.length > 0 ? (
            basecamps.map((item) => (
              <div key={item.id} className="grid grid-cols-7 px-6 py-5">

                <div className="flex justify-center">
                  {item.foto_utama ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${item.foto_utama}`}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  ) : (
                    "No Image"
                  )}
                </div>

                <div className="text-center">{item.nama}</div>
                <div className="text-center">{item.gunung_id}</div>
                <div className="text-center">{item.lokasi}</div>
                <div className="text-center text-xs">
                  {item.latitude != null && item.longitude != null ? (
                    <span className="text-[#24426d] font-semibold">
                      {Number(item.latitude).toFixed(5)},{" "}
                      {Number(item.longitude).toFixed(5)}
                    </span>
                  ) : (
                    <span className="text-amber-600 italic">
                      Belum diatur
                    </span>
                  )}
                </div>
                <div className="text-center">
                  Rp{" "}
                  {Number(item.harga_tiket || 0).toLocaleString("id-ID")}
                </div>

                <div className="flex justify-center gap-4">

                  {/* EDIT ICON */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-black-500 hover:text-blue-600 transition"
                    title="Edit"
                  >
                    <Pencil size={20} />
                  </button>

                  {/* DELETE ICON */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-black-500 hover:text-red-600 transition"
                    title="Hapus"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-400 italic">
              Belum ada data basecamp
            </div>
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          {/* overlay */}
          <div
            className="absolute inset-0"
            onClick={() => setShowForm(false)}
          ></div>

          {/* modal */}
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 z-10">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-[#24426d] mb-6">
              {current.id ? "Edit Basecamp" : "Tambah Basecamp"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* NAMA */}
              <div className="space-y-2">
                <label>Nama Basecamp</label>
                <input
                  type="text"
                  value={current.nama}
                  onChange={(e) =>
                    setCurrent({ ...current, nama: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border"
                  required
                />
              </div>

              {/* GUNUNG */}
              <div className="space-y-2">
                <label>ID Gunung</label>
                <input
                  type="number"
                  value={current.gunung_id}
                  onChange={(e) =>
                    setCurrent({ ...current, gunung_id: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border"
                  required
                />
              </div>

              {/* LOKASI */}
              <div className="space-y-2">
                <label>Lokasi</label>
                <input
                  type="text"
                  value={current.lokasi}
                  onChange={(e) =>
                    setCurrent({ ...current, lokasi: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border"
                  required
                />
              </div>

              {/* KOORDINAT */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label>Koordinat Basecamp (untuk peta tracking)</label>

                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="text-xs font-bold text-[#24426d] underline"
                  >
                    Gunakan lokasi saya
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="Latitude, contoh -6.914744"
                    value={current.latitude}
                    onChange={(e) =>
                      setCurrent({ ...current, latitude: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border"
                  />

                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="Longitude, contoh 107.609810"
                    value={current.longitude}
                    onChange={(e) =>
                      setCurrent({ ...current, longitude: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Titik ini menjadi pusat peta dan acuan peringatan bila
                  pendaki memulai tracking lebih dari 1 km dari basecamp.
                </p>
              </div>

              {/* HARGA diatur oleh Admin Basecamp */}
              <div className="space-y-2">
                <label>Harga Tiket</label>
                <div className="w-full p-4 rounded-2xl border bg-gray-50 text-gray-500">
                  {current.id
                    ? `Rp ${Number(
                        basecamps.find((b) => b.id === current.id)?.harga_tiket || 0
                      ).toLocaleString("id-ID")}`
                    : "Diatur oleh Admin Basecamp setelah basecamp dibuat"}
                </div>
              </div>

              {/* FOTO */}
              <div className="md:col-span-2">
                <input
                  type="file"
                  onChange={(e) =>
                    setCurrent({
                      ...current,
                      foto_utama: e.target.files[0],
                    })
                  }
                />
              </div>

              {/* BUTTON */}
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-2xl bg-gray-200"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-[#24426d] text-white px-6 py-3 rounded-2xl"
                >
                  {current.id ? "Update" : "Simpan"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default KelolaBasecamp;