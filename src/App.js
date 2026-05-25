import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';

// Import Pages (Super Admin)
import SuperAdminDash from './pages/super-admin/Dashboard';
import KelolaAkun from './pages/super-admin/KelolaAkun';
import Gunung from './pages/super-admin/Gunung';
import Permintaan from './pages/super-admin/Permintaan';
import Activity from './pages/super-admin/ActivityLog';

// Import Pages (Admin Basecamp)
import AdminBasecampDash from './pages/admin-basecamp/Dashboard';
import KelolaPendaki from './pages/admin-basecamp/KelolaPendaki';
import ValidasiTiket from './pages/admin-basecamp/ValidasiTiket';
import LaporanPendaki from './pages/admin-basecamp/LaporanPendaki';
import PengaturanKuotaJalur from './pages/admin-basecamp/PengaturanKuotaJalur';

// Import Pages (Admin Gunung)
import AdminGunungDash from './pages/admin-gunung/Dashboard';
import KelolaDataGunung from './pages/admin-gunung/KelolaDataGunung';
import KelolaBasecampGunung from './pages/admin-gunung/KelolaBasecamp';
import PengajuanAdminBasecamp from './pages/admin-gunung/Pengajuan';
import LaporanAdminGunung from './pages/admin-gunung/LaporanAdminGunung';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Halaman Login: Berdiri sendiri (Tanpa AdminLayout) */}
        <Route path="/login" element={<Login />} />

        {/* 2. Rute Super Admin: Dibungkus AdminLayout dengan role 'super-admin' */}
        <Route path="/super-admin" element={<AdminLayout role="super-admin"><SuperAdminDash /></AdminLayout>} />
        <Route path="/super-admin/kelola-akun" element={<AdminLayout role="super-admin"><KelolaAkun /></AdminLayout>} />
        <Route path="/super-admin/gunung" element={<AdminLayout role="super-admin"><Gunung /></AdminLayout>} />
        <Route path="/super-admin/permintaan" element={<AdminLayout role="super-admin"><Permintaan /></AdminLayout>} />
        <Route path="/super-admin/activity" element={<AdminLayout role="super-admin"><Activity /></AdminLayout>} />

        {/* 3. Rute Admin Basecamp: Dibungkus AdminLayout dengan role 'admin-basecamp' */}
        <Route path="/admin-basecamp" element={<AdminLayout role="admin-basecamp"><AdminBasecampDash /></AdminLayout>} />
        <Route path="/admin-basecamp/pendaki" element={<AdminLayout role="admin-basecamp"><KelolaPendaki /></AdminLayout>} />
        <Route path="/admin-basecamp/validasi" element={<AdminLayout role="admin-basecamp"><ValidasiTiket /></AdminLayout>} />
        <Route path="/admin-basecamp/laporan" element={<AdminLayout role="admin-basecamp"><LaporanPendaki /></AdminLayout>} />
        <Route path="/admin-basecamp/kuota" element={<AdminLayout role="admin-basecamp"><PengaturanKuotaJalur /></AdminLayout>} />

        {/* 4. Rute Admin Gunung: Dibungkus AdminLayout dengan role 'admin-gunung' */}
        <Route path="/admin-gunung" element={<AdminLayout role="admin-gunung"><AdminGunungDash /></AdminLayout>} />
        <Route path="/admin-gunung/kelola-basecamp" element={<AdminLayout role="admin-gunung"><KelolaBasecampGunung /></AdminLayout>} />
        <Route path="/admin-gunung/gunung" element={<AdminLayout role="admin-gunung"><KelolaDataGunung /></AdminLayout>} />
        <Route path="/admin-gunung/pengajuan" element={<AdminLayout role="admin-gunung"><PengajuanAdminBasecamp /></AdminLayout>} />
        <Route path="/admin-gunung/laporan" element={<AdminLayout role="admin-gunung"><LaporanAdminGunung /></AdminLayout>} />

        {/* 5. Pengalihan Rute: Jika URL tidak dikenal, lempar ke Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;