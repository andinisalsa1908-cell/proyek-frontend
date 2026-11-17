import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

import {
  getKuotas,
  createKuota,
  updateKuota,
  deleteKuota,
  getBasecamp,
  updateHargaTiket,
} from "../../services/admin-basecamp/adminBasecampService";

const emptyKuotaForm = {
  id: null,
  tanggal: "",
  kuota: "",
};

const formatTanggal = (value) => {
  if (!value) return "-";
  return String(value).slice(0, 10);
};

const formatRupiah = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const ambilPesanError = (err, fallback) => {
  const data = err?.response?.data;

  if (data?.errors) {
    const pesan = Object.values(data.errors).flat().join(", ");
    if (pesan) return pesan;
  }

  return data?.message || fallback;
};

const PengaturanKuotaJalur = () => {
  // ================= USER LOGIN =================
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // basecamp_id dari login. Bisa kosong untuk sesi login lama,
  // karena itu nanti diambil dari response GET /admin-basecamp/basecamp.
  const basecampId = user?.basecamp_id;

  // ================= STATE =================
  const [kuotas, setKuotas] = useState([]);
  const [basecamp, setBasecamp] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyKuotaForm);

  const [harga, setHarga] = useState("");
  const [savingHarga, setSavingHarga] = useState(false);

  const [notif, setNotif] = useState({ type: "", message: "" });

  const showNotif = (type, message) => {
    setNotif({ type, message });
    setTimeout(() => setNotif({ type: "", message: "" }), 3000);
  };

  // ================= FETCH DATA =================
  const fetchData = async () => {
    setLoading(true);

    let id = basecampId;

    try {
      const basecampRes = await getBasecamp();
      const data = basecampRes?.data?.data || null;

      setBasecamp(data);
      setHarga(data?.harga_tiket ?? "");

      if (!id) {
        id = data?.id;
      }
    } catch (err) {
      showNotif(
        "error",
        ambilPesanError(err, "Gagal mengambil data basecamp")
      );
    }

    if (!id) {
      showNotif("error", "Basecamp untuk akun ini tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const kuotaRes = await getKuotas(id);

      const list =
        kuotaRes?.data?.data?.data ||
        kuotaRes?.data?.data ||
        [];

      setKuotas(Array.isArray(list) ? list : []);
    } catch (err) {
      showNotif(
        "error",
        ambilPesanError(err, "Gagal mengambil data kuota")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= OPEN MODAL =================
  const openModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setForm({
        id: item.id,
        tanggal: formatTanggal(item.tanggal),
        kuota: item.kuota ?? "",
      });
    } else {
      setIsEdit(false);
      setForm(emptyKuotaForm);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyKuotaForm);
  };

  // ================= SAVE KUOTA =================
  const handleSave = async (e) => {
    e.preventDefault();

    const idBasecamp = basecampId || basecamp?.id;

    if (!idBasecamp) {
      showNotif("error", "Basecamp untuk akun ini tidak ditemukan");
      return;
    }

    if (!form.tanggal) {
      showNotif("error", "Tanggal wajib diisi");
      return;
    }

    if (form.kuota === "" || Number(form.kuota) < 0) {
      showNotif("error", "Kuota wajib diisi dengan angka 0 atau lebih");
      return;
    }

    const payload = {
      tanggal: form.tanggal,
      kuota: Number(form.kuota),
    };

    try {
      setSaving(true);

      if (isEdit) {
        await updateKuota(idBasecamp, form.id, payload);
      } else {
        await createKuota(idBasecamp, payload);
      }

      closeModal();
      showNotif(
        "success",
        isEdit ? "Kuota berhasil diperbarui" : "Kuota berhasil ditambahkan"
      );
      fetchData();
    } catch (err) {
      showNotif(
        "error",
        ambilPesanError(err, "Gagal menyimpan kuota")
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE KUOTA =================
  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus kuota tanggal ${formatTanggal(item.tanggal)}?`)) {
      return;
    }

    const idBasecamp = basecampId || basecamp?.id;

    if (!idBasecamp) {
      showNotif("error", "Basecamp untuk akun ini tidak ditemukan");
      return;
    }

    try {
      await deleteKuota(idBasecamp, item.id);
      showNotif("success", "Kuota berhasil dihapus");
      fetchData();
    } catch (err) {
      showNotif(
        "error",
        ambilPesanError(err, "Gagal menghapus kuota")
      );
    }
  };

  // ================= SAVE HARGA =================
  const handleSaveHarga = async (e) => {
    e.preventDefault();

    if (harga === "" || Number(harga) < 0) {
      showNotif("error", "Harga tiket wajib diisi dengan angka 0 atau lebih");
      return;
    }

    try {
      setSavingHarga(true);

      await updateHargaTiket({ harga_tiket: Number(harga) });

      showNotif("success", "Harga tiket berhasil diperbarui");
      fetchData();
    } catch (err) {
      showNotif(
        "error",
        ambilPesanError(err, "Gagal menyimpan harga tiket")
      );
    } finally {
      setSavingHarga(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-4xl font-bold text-[#24426d]">
          Pengaturan Kuota
        </h1>

        <p className="text-gray-500 mt-2">
          Atur harga tiket dan kuota harian basecamp
        </p>
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

      {/* HARGA TIKET */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#24426d]">
              Harga Tiket Basecamp
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {basecamp?.nama ? `Basecamp ${basecamp.nama}` : "Basecamp"}
              {" • "}
              Harga saat ini:{" "}
              <span className="font-bold text-[#24426d]">
                {formatRupiah(basecamp?.harga_tiket)}
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSaveHarga}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="number"
              min="0"
              placeholder="Harga tiket"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full sm:w-56 p-3 rounded-2xl border outline-none focus:border-[#24426d]"
              required
            />

            <button
              type="submit"
              disabled={savingHarga}
              className="bg-[#24426d] text-white px-5 py-3 rounded-2xl hover:bg-[#1a3152] disabled:opacity-50"
            >
              {savingHarga ? "Menyimpan..." : "Simpan Harga"}
            </button>
          </form>
        </div>
      </div>

      {/* KUOTA */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[#b9d1f1]">
          <div>
            <h2 className="text-xl font-bold text-[#24426d]">
              Kuota Harian
            </h2>

            <p className="text-xs text-[#24426d]/70">
              Kuota dipakai per tanggal pendakian
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#24426d] text-white px-5 py-2 rounded-xl hover:bg-[#1a3152]"
          >
            <Plus size={18} />
            Tambah Kuota
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-5 px-6 py-4 font-bold text-[#24426d] border-b">
          <div>Tanggal</div>
          <div>Kuota</div>
          <div>Terpakai</div>
          <div>Sisa</div>
          <div className="text-center">Aksi</div>
        </div>

        {/* BODY */}
        <div className="divide-y">
          {loading ? (
            <div className="py-16 text-center text-gray-400">
              Loading...
            </div>
          ) : kuotas.length > 0 ? (
            kuotas.map((item) => {
              const sisa =
                Number(item.kuota || 0) - Number(item.kuota_terpakai || 0);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-5 px-6 py-5 items-center"
                >
                  <div className="font-bold text-[#24426d]">
                    {formatTanggal(item.tanggal)}
                  </div>

                  <div className="text-gray-700">
                    {item.kuota ?? 0}
                  </div>

                  <div className="text-gray-700">
                    {item.kuota_terpakai ?? 0}
                  </div>

                  <div
                    className={`font-bold ${
                      sisa > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {sisa}
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => openModal(item)}
                      className="text-yellow-500 hover:text-yellow-600"
                      title="Edit Kuota"
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-500 hover:text-red-600"
                      title="Hapus Kuota"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-gray-400 italic">
              Belum ada data kuota
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div
            className="absolute inset-0"
            onClick={closeModal}
          />

          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 z-10">
            <button
              onClick={closeModal}
              className="absolute top-4 right-5 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-[#24426d] mb-6">
              {isEdit ? "Edit Kuota" : "Tambah Kuota"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Tanggal
                </label>

                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm({ ...form, tanggal: e.target.value })
                  }
                  className="w-full p-4 border rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Kuota Pendaki
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Contoh: 100"
                  value={form.kuota}
                  onChange={(e) =>
                    setForm({ ...form, kuota: e.target.value })
                  }
                  className="w-full p-4 border rounded-2xl"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#24426d] text-white py-3 rounded-2xl hover:bg-[#1a3152] disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengaturanKuotaJalur;
