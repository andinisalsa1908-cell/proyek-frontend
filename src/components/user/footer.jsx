const Footer = () => {
  return (
    <footer className="bg-gray-900 text-slate-300 pt-10 pb-6 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        
        {/* Kolom 1: SummitGo */}
        <div>
          <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-1">
            SummitGo<span className="text-yellow-400">.</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
            Platform nasional terintegrasi untuk pengelolaan pemagangan pendidikan vokasi di Indonesia.
          </p>
        </div>

        {/* Kolom 2: Program */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Program</h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Magang Dalam Negeri</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Magang Luar Negeri</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sertifikasi Kompetensi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pelatihan Industri</a></li>
          </ul>
        </div>

        {/* Kolom 3: Bantuan */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Bantuan</h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Kontak Kami</a></li>
          </ul>
        </div>

        {/* Kolom 4: Hubungi Kami */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Hubungi Kami</h4>
          <div className="flex gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs text-slate-300 hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
              🌐
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs text-slate-300 hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
              ✉️
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs text-slate-300 hover:bg-yellow-400 hover:text-gray-900 transition-all cursor-pointer">
              📞
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Indramayu, Indonesia</p>
        </div>

      </div>

      {/* Garis Pembatas & Copyright */}
      <div className="max-w-6xl mx-auto border-t border-gray-800 pt-6 text-center">
        <p className="text-[11px] text-slate-400 mb-2">
          &copy; 2026 SummitGo Platform. Hak Cipta Dilindungi.
        </p>
        <div className="flex justify-center gap-6 text-[11px] text-slate-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;