import React, { useCallback, useEffect, useState } from "react";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";
import {
  User,
  Edit3,
  Lock,
  FileText,
  Info,
  ShieldCheck,
  FileLock,
  ChevronRight,
  ArrowLeft,
  Mountain,
  Ticket,
  Calendar,
  CheckCircle2,
  Camera,
  Check,
  ShoppingBag,
  Compass,
  Tag,
  Target,
  ListChecks,
} from "lucide-react";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadFoto,
} from "../../../services/user/userService";
import { getBookings } from "../../../services/user/tiketService";

const extractItem = (res) => res?.data?.data || res?.data?.user || res?.data || null;
const extractList = (res) => res?.data?.data?.data || res?.data?.data || res?.data || [];

const resolveAvatar = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  try {
    const origin = new URL(process.env.REACT_APP_API_URL || "").origin;
    return `${origin}/storage/${String(value).replace(/^\/+/, "")}`;
  } catch {
    return value;
  }
};

const formatTanggal = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [bookings, setBookings] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentView, setCurrentView] = useState("main");

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    avatarFile: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const res = await getProfile();
      const data = extractItem(res) || {};
      const mapped = {
        name: data.name || data.nama || "",
        email: data.email || "",
        phone: data.phone || data.no_hp || data.telepon || "",
        avatar: resolveAvatar(data.avatar || data.foto || data.photo || ""),
      };
      setProfile(mapped);
      setEditForm({ ...mapped, avatarFile: null });
      try {
        localStorage.setItem("user", JSON.stringify({ ...(JSON.parse(localStorage.getItem("user") || "{}")), ...mapped }));
      } catch {}
    } catch (err) {
      console.log("ERROR PROFILE:", err.response?.data || err);
      // fallback ke localStorage bila API gagal
      try {
        const local = JSON.parse(localStorage.getItem("user") || "null");
        if (local) {
          const mapped = {
            name: local.name || local.nama || "",
            email: local.email || "",
            phone: local.phone || local.no_hp || local.telepon || "",
            avatar: resolveAvatar(local.avatar || local.foto || local.photo || ""),
          };
          setProfile(mapped);
          setEditForm({ ...mapped, avatarFile: null });
        }
      } catch {}
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      setLoadingBookings(true);
      const res = await getBookings();
      const list = extractList(res);
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log("ERROR PROFILE BOOKINGS:", err.response?.data || err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (currentView === "riwayat") {
      loadBookings();
    }
  }, [currentView, loadBookings]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, avatar: reader.result, avatarFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setSaving(true);
      const payload = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      };

      await updateProfile(payload);

      if (editForm.avatarFile) {
        const formData = new FormData();
        formData.append("foto", editForm.avatarFile);
        formData.append("avatar", editForm.avatarFile);
        try {
          await uploadFoto(formData);
        } catch (err) {
          console.log("ERROR UPLOAD FOTO:", err.response?.data || err);
        }
      }

      await loadProfile();
      setModalMessage("Profil berhasil diperbarui!");
    } catch (err) {
      console.log("ERROR UPDATE PROFILE:", err.response?.data || err);
      setErrorMessage(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setErrorMessage("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    try {
      setSaving(true);
      await changePassword(passwordForm);
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setModalMessage("Kata sandi berhasil diubah!");
    } catch (err) {
      console.log("ERROR CHANGE PASSWORD:", err.response?.data || err);
      setErrorMessage(err.response?.data?.message || "Gagal mengubah kata sandi.");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setModalMessage("");
    setErrorMessage("");
    setCurrentView("main");
  };

  const renderDynamicContent = () => {
    switch (currentView) {
      case "ubah-profil":
        return {
          title: "Ubah Profil",
          subtitle: "Perbarui informasi akun Anda",
          icon: <Edit3 className="w-8 h-8 text-[#244275]" />,
          content: (
            <form onSubmit={handleUpdateProfileSubmit} className="space-y-6 max-w-2xl">
              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden border-2 border-slate-200 shadow-inner">
                  {editForm.avatar ? (
                    <img src={editForm.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center space-x-2 transition">
                    <Camera className="w-4 h-4 text-[#244275]" />
                    <span>Pilih Foto Baru</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                  <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG (Maks. 2MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">No. Telepon</label>
                <input
                  type="text"
                  value={editForm.phone || ""}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#244275] text-white font-medium hover:bg-blue-950 transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setCurrentView("main");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          ),
        };

      case "kata-sandi":
        return {
          title: "Ubah Kata Sandi",
          subtitle: "Pastikan akun Anda menggunakan kata sandi yang aman",
          icon: <Lock className="w-8 h-8 text-[#244275]" />,
          content: (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-2xl">
              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, current_password: e.target.value })
                  }
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={passwordForm.password_confirmation}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })
                  }
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#244275]"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#244275] text-white font-medium hover:bg-blue-950 transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Memperbarui..." : "Perbarui Kata Sandi"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setCurrentView("main");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          ),
        };

      case "riwayat":
        return {
          title: "Riwayat Pendakian",
          subtitle: "Data diambil dari riwayat pemesanan tiket Anda",
          icon: <FileText className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-4">
              {loadingBookings ? (
                <div className="text-slate-500 text-sm">Memuat riwayat...</div>
              ) : bookings.length === 0 ? (
                <div className="text-slate-500 text-sm italic">Belum ada riwayat pendakian/pemesanan.</div>
              ) : (
                bookings.map((item, idx) => {
                  const gunungNama =
                    item.gunung?.nama || item.gunung_nama || item.nama_gunung ||
                    (typeof item.gunung === "string" ? item.gunung : "Gunung");
                  const tanggal = formatTanggal(item.tanggal_naik || item.tanggal || item.created_at);
                  const status = String(item.status || "-");
                  return (
                    <div
                      key={item.id ?? idx}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-base">{gunungNama}</span>
                          <span className="bg-blue-50 text-[#244275] text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
                            {status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" /> {tanggal}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Kode Booking</span>
                        <span className="font-mono text-sm font-semibold text-slate-700">
                          {item.kode_booking || item.booking_code || `#${item.id || "-"}`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ),
        };

      case "tentang":
        return {
          title: "Tentang Website",
          subtitle: "Kenali lebih dekat platform SummitGo",
          icon: <Info className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-7 text-slate-600 leading-relaxed">
              <div>
                <p className="text-lg font-semibold text-[#244275] mb-2">Selamat Datang di SummitGo!</p>
                <p className="mb-3">
                  <strong>SummitGo</strong> merupakan platform digital yang dikembangkan untuk mempermudah pengguna
                  dalam mengakses informasi dan layanan pendakian gunung.
                </p>
                <p>
                  SummitGo hadir sebagai solusi digital untuk membantu pendaki dalam merencanakan kegiatan
                  pendakian agar lebih mudah, praktis, dan terorganisir.
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Fitur Utama SummitGo</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <Mountain className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Informasi Gunung</h4>
                    <p className="text-xs text-slate-600">Informasi gunung, jalur, kuota, dan jadwal pendakian.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <Ticket className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Pemesanan Tiket</h4>
                    <p className="text-xs text-slate-600">Pemesanan tiket pendakian secara digital.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <ShoppingBag className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Penyewaan Peralatan</h4>
                    <p className="text-xs text-slate-600">Informasi dan layanan penyewaan peralatan pendakian.</p>
                  </div>
                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100">
                    <Compass className="w-6 h-6 text-[#244275] mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Panduan & Artikel</h4>
                    <p className="text-xs text-slate-600">Tips dan informasi untuk persiapan pendakian.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        };

      case "syarat":
        return {
          title: "Syarat & Ketentuan",
          subtitle: "Ketentuan penggunaan layanan SummitGo",
          icon: <ShieldCheck className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>Dengan menggunakan SummitGo, pengguna setuju untuk mematuhi ketentuan layanan yang berlaku.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pengguna wajib memberikan data yang benar saat pendaftaran dan pemesanan.</li>
                <li>Pemesanan tiket mengikuti ketersediaan kuota dan ketentuan pengelola.</li>
                <li>Penyewaan peralatan mengikuti ketersediaan stok dan ketentuan yang berlaku.</li>
                <li>Pengguna bertanggung jawab atas keamanan akun masing-masing.</li>
              </ul>
            </div>
          ),
        };

      case "privasi":
        return {
          title: "Kebijakan Privasi",
          subtitle: "Bagaimana SummitGo mengelola informasi pengguna",
          icon: <FileLock className="w-8 h-8 text-[#244275]" />,
          content: (
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>SummitGo mengelola informasi pengguna untuk mendukung layanan pemesanan dan pengelolaan akun.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Data akun digunakan untuk autentikasi dan pengelolaan profil.</li>
                <li>Data pemesanan/penyewaan digunakan untuk proses layanan.</li>
                <li>Pengguna dapat memperbarui informasi profil melalui halaman ini.</li>
              </ul>
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-center mt-4">
                <p className="text-xs font-semibold text-[#244275]">Komitmen SummitGo</p>
                <p className="text-xs text-slate-600 mt-0.5">Kami berupaya menjaga informasi pengguna dengan aman.</p>
              </div>
            </div>
          ),
        };

      default:
        return null;
    }
  };

  const dynamic = renderDynamicContent();

  return (
    <UserPrivateLayout>
      <div className="min-h-screen bg-slate-50 py-10 pb-16 relative">
        {modalMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center border border-slate-100">
              <div className="w-16 h-16 bg-blue-50 text-[#244275] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Berhasil!</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{modalMessage}</p>
              <button
                onClick={handleCloseModal}
                className="w-full py-3 px-6 rounded-xl bg-[#244275] text-white font-semibold hover:bg-blue-950 transition shadow-md cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {currentView !== "main" && dynamic ? (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-5">
              <button
                onClick={() => {
                  setErrorMessage("");
                  setCurrentView("main");
                }}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-[#244275] hover:text-blue-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Profil</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-100">
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-3 bg-blue-50 rounded-2xl">{dynamic.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{dynamic.title}</h1>
                  <p className="text-sm text-slate-500 mt-1">{dynamic.subtitle}</p>
                </div>
              </div>
              <div className="border-b border-slate-100 mb-6" />
              <div>{dynamic.content}</div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex items-center space-x-6 border border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden shadow-inner border border-slate-200">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {loadingProfile ? "Memuat profil..." : profile.name || "Nama Pengguna"}
                </h2>
                <p className="text-slate-500 text-sm">{profile.email || "-"}</p>
                {profile.phone ? <p className="text-slate-400 text-xs mt-1">{profile.phone}</p> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-base font-bold text-[#244275] mb-4">Pengaturan akun</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setErrorMessage("");
                      setEditForm({ ...profile, avatarFile: null });
                      setCurrentView("ubah-profil");
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <Edit3 className="w-5 h-5 text-[#244275]" />
                      <span>Ubah Profil</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setErrorMessage("");
                      setCurrentView("kata-sandi");
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-[#244275]" />
                      <span>Kata Sandi</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setErrorMessage("");
                      setCurrentView("riwayat");
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-[#244275]" />
                      <span>Riwayat Pendakian</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-base font-bold text-[#244275] mb-4">Seputar Website</h3>
                <div className="space-y-3">
                  {[
                    ["tentang", Info, "Tentang Website"],
                    ["syarat", ShieldCheck, "Syarat & Ketentuan"],
                    ["privasi", FileLock, "Kebijakan Privasi"],
                  ].map(([view, Icon, label]) => (
                    <button
                      key={view}
                      onClick={() => {
                        setErrorMessage("");
                        setCurrentView(view);
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-700 font-medium transition shadow-sm cursor-pointer"
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-[#244275]" />
                        <span>{label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserPrivateLayout>
  );
}
