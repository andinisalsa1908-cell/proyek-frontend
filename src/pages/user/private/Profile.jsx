import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../services/user/userService";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "", // Menambahkan field tambahan agar seimbang dengan layout web
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      // Pastikan data fallback aman jika API mengembalikan objek kosong/berbeda
      setProfile({
        name: res.data?.name || "",
        email: res.data?.email || "",
        phone: res.data?.phone || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      alert("Profile berhasil diupdate");
    } catch (err) {
      alert("Gagal update profile");
    }
  };

  return (
    <UserPrivateLayout>
      {/* HEADER BANNER - Bergaya Gradasi Biru SummitGo */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 rounded-2xl h-44 flex items-end p-6 mb-6 overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 opacity-10 translate-x-10 -translate-y-10">
          <div className="w-56 h-56 rounded-full bg-white"></div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Profil Pengguna
        </h1>
      </div>

      {/* OVERLAP USER CARD */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Ringkasan Profil Utama */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
            {/* SVG Icon User */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800">{profile.name || "Nama Pengguna"}</h2>
            <p className="text-slate-500">{profile.email || "email@domain.com"}</p>
          </div>
        </div>

        {/* GRID LAYOUT - Membagi Pengaturan menjadi 2 Kolom di Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* KOLOM KIRI: FORM PENGATURAN AKUN (7/12 Ruang) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700">Pengaturan Akun / Ubah Profil</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Input Nama */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama..."
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl transition-all outline-none"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                {/* Input Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Alamat Email</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl transition-all outline-none"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                {/* Input Tambahan: Telepon (Opsional untuk estetika dashboard) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">No. Telepon</label>
                  <input
                    type="text"
                    placeholder="08xxxxxxxxxx"
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 rounded-xl transition-all outline-none"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                {/* Tombol Simpan */}
                <div className="pt-2">
                  <button className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-800/10">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: SEPUTAR APLIKASI & MENU NAVIGASI LAIN (5/12 Ruang) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Box Sub-Menu Seputar Aplikasi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700">Seputar Aplikasi</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {/* Tentang Aplikasi */}
                <button type="button" className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">ℹ️</span>
                    <span className="font-medium text-slate-700 text-sm">Tentang Aplikasi</span>
                  </div>
                  <span className="text-slate-300 group-hover:translate-x-1 group-hover:text-slate-400 transition-all text-sm">➔</span>
                </button>

                {/* Kebijakan Privasi */}
                <button type="button" className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">🛡️</span>
                    <span className="font-medium text-slate-700 text-sm">Kebijakan Privasi</span>
                  </div>
                  <span className="text-slate-300 group-hover:translate-x-1 group-hover:text-slate-400 transition-all text-sm">➔</span>
                </button>

                {/* Tema */}
                <button type="button" className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">🎨</span>
                    <span className="font-medium text-slate-700 text-sm">Tema</span>
                  </div>
                  <span className="text-slate-300 group-hover:translate-x-1 group-hover:text-slate-400 transition-all text-sm">➔</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </UserPrivateLayout>
  );
}