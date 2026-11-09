import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, MapPin, Mountain, Send } from "lucide-react";

import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { createPengajuan } from "../../../services/user/pengajuanService";

const initialForm = {
  nama_gunung: "",
  lokasi: "",
  deskripsi: "",
};

export default function DaftarAdminGunung() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.nama_gunung.trim() || !form.lokasi.trim()) {
      setError("Nama gunung dan lokasi wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await createPengajuan({
        ...form,
        request_type: "admin_gunung",
      });
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      console.log("ERROR DAFTAR ADMIN GUNUNG:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Gagal mengirim pendaftaran. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserPrivateLayout>
      <div className="bg-[#f8fafc] min-h-screen -mx-4 -my-6 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244275] tracking-tight">
              Daftar Admin Gunung
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Ajukan pendaftaran untuk menjadi admin gunung. Lengkapi formulir di
              bawah, lalu pantau statusnya di riwayat pendaftaran.
            </p>
          </div>

          {success ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#244275]">
                  Pendaftaran Berhasil Dikirim
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Permintaan pendaftaran admin gunung kamu sedang diproses.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/riwayat")}
                  className="inline-flex items-center justify-center gap-2 bg-[#244275] hover:bg-[#1b335c] text-white text-sm font-bold px-5 py-3 rounded-xl transition-all"
                >
                  <ClipboardList size={18} />
                  Lihat Riwayat Pendaftaran
                </button>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#244275] text-sm font-bold px-5 py-3 rounded-xl transition-all"
                >
                  Ajukan Lagi
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
            >
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <label
                  htmlFor="nama_gunung"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  <Mountain size={15} />
                  Nama Gunung
                </label>
                <input
                  id="nama_gunung"
                  name="nama_gunung"
                  type="text"
                  value={form.nama_gunung}
                  onChange={handleChange}
                  placeholder="Contoh: Gunung Ciremai"
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275] transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lokasi"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  <MapPin size={15} />
                  Lokasi
                </label>
                <input
                  id="lokasi"
                  name="lokasi"
                  type="text"
                  value={form.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Jawa Barat"
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275] transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="deskripsi"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Deskripsi / Keterangan
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  rows="5"
                  value={form.deskripsi}
                  onChange={handleChange}
                  placeholder="Jelaskan alasan pendaftaran atau informasi tambahan tentang pengelolaan gunung."
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275] transition-all resize-y"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all w-full sm:w-auto"
                >
                  <Send size={18} />
                  {loading ? "Mengirim..." : "Kirim Pendaftaran"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </UserPrivateLayout>
  );
}
