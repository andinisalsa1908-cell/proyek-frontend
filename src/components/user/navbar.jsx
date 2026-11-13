import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { logout } from "../../services/auth/authService";

const Navbar = ({ onLogout }) => {
  const isLogin = !!localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  const getNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-lg md:px-0 md:py-0 md:rounded-none transition-all ${
      isActive
        ? "text-white font-extrabold md:border-b-2 md:border-white md:pb-1 bg-white/10 md:bg-transparent"
        : "text-blue-100/90 hover:text-white hover:bg-white/10 md:hover:bg-transparent"
    }`;

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log("ERROR LOGOUT:", err.response?.data || err);
      localStorage.clear();
    } finally {
      if (typeof onLogout === "function") onLogout();
      closeMenu();
      navigate("/login", { replace: true });
    }
  };

  const navLinks = isLogin
    ? [
        { to: "/", label: "Home" },
        { to: "/gunung", label: "Gunung" },
        { to: "/riwayat", label: "Riwayat" },
        { to: "/daftar-admin-gunung", label: "Daftar Admin Gunung" },
        { to: "/profile", label: "Profil" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/gunung", label: "Gunung" },
      ];

  return (
    <nav
      className={`text-white transition-all duration-300 relative z-30 ${
        isHomePage
          ? `${isOpen ? "bg-[#244275] md:bg-transparent" : "bg-transparent"} -mb-24 pt-2 md:pt-4`
          : "bg-[#244275] shadow py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 md:h-20 flex justify-between items-center">
          {/* LOGO */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="Logo SummitGo"
              className="h-12 md:h-20 w-auto object-contain transition-all"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="sr-only">SummitGo</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 items-center text-sm lg:text-base font-medium">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={getNavLinkClass} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}

            {isLogin ? (
              <button
                type="button"
                onClick={handleLogout}
                className="border border-white/40 hover:bg-white/10 text-white font-semibold px-4 py-2 rounded-full transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold px-5 py-2 rounded-full transition-all shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* HAMBURGER BUTTON */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div
            className={`md:hidden pb-4 pt-2 ${
              isHomePage ? "bg-[#244275] px-1" : ""
            }`}
          >
            <div className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={getNavLinkClass}
                  end={item.to === "/"}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-2 mt-1 border-t border-white/10">
                {isLogin ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-center px-3 py-2.5 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block text-center bg-[#f3e03b] hover:bg-yellow-400 text-[#244275] font-extrabold px-5 py-2.5 rounded-full transition-all shadow-sm"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;