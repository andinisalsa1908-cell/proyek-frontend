import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  Package,
} from "lucide-react";

import {
  getPeralatans,
  createPeralatan,
  updatePeralatan,
  deletePeralatan,
} from "../../services/admin-basecamp/adminBasecampService";

const emptyForm = {
  id: null,
  nama: "",
  harga_sewa: "",
  stok: "",
  deskripsi: "",
  foto_utama: null,
};

const KelolaPeralatan = () => {

  // ================= USER LOGIN =================
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const basecampId = user?.basecamp_id;

  // ================= STATE =================
  const [peralatans, setPeralatans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [notif, setNotif] = useState({
    type: "",
    message: "",
  });

  // ================= FETCH DATA =================
  const fetchPeralatans = async () => {

    try {

      setLoading(true);

      if (!basecampId) {
        console.log("BASECAMP ID NULL");
        return;
      }

      const res = await getPeralatans(basecampId);

      console.log("PERALATAN:", res.data);

      setPeralatans(
        res.data.data?.data ||
        res.data.data ||
        []
      );

    } catch (err) {

      console.log(err?.response?.data || err);

      setNotif({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Gagal mengambil data peralatan",
      });

      setTimeout(() => {
        setNotif({ type: "", message: "" });
      }, 3000);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchPeralatans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= OPEN MODAL =================
  const openModal = (item = null) => {

    if (item) {

      setIsEdit(true);

      setForm({
        id: item.id,
        nama: item.nama || "",
        harga_sewa: item.harga_sewa ?? item.harga ?? "",
        stok: item.stok ?? "",
        deskripsi: item.deskripsi || "",
        foto_utama: null,
      });

    } else {

      setIsEdit(false);

      setForm(emptyForm);

    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  // ================= SAVE =================
  const handleSave = async (e) => {

    e.preventDefault();

    if (!basecampId) {
      alert("Basecamp tidak ditemukan");
      return;
    }

    if (!form.nama.trim()) {
      alert("Nama peralatan wajib diisi");
      return;
    }

    try {

      setSaving(true);

      const formData = new FormData();

      formData.append("nama", form.nama.trim());
      formData.append("harga_sewa", Number(form.harga_sewa) || 0);
      formData.append("stok", Number(form.stok) || 0);
      formData.append("deskripsi", form.deskripsi.trim());

      if (form.foto_utama) {
        formData.append("foto_utama", form.foto_utama);
      }

      if (isEdit) {

        formData.append("_method", "PUT");

        await updatePeralatan(
          basecampId,
          form.id,
          formData
        );

        setNotif({
          type: "success",
          message: "Peralatan berhasil diperbarui",
        });

      } else {

        await createPeralatan(
          basecampId,
          formData
        );

        setNotif({
          type: "success",
          message: "Peralatan berhasil ditambahkan",
        });

      }

      closeModal();

      await fetchPeralatans();

    } catch (err) {

      console.log("ERROR SAVE PERALATAN:", err?.response?.data || err);

      setNotif({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Gagal menyimpan peralatan",
      });

    } finally {

      setSaving(false);

      setTimeout(() => {
        setNotif({ type: "", message: "" });
      }, 3000);

    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("Yakin ingin menghapus peralatan ini?")) return;

    try {

      await deletePeralatan(basecampId, id);

      setNotif({
        type: "success",
        message: "Peralatan berhasil dihapus",
      });

      await fetchPeralatans();

    } catch (err) {

      console.log(err?.response?.data || err);

      setNotif({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Gagal menghapus peralatan",
      });

    }

    setTimeout(() => {
      setNotif({ type: "", message: "" });
    }, 3000);
  };

  // ================= FILTER SEARCH =================
  const filteredPeralatans = peralatans.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (value) =>
    `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div className="flex justify-between items-center gap-4">

        <div>
          <h1 className="text-4xl font-bold text-[#24426d]">
            Kelola Peralatan
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola peralatan sewa yang tersedia di basecamp
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#24426d] text-white px-6 py-3 rounded-full hover:bg-[#1a3152] transition-all active:scale-95"
        >
          <Plus size={18} />
          Tambah Peralatan
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

      {/* SEARCH */}
      <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari nama peralatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="grid grid-cols-6 bg-[#b9d1f1] px-6 py-4 font-bold text-[#24426d]">

          <div className="text-center">Foto</div>
          <div className="text-center">Nama Peralatan</div>
          <div className="text-center">Harga Sewa</div>
          <div className="text-center">Stok</div>
          <div className="text-center">Status</div>
          <div className="text-center">Aksi</div>

        </div>

        {/* BODY */}
        <div className="divide-y">

          {loading ? (

            <div className="py-16 text-center text-gray-400">
              Loading...
            </div>

          ) : filteredPeralatans.length > 0 ? (

            filteredPeralatans.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-6 px-6 py-5 items-center hover:bg-gray-50 transition-all"
              >

                {/* FOTO */}
                <div className="flex justify-center">

                  {item.foto_utama ? (

                    <img
                      src={`http://127.0.0.1:8000/storage/${item.foto_utama}`}
                      alt={item.nama}
                      className="w-16 h-16 rounded-xl object-cover"
                    />

                  ) : (

                    <div className="w-16 h-16 rounded-xl bg-[#24426d]/10 flex items-center justify-center">
                      <Package size={24} className="text-[#24426d]" />
                    </div>

                  )}

                </div>

                {/* NAMA */}
                <div className="text-center">

                  <p className="font-bold text-[#24426d]">
                    {item.nama || "-"}
                  </p>

                  {item.deskripsi && (
                    <p className="text-xs text-gray-400 truncate px-2 mt-1">
                      {item.deskripsi}
                    </p>
                  )}

                </div>

                {/* HARGA */}
                <div className="text-center text-sm text-gray-600">
                  {formatRupiah(item.harga_sewa ?? item.harga)}
                </div>

                {/* STOK */}
                <div className="text-center font-bold text-[#24426d]">
                  {item.stok ?? 0}
                </div>

                {/* STATUS */}
                <div className="flex justify-center">

                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                      Number(item.stok) > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(item.stok) > 0 ? "Tersedia" : "Habis"}
                  </span>

                </div>

                {/* AKSI */}
                <div className="flex justify-center gap-4">

                  <button
                    onClick={() => openModal(item)}
                    className="text-yellow-500 hover:text-yellow-600 hover:scale-110 transition-transform"
                    title="Edit Peralatan"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform"
                    title="Hapus Peralatan"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="py-16 text-center text-gray-400 italic">
              Belum ada data peralatan
            </div>

          )}

        </div>

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          {/* overlay */}
          <div
            className="absolute inset-0"
            onClick={closeModal}
          ></div>

          {/* modal */}
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">

            <button
              onClick={closeModal}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-[#24426d] mb-6">
              {isEdit ? "Edit Peralatan" : "Tambah Peralatan"}
            </h2>

            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* NAMA */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Nama Peralatan
                </label>

                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) =>
                    setForm({ ...form, nama: e.target.value })
                  }
                  placeholder="Contoh: Tenda 4 Orang"
                  className="w-full p-4 rounded-2xl border outline-none focus:border-[#24426d]"
                  required
                />
              </div>

              {/* HARGA */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Harga Sewa
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.harga_sewa}
                  onChange={(e) =>
                    setForm({ ...form, harga_sewa: e.target.value })
                  }
                  placeholder="Contoh: 50000"
                  className="w-full p-4 rounded-2xl border outline-none focus:border-[#24426d]"
                  required
                />
              </div>

              {/* STOK */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Stok
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.stok}
                  onChange={(e) =>
                    setForm({ ...form, stok: e.target.value })
                  }
                  placeholder="Contoh: 10"
                  className="w-full p-4 rounded-2xl border outline-none focus:border-[#24426d]"
                  required
                />
              </div>

              {/* FOTO */}
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Foto Peralatan
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      foto_utama: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full p-4 rounded-2xl border"
                />
              </div>

              {/* DESKRIPSI */}
              <div className="md:col-span-2 space-y-2">
                <label className="font-medium text-gray-700">
                  Deskripsi
                </label>

                <textarea
                  rows={3}
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  placeholder="Deskripsi singkat peralatan..."
                  className="w-full p-4 rounded-2xl border outline-none focus:border-[#24426d] resize-none"
                />
              </div>

              {/* BUTTON */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-all"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#24426d] text-white px-6 py-3 rounded-2xl hover:bg-[#1a3152] transition-all disabled:opacity-50"
                >
                  {saving
                    ? "Menyimpan..."
                    : isEdit
                    ? "Update"
                    : "Simpan"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default KelolaPeralatan;
