import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";

// ================= USER =================

// Auth
import ForgotPassword from "./pages/ForgotPassword";

// Public
import Home from "./pages/user/public/Home";
import Artikel from "./pages/user/public/Artikel";
import DetailArtikel from "./pages/user/public/DetailArtikel";
import DaftarGunung from "./pages/user/public/DaftarGunung";
import DetailGunung from "./pages/user/public/DetailGunung";

// Private
import PesanTiket from "./pages/user/private/PesanTiket";
import TiketSaya from "./pages/user/private/TiketSaya";
import PengajuanGunung from "./pages/user/private/PengajuanGunung";
import RiwayatPengajuan from "./pages/user/private/RiwayatPengajuan";
import Profile from "./pages/user/private/Profile";

/* INI YANG DIGANTI */
import ProtectedRoute from "./services/auth/protectedRoute";

// ================= SUPER ADMIN =================
import SuperAdminDash from "./pages/super-admin/Dashboard";
import KelolaAkun from "./pages/super-admin/KelolaAkun";
import Gunung from "./pages/super-admin/Gunung";
import Permintaan from "./pages/super-admin/Permintaan";
import Activity from "./pages/super-admin/ActivityLog";

// ================= ADMIN BASECAMP =================
import AdminBasecampDash from "./pages/admin-basecamp/Dashboard";
import KelolaPendaki from "./pages/admin-basecamp/KelolaPendaki";
import ValidasiTiket from "./pages/admin-basecamp/ValidasiTiket";
import LaporanPendaki from "./pages/admin-basecamp/LaporanPendaki";
import PengaturanKuotaJalur from "./pages/admin-basecamp/PengaturanKuotaJalur";

// ================= ADMIN GUNUNG =================
import AdminGunungDash from "./pages/admin-gunung/Dashboard";
import KelolaDataGunung from "./pages/admin-gunung/KelolaDataGunung";
import KelolaBasecampGunung from "./pages/admin-gunung/KelolaBasecamp";
import PengajuanAdminBasecamp from "./pages/admin-gunung/Pengajuan";
import LaporanAdminGunung from "./pages/admin-gunung/LaporanAdminGunung";

function App() {
  return (
    <Router>
      <Routes>
        {/* USER PUBLIC }
        <Route path="/" element={<Home />} />
        <Route path="/gunung" element={<DaftarGunung />} />
        <Route path="/gunung/:id" element={<DetailGunung />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/artikel/:id" element={<DetailArtikel />} />

        {/* USER AUTH }
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER PRIVATE }
        <Route
          path="/pesan-tiket"
          element={
            <ProtectedRoute>
              <PesanTiket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tiket-saya"
          element={
            <ProtectedRoute>
              <TiketSaya />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pengajuan-gunung"
          element={
            <ProtectedRoute>
              <PengajuanGunung />
            </ProtectedRoute>
          }
        />

        <Route
          path="/riwayat-pengajuan"
          element={
            <ProtectedRoute>
              <RiwayatPengajuan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        /> */}

        {/* ADMIN LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* SUPER ADMIN */}
        <Route path="/super-admin" element={<AdminLayout role="super-admin"><SuperAdminDash /></AdminLayout>} />
        <Route path="/super-admin/kelola-akun" element={<AdminLayout role="super-admin"><KelolaAkun /></AdminLayout>} />
        <Route path="/super-admin/gunung" element={<AdminLayout role="super-admin"><Gunung /></AdminLayout>} />
        <Route path="/super-admin/permintaan" element={<AdminLayout role="super-admin"><Permintaan /></AdminLayout>} />
        <Route path="/super-admin/activity" element={<AdminLayout role="super-admin"><Activity /></AdminLayout>} />

        {/* ADMIN BASECAMP */}
        <Route path="/admin-basecamp" element={<AdminLayout role="admin-basecamp"><AdminBasecampDash /></AdminLayout>} />
        <Route path="/admin-basecamp/pendaki" element={<AdminLayout role="admin-basecamp"><KelolaPendaki /></AdminLayout>} />
        <Route path="/admin-basecamp/validasi" element={<AdminLayout role="admin-basecamp"><ValidasiTiket /></AdminLayout>} />
        <Route path="/admin-basecamp/laporan" element={<AdminLayout role="admin-basecamp"><LaporanPendaki /></AdminLayout>} />
        <Route path="/admin-basecamp/kuota" element={<AdminLayout role="admin-basecamp"><PengaturanKuotaJalur /></AdminLayout>} />

        {/* ADMIN GUNUNG */}
        <Route path="/admin-gunung" element={<AdminLayout role="admin-gunung"><AdminGunungDash /></AdminLayout>} />
        <Route path="/admin-gunung/gunung" element={<AdminLayout role="admin-gunung"><KelolaDataGunung /></AdminLayout>} />
        <Route path="/admin-gunung/kelola-basecamp" element={<AdminLayout role="admin-gunung"><KelolaBasecampGunung /></AdminLayout>} />
        <Route path="/admin-gunung/pengajuan" element={<AdminLayout role="admin-gunung"><PengajuanAdminBasecamp /></AdminLayout>} />
        <Route path="/admin-gunung/laporan" element={<AdminLayout role="admin-gunung"><LaporanAdminGunung /></AdminLayout>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;