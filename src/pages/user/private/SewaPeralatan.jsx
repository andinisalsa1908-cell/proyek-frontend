import React, { useState } from 'react';
import Navbar from '../../../components/user/navbar'; // Sesuaikan path folder navbar kamu jika berbeda

export default function SewaPeralatan() {
  const [kategoriAktif, setKategoriAktif] = useState('Semua');
  const [notifikasi, setNotifikasi] = useState(null);
  
  // State untuk modal pop-up ceklis besar di tengah layar
  const [modalSukses, setModalSukses] = useState(null);

  // State untuk menyimpan jumlah kuantitas yang dipilih per alat (id: jumlah)
  const [jumlahMap, setJumlahMap] = useState({});

  // Data alat pendakian berdasarkan daftar harga resmi
  const [alatList] = useState([
    { id: 1, nama: 'Tenda 2 Orang', kategori: 'Tenda', harga: 25000, stok: 10, gambar: 'https://images.unsplash.com/photo-1508873696983-2df5c92091c7?auto=format&fit=crop&w=500&q=80' },
    { id: 2, nama: 'Tenda 4 Orang', kategori: 'Tenda', harga: 30000, stok: 8, gambar: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=500&q=80' },
    { id: 3, nama: 'Flysheet', kategori: 'Tenda', harga: 7000, stok: 15, gambar: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=500&q=80' },
    { id: 4, nama: 'Sleeping Bag', kategori: 'Peralatan Tidur', harga: 12000, stok: 20, gambar: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=500&q=80' },
    { id: 5, nama: 'Matras Spons', kategori: 'Peralatan Tidur', harga: 5000, stok: 25, gambar: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=500&q=80' },
    { id: 6, nama: 'Matras Aluminium Foil', kategori: 'Peralatan Tidur', harga: 7000, stok: 15, gambar: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=500&q=80' },
    { id: 7, nama: 'Bantal Tiup', kategori: 'Peralatan Tidur', harga: 7000, stok: 12, gambar: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=500&q=80' },
    { id: 8, nama: 'Hammock', kategori: 'Peralatan Tidur', harga: 5000, stok: 18, gambar: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=500&q=80' },
    { id: 9, nama: 'Carrier 40–60 Liter', kategori: 'Tas', harga: 25000, stok: 10, gambar: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
    { id: 10, nama: 'Carrier 70–80 Liter', kategori: 'Tas', harga: 30000, stok: 6, gambar: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
    { id: 11, nama: 'Daypack', kategori: 'Tas', harga: 15000, stok: 15, gambar: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=500&q=80' },
    { id: 12, nama: 'Rain Cover Carrier', kategori: 'Tas', harga: 5000, stok: 20, gambar: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
    { id: 13, nama: 'Kompor Portable', kategori: 'Peralatan Memasak', harga: 7000, stok: 12, gambar: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500&q=80' },
    { id: 14, nama: 'Cooking Set / Nesting', kategori: 'Peralatan Memasak', harga: 7000, stok: 15, gambar: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=500&q=80' },
    { id: 15, nama: 'Gas Portable', kategori: 'Peralatan Memasak', harga: 5000, stok: 30, gambar: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500&q=80' },
    { id: 16, nama: 'Teko Outdoor', kategori: 'Peralatan Memasak', harga: 7000, stok: 10, gambar: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=500&q=80' },
    { id: 17, nama: 'Mug Outdoor', kategori: 'Peralatan Memasak', harga: 7000, stok: 20, gambar: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80' },
    { id: 18, nama: 'Headlamp', kategori: 'Penerangan', harga: 5000, stok: 25, gambar: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80' },
    { id: 19, nama: 'Lampu Tenda', kategori: 'Penerangan', harga: 5000, stok: 15, gambar: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=500&q=80' },
    { id: 20, nama: 'Jaket Gunung', kategori: 'Pakaian & Pendakian', harga: 12000, stok: 15, gambar: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80' },
    { id: 21, nama: 'Jas Hujan', kategori: 'Pakaian & Pendakian', harga: 10000, stok: 20, gambar: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=500&q=80' },
    { id: 22, nama: 'Sepatu Hiking', kategori: 'Pakaian & Pendakian', harga: 20000, stok: 10, gambar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { id: 23, nama: 'Sarung Tangan', kategori: 'Pakaian & Pendakian', harga: 7000, stok: 25, gambar: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80' },
    { id: 24, nama: 'Trekking Pole', kategori: 'Keamanan & Keselamatan', harga: 7000, stok: 20, gambar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=500&q=80' },
    { id: 25, nama: 'Emergency Blanket', kategori: 'Keamanan & Keselamatan', harga: 15000, stok: 15, gambar: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=500&q=80' },
    { id: 26, nama: 'P3K Kit', kategori: 'Keamanan & Keselamatan', harga: 10000, stok: 10, gambar: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=500&q=80' },
  ]);

  const [pesananSewa, setPesananSewa] = useState([]);

  const kategoriList = [
    'Semua', 
    'Tenda', 
    'Peralatan Tidur', 
    'Tas', 
    'Peralatan Memasak', 
    'Penerangan', 
    'Pakaian & Pendakian', 
    'Keamanan & Keselamatan'
  ];

  const alatFiltered = kategoriAktif === 'Semua' 
    ? alatList 
    : alatList.filter(item => item.kategori === kategoriAktif);

  const handleUbahJumlah = (id, delta) => {
    setJumlahMap(prev => {
      const current = prev[id] || 1;
      const updated = current + delta;
      return { ...prev, [id]: updated < 1 ? 1 : updated };
    });
  };

  const handleSewa = (alat) => {
    const jumlahPesan = jumlahMap[alat.id] || 1;
    const totalHargaItem = alat.harga * jumlahPesan;

    const pesananBaru = { 
      ...alat, 
      idSewa: Date.now() + Math.random(), 
      jumlah: jumlahPesan, 
      totalHarga: totalHargaItem, 
      status: 'Aktif' 
    };

    setPesananSewa([...pesananSewa, pesananBaru]);
    
    // Munculkan Modal Pop-Up Ceklis Besar di Tengah Layar
    setModalSukses({
      nama: alat.nama,
      jumlah: jumlahPesan
    });
  };

  const handleBatalSewa = (idSewa) => {
    setPesananSewa(pesananSewa.filter(item => item.idSewa !== idSewa));
    setNotifikasi('Pesanan sewa peralatan berhasil dibatalkan.');
    setTimeout(() => setNotifikasi(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      
      {/* Navbar di atas */}
      <Navbar />

      {/* MODAL POP-UP SUKSES CEKLIS BESAR */}
      {modalSukses && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform animate-scale-up">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl font-bold shadow-inner">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Berhasil Disewa!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Kamu berhasil menyewa <span className="font-semibold text-gray-800">{modalSukses.jumlah} {modalSukses.nama}</span>. Silakan cek di riwayat pesanan bawah.
            </p>
            <button
              onClick={() => setModalSukses(null)}
              className="w-full bg-[#244275] hover:bg-[#1a3159] text-white py-3 rounded-xl font-semibold transition shadow-md"
            >
              OK, Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Notifikasi Banner Opsional */}
        {notifikasi && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl shadow-md flex items-center justify-between transition-all">
            <span className="text-sm font-semibold flex items-center gap-2">
              <span className="bg-emerald-600 text-white rounded-full p-0.5 text-xs">✓</span> 
              {notifikasi}
            </span>
            <button onClick={() => setNotifikasi(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-lg">&times;</button>
          </div>
        )}

        {/* Kategori Filter Pills */}
        <div className="bg-white p-4 rounded-2xl shadow-md flex gap-3 overflow-x-auto mb-8 border border-gray-100">
          {kategoriList.map((kat) => (
            <button
              key={kat}
              onClick={() => setKategoriAktif(kat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                kategoriAktif === kat
                  ? 'bg-[#244275] text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Katalog Alat Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {alatFiltered.map((alat) => {
              const qty = jumlahMap[alat.id] || 1;
              return (
                <div key={alat.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col justify-between border border-gray-100 group">
                  <div>
                    <div className="bg-gray-100 h-44 rounded-xl mb-4 overflow-hidden relative">
                      <img src={alat.gambar} alt={alat.nama} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
                        Stok: {alat.stok}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{alat.nama}</h3>
                    <p className="text-xs text-gray-500 mb-2">{alat.kategori}</p>
                    <p className="text-[#244275] font-bold text-lg">
                      Rp {alat.harga.toLocaleString('id-ID')}<span className="text-xs text-gray-500 font-normal">/Hari</span>
                    </p>
                  </div>
                  
                  {/* Kontrol Jumlah & Tombol Sewa */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-600">Jumlah:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <button 
                          onClick={() => handleUbahJumlah(alat.id, -1)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition text-sm"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-sm font-bold text-gray-800 bg-white">{qty}</span>
                        <button 
                          onClick={() => handleUbahJumlah(alat.id, 1)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSewa(alat)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2"
                    >
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daftar Pesanan Sewa Saya (FR-12 & FR-12.1) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-[#244275] mb-4">Pesanan Sewa Saya</h2>
          {pesananSewa.length === 0 ? (
            <p className="text-gray-500 italic py-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Belum ada peralatan yang disewa saat ini.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#244275] text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider rounded-l-lg">Nama Alat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total Harga / Hari</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pesananSewa.map((item) => (
                    <tr key={item.idSewa} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{item.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.kategori}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800">{item.jumlah} Pcs</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#244275] font-bold">Rp {item.totalHarga.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleBatalSewa(item.idSewa)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-lg border border-red-200 transition font-semibold text-xs"
                        >
                          Batalkan Sewa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}