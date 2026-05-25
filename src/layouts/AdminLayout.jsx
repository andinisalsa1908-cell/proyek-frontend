import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children, role }) => {
  // State untuk mengontrol munculnya modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    // Arahkan ke halaman login saat klik "Ya"
    window.location.href = '/login'; 
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Kirim fungsi pembuka modal ke Sidebar melalui prop onLogout */}
      <Sidebar role={role} onLogout={() => setIsLogoutModalOpen(true)} />
      
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>

      {/* Modal Logout sesuai mockup */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-12 max-w-lg w-full mx-4 shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-black mb-12">
              Apakah anda yakin ingin keluar?
            </h2>
            
            <div className="flex justify-center gap-8">
              {/* Tombol Ya - Oranye Full */}
              <button 
                onClick={handleConfirmLogout}
                className="bg-[#f39c12] hover:bg-[#e67e22] text-white text-3xl font-bold py-4 px-16 rounded-full shadow-lg transition-all active:scale-95"
              >
                Ya
              </button>
              
              {/* Tombol Tidak - Putih Border Oranye */}
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-white border-4 border-[#f39c12] text-[#f39c12] text-3xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-orange-50 transition-all active:scale-95"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;