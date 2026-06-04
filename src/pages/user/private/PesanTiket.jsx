import { useEffect, useState } from "react";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { getGunungs } from "../../../services/user/gunungService";
import { createBooking } from "../../../services/user/tiketService";

export default function PesanTiket() {
  const [gunungs, setGunungs] = useState([]);

  const [form, setForm] = useState({
    gunung_id: "",
    tanggal: "",
    jumlah_pendaki: 1,
  });

  useEffect(() => {
    loadGunung();
  }, []);

  const loadGunung = async () => {
    try {
      const res = await getGunungs();
      setGunungs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBooking(form);
      alert("Booking berhasil");
    } catch (err) {
      alert("Booking gagal");
    }
  };

  return (
    <UserPrivateLayout>
      <h1 className="text-3xl font-bold mb-6">
        Pesan Tiket
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow"
      >
        <select
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              gunung_id: e.target.value,
            })
          }
        >
          <option>Pilih Gunung</option>

          {gunungs.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nama}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              tanggal: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="w-full border p-3 rounded mb-4"
          min="1"
          value={form.jumlah_pendaki}
          onChange={(e) =>
            setForm({
              ...form,
              jumlah_pendaki: e.target.value,
            })
          }
        />

        <button className="bg-green-600 text-white px-5 py-2 rounded">
          Pesan
        </button>
      </form>
    </UserPrivateLayout>
  );
}