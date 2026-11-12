import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { getGunungs } from "../../../services/user/gunungService";
import { createBooking } from "../../../services/user/tiketService";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

export default function PesanTiket() {
  const [searchParams] = useSearchParams();
  const [gunungs, setGunungs] = useState([]);

  const [form, setForm] = useState({
    gunung_id: searchParams.get("gunung_id") || "",
    tanggal: "",
    jumlah_pendaki: 1,
    jalur: searchParams.get("jalur") || "",
  });

  useEffect(() => {
    loadGunung();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGunung = async () => {
    try {
      const res = await getGunungs();
      const list = extractList(res);
      setGunungs(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log(err);
      setGunungs([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking({
        ...form,
        gunung_id: form.gunung_id ? Number(form.gunung_id) : form.gunung_id,
        jumlah_pendaki: Number(form.jumlah_pendaki) || 1,
        tanggal_naik: form.tanggal,
      });
      alert("Booking berhasil");
    } catch (err) {
      alert(err.response?.data?.message || "Booking gagal");
    }
  };

  return (
    <UserPrivateLayout>
      <div className="bg-[#f8fafc] min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* HEADER JUDUL */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#244275] tracking-tight">
              Pesan Tiket
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Lengkapi formulir di bawah ini untuk memesan tiket pendakian gunung pilihanmu dengan aman dan cepat.
            </p>
          </div>

          {/* FORMULIR PEMESANAN */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
          >
            {/* PILIH GUNUNG */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Pilih Gunung
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275] transition-all"
                value={form.gunung_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gunung_id: e.target.value,
                  })
                }
                required
              >
                <option value="">-- Pilih Gunung Tujuan --</option>
                {gunungs.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* TANGGAL PENDAKIAN */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Tanggal Pendakian
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275] transition-all"
                value={form.tanggal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanggal: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* JUMLAH PENDAKI */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Jumlah Pendaki (Orang)
              </label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#244275] transition-all"
                min="1"
                value={form.jumlah_pendaki}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jumlah_pendaki: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* TOMBOL SUBMIT */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all w-full sm:w-auto"
              >
                Konfirmasi & Pesan Tiket
              </button>
            </div>
          </form>

        </div>
      </div>
    </UserPrivateLayout>
  );
}