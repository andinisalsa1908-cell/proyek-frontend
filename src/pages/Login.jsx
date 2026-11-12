import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login, register } from "../services/auth/authService";

const MOUNTAIN_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.33-2.04 3.05l3.3 2.56c1.93-1.78 3.04-4.4 3.04-7.51 0-.72-.06-1.42-.19-2.09H12z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.3-2.56c-.91.61-2.08.98-3.33.98-2.56 0-4.73-1.73-5.5-4.05H3.09v2.64A9.997 9.997 0 0 0 12 22z"
    />
    <path
      fill="#4A90E2"
      d="M6.5 13.93A6.01 6.01 0 0 1 6.19 12c0-.67.11-1.31.31-1.93V7.43H3.09A9.997 9.997 0 0 0 2 12c0 1.61.39 3.14 1.09 4.57l3.41-2.64z"
    />
    <path
      fill="#FBBC05"
      d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.99 14.69 2 12 2a9.997 9.997 0 0 0-8.91 5.43l3.41 2.64c.77-2.32 2.94-4.09 5.5-4.09z"
    />
  </svg>
);

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [nama, setNama] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const apiOrigin = useMemo(() => {
    const base = process.env.REACT_APP_API_URL || "";
    try {
      return new URL(base).origin;
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      alert(error);
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      if (userParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem("user", JSON.stringify(decoded));
          redirectByRole(decoded);
          return;
        } catch {
          // lanjut ambil profil via API jika tersedia
        }
      }

      // fallback: coba ambil profil user dari token
      (async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          const user = data?.data || data?.user || data;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            redirectByRole(user);
            return;
          }
        } catch {
          // abaikan
        }
        navigate("/", { replace: true });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const redirectByRole = (user) => {
    let role = user?.role;
    if (!role && user?.roles?.length > 0) {
      role = user.roles[0].name || user.roles[0];
    }

    const roleRoutes = {
      super_admin: "/super-admin",
      admin_basecamp: "/admin-basecamp",
      admin_gunung: "/admin-gunung",
      user: "/",
    };

    if (!role) {
      navigate("/", { replace: true });
      return;
    }

    navigate(roleRoutes[role] || "/", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await login({ email, password });
      const user = res.user || res;

      let role = user?.role;
      if (!role && user?.roles?.length > 0) {
        role = user.roles[0].name || user.roles[0];
      }

      if (!role) {
        alert("Role tidak ditemukan!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      redirectByRole(user);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Login gagal!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await register({
        name: nama,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert("Register berhasil, silakan login!");
      setIsLoginMode(true);
      setNama("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Register gagal!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!apiOrigin) {
      alert("Konfigurasi API tidak ditemukan.");
      return;
    }
    window.location.href = `${apiOrigin}/auth/google/redirect`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[680px]">
        {/* KIRI: FOTO GUNUNG */}
        <div className="relative hidden lg:block">
          <img
            src={MOUNTAIN_IMAGE}
            alt="Pemandangan gunung"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2749]/90 via-[#244275]/60 to-[#244275]/20" />
          <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="text-3xl font-black italic tracking-tight">
                  SummitGo
                </span>
              </Link>
              <p className="mt-3 text-blue-100/90 max-w-sm text-sm leading-relaxed">
                Temukan informasi gunung, pesan tiket pendakian, dan kelola
                petualanganmu dalam satu platform.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 max-w-sm">
                <p className="text-sm font-semibold text-white">
                  Jelajahi gunung favoritmu
                </p>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Informasi jalur, kuota, pemesanan tiket, dan layanan pendakian
                  yang terintegrasi untuk para pendaki.
                </p>
              </div>
              <p className="text-xs text-blue-100/70">
                © {new Date().getFullYear()} SummitGo
              </p>
            </div>
          </div>
        </div>

        {/* KANAN: FORM */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="lg:hidden mb-4">
                <Link to="/" className="text-2xl font-black italic text-[#244275]">
                  SummitGo
                </Link>
              </div>
              <p className="text-sm font-semibold text-[#244275]/70 uppercase tracking-wider">
                {isLoginMode ? "Masuk ke akun" : "Buat akun baru"}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#244275] mt-1">
                {isLoginMode ? "Selamat Datang Kembali" : "Daftar di SummitGo"}
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                {isLoginMode
                  ? "Masuk untuk melanjutkan rencana pendakianmu."
                  : "Lengkapi data untuk mulai menggunakan layanan SummitGo."}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                  isLoginMode
                    ? "bg-white text-[#244275] shadow-sm"
                    : "text-slate-500 hover:text-[#244275]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                  !isLoginMode
                    ? "bg-white text-[#244275] shadow-sm"
                    : "text-slate-500 hover:text-[#244275]"
                }`}
              >
                Register
              </button>
            </div>

            <form
              onSubmit={isLoginMode ? handleLogin : handleRegister}
              className="space-y-4"
            >
              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#244275]/30 focus:border-[#244275] text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#244275]/30 focus:border-[#244275] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#244275]/30 focus:border-[#244275] text-sm"
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    placeholder="Ulangi password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#244275]/30 focus:border-[#244275] text-sm"
                  />
                </div>
              )}

              {isLoginMode && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#244275] hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#244275] hover:bg-[#1a325a] disabled:opacity-60 text-white font-bold text-sm shadow-md transition"
              >
                {submitting
                  ? "Memproses..."
                  : isLoginMode
                  ? "Masuk"
                  : "Daftar Sekarang"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">atau</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition flex items-center justify-center gap-3"
            >
              <GoogleIcon />
              {isLoginMode ? "Login dengan Google" : "Daftar dengan Google"}
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              {isLoginMode ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="font-bold text-[#244275] hover:underline"
              >
                {isLoginMode ? "Daftar" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
