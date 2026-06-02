import React, { useState } from "react";

export default function PengajuanGunung() {
  const [namaGunung, setNamaGunung] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pengajuan berhasil dikirim");
  };

  return (
    <div className="container mt-4">
      <h2>Pengajuan Gunung Baru</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Nama Gunung"
          value={namaGunung}
          onChange={(e) => setNamaGunung(e.target.value)}
        />

        <button className="btn btn-primary">
          Kirim Pengajuan
        </button>
      </form>
    </div>
  );
}