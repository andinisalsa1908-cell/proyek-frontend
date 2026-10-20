import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const isLogin = localStorage.getItem("token");
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-white font-extrabold border-b-2 border-white pb-1 tracking-wide transition-all transform scale-105"
      : "text-blue-100/80 hover:text-white hover:scale-105 transition-all";

  return (
    <nav
      className={`text-white transition-all duration-300 relative z-20 ${
        isHomePage ? "bg-transparent -mb-24 pt-4" : "bg-[#244275] shadow py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Logo SummitGo" 
            className="h-16 md:h-20 w-auto object-contain transition-all" 
            onError={(e) => { 
              e.target.style.display = 'none'; 
            }} 
          />
        </Link>

        {/* MENU NAVIGASI (Tanpa Artikel) */}
        <div className="flex gap-6 items-center text-sm md:text-base font-medium">
          <NavLink to="/" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/gunung" className={getNavLinkClass}>
            Gunung
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
              
              <Link to="/logout" className="text-blue-100/80 hover:text-white transition-all">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold px-5 py-2 rounded-full transition-all shadow-sm"
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