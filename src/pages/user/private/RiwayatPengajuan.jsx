import { useEffect, useState } from "react";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import { getPengajuan } from "../../../services/user/pengajuanService";

export default function RiwayatPengajuan() {
  const [pengajuan, setPengajuan] = useState([]);

  useEffect(() => {
    loadPengajuan();
  }, []);

  const loadPengajuan = async () => {
    try {
      const res = await getPengajuan();
      setPengajuan(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserPrivateLayout>
      <h1 className="text-3xl font-bold mb-6">
        Riwayat Pengajuan
      </h1>

      <div className="space-y-4">
        {pengajuan.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h2 className="font-bold">
              {item.nama_gunung}
            </h2>

            <p>{item.lokasi}</p>

            <p>Status : {item.status}</p>
          </div>
        ))}
      </div>
    </UserPrivateLayout>
  );
}