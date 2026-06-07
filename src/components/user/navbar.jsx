import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = ({ onLogout }) => {
  const isLogin = localStorage.getItem("token");

  return (
    <nav className="bg-green-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold">
          SummitGO
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/">Home</Link>
          <Link to="/gunung">Gunung</Link>
          <Link to="/artikel">Artikel</Link>

          {isLogin ? (
            <>
              <Link to="/pesan-tiket">Pesan Tiket</Link>
              <Link to="/tiket-saya">Tiket Saya</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/logout"
                className="bg-white text-green-700 px-4 py-2 rounded"
              >
                Logout 
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-green-700 px-4 py-2 rounded"
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