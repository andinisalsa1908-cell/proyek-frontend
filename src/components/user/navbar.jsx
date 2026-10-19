import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = ({ onLogout }) => {
  const isLogin = localStorage.getItem("token");

  // Gaya menu: teks putih terang, zoom dikit, garis bawah saat aktif/hover
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-white font-bold border-b-2 border-white pb-1 transform scale-105 transition-all"
      : "text-slate-200 hover:text-white hover:scale-105 transition-all";

  return (
    <nav className="bg-[#2a4365] text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold hover:text-slate-200 transition-colors">
          SummitGO
        </Link>

        <div className="flex gap-6 items-center">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/gunung" className={getNavLinkClass}>
            Gunung
          </NavLink>
          <NavLink to="/artikel" className={getNavLinkClass}>
            Artikel
          </NavLink>

          {isLogin ? (
            <>
              <NavLink to="/pesan-tiket" className={getNavLinkClass}>
                Pesan Tiket
              </NavLink>
              <NavLink to="/tiket-saya" className={getNavLinkClass}>
                Tiket Saya
              </NavLink>
              <NavLink to="/profile" className={getNavLinkClass}>
                Profile
              </NavLink>
              <Link
                to="/logout"
                className="bg-white text-[#2a4365] px-4 py-2 rounded font-medium hover:bg-slate-100 transition-all shadow-sm"
              >
                Logout 
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-[#2a4365] px-4 py-2 rounded font-medium hover:bg-slate-100 transition-all shadow-sm"
              >
                Login
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};
export default Navbar;