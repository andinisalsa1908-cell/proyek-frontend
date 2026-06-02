import React, {
  useEffect,
  useState,
} from "react";
import {
  getHistory,
} from "../../../services/user";

export default function RiwayatPengajuan() {
  const [history, setHistory] =
    useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setHistory(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Riwayat Pendakian</h2>

      {history.map((item) => (
        <div
          key={item.id}
          className="card p-3 mb-3"
        >
          <h5>{item.gunung?.nama}</h5>

          <p>{item.tanggal_naik}</p>

          <p>{item.status}</p>
        </div>
      ))}
    </div>
  );
}