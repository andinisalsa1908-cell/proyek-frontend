import React, { Activity } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Mountain, 
  ClipboardList, 
  LogOut, 
  Settings, 
  FileText, 
  CheckSquare,
  ActivityIcon
} from 'lucide-react';
import { ImBasecamp } from 'react-icons/im';

// Tambahkan prop onLogout di sini
const Sidebar = ({ role, onLogout }) => {
  const getMenuItems = () => {
    switch (role) {
      case 'super-admin':
        return [
          { name: 'Dashboard', path: '/super-admin', icon: <LayoutDashboard /> },
          { name: 'Kelola Akun', path: '/super-admin/kelola-akun', icon: <Users /> },
          { name: 'Gunung', path: '/super-admin/gunung', icon: <Mountain /> },
          { name: 'Permintaan', path: '/super-admin/permintaan', icon: <ClipboardList /> },
          { name: 'Activity', path: '/super-admin/activity', icon: <ActivityIcon />},
        ];
      case 'admin-gunung':
        return [
          { name: 'Dashboard', path: '/admin-gunung', icon: <LayoutDashboard /> },
          { name: 'Kelola Basecamp', path: '/admin-gunung/kelola-basecamp', icon: <ImBasecamp /> },
          { name: 'Gunung', path: '/admin-gunung/gunung', icon: <Mountain /> },
          { name: 'Pengajuan', path: '/admin-gunung/pengajuan', icon: <ClipboardList /> },
          { name: 'Laporan', path: '/admin-gunung/laporan', icon: <FileText />},
        ];
      case 'admin-basecamp':
        return [
          { name: 'Dashboard', path: '/admin-basecamp', icon: <LayoutDashboard /> },
          { name: 'Kelola Pendaki', path: '/admin-basecamp/pendaki', icon: <Users /> },
          { name: 'Validasi Tiket', path: '/admin-basecamp/validasi', icon: <CheckSquare /> },
          { name: 'Laporan', path: '/admin-basecamp/laporan', icon: <FileText /> },
          { name: 'Pengaturan Kuota', path: '/admin-basecamp/kuota', icon: <Settings /> },
        ];
      default: return [];
    }
  };

  return (
    <div className="w-64 h-screen bg-[#24426d] text-white flex flex-col p-6 fixed shadow-2xl">
      <div className="mb-10 font-bold text-xl uppercase tracking-widest text-center italic border-b border-white/20 pb-4">
        Summit-GO
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {getMenuItems().map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                end={item.path === '/super-admin' || item.path === '/admin-basecamp' || item.path === '/admin-gunung'}
                className={({ isActive }) => 
                  `flex items-center gap-3 p-3 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-white text-[#24426d] shadow-lg translate-x-2' : 'hover:bg-[#325a91]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-[#24426d]' : 'text-white'}>
                      {React.cloneElement(item.icon, { size: 20 })}
                    </span>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tambahkan onClick={onLogout} agar modal konfirmasi muncul */}
      <button 
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 p-3 text-red-300 hover:text-red-500 font-bold transition-colors border-t border-white/20 pt-4"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;