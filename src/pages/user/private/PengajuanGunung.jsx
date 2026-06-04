import { useState } from "react";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { createPengajuan } from "../../../services/user/pengajuanService";

export default function PengajuanGunung() {
  const [form, setForm] = useState({
    nama_gunung: "",
    lokasi: "",
    deskripsi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPengajuan(form);
      alert("Pengajuan berhasil dikirim");
    } catch (err) {
      alert("Pengajuan gagal");
    }
  };

  return (
    <UserPrivateLayout>
      <h1 className="text-3xl font-bold mb-6">
        Pengajuan Gunung
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          placeholder="Nama Gunung"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              nama_gunung: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Lokasi"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              lokasi: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Deskripsi"
          className="w-full border p-3 rounded mb-4"
          rows="5"
          onChange={(e) =>
            setForm({
              ...form,
              deskripsi: e.target.value,
            })
          }
        />

        <button className="bg-green-600 text-white px-5 py-2 rounded">
          Kirim Pengajuan
        </button>
      </form>
    </UserPrivateLayout>
  );
}