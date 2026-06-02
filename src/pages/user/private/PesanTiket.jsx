import React, { useEffect, useState } from "react";
import {
  getGunungs,
  createBooking,
} from "../../../services/user";

export default function PesanTiket() {
  const [gunungs, setGunungs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    gunung_id: "",
    tanggal_naik: "",
    jumlah_pendaki: 1,
  });

  useEffect(() => {
    fetchGunungs();
  }, []);

  const fetchGunungs = async () => {
    try {
      const res = await getGunungs();
      setGunungs(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createBooking(form);

      alert("Booking berhasil dibuat");

      setForm({
        gunung_id: "",
        tanggal_naik: "",
        jumlah_pendaki: 1,
      });
    } catch (error) {
      console.log(error);
      alert("Booking gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Pesan Tiket</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Gunung</label>
          <select
            className="form-control"
            name="gunung_id"
            value={form.gunung_id}
            onChange={handleChange}
          >
            <option value="">Pilih Gunung</option>

            {gunungs.map((gunung) => (
              <option
                key={gunung.id}
                value={gunung.id}
              >
                {gunung.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Tanggal Naik</label>
          <input
            type="date"
            className="form-control"
            name="tanggal_naik"
            value={form.tanggal_naik}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Jumlah Pendaki</label>
          <input
            type="number"
            min="1"
            className="form-control"
            name="jumlah_pendaki"
            value={form.jumlah_pendaki}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Pesan Tiket"}
        </button>
      </form>
    </div>
  );
}