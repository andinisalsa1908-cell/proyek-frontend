import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/auth/authService';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [nama, setNama] = useState('');

  const navigate = useNavigate();

  const colors = {
    primary: "#24426d",
    hover: "#1a3152",
    accent: "#b9d1f1",
    bg: "rgba(185, 209, 241, 0.3)",
    white: "#ffffff",
    inputBg: "#f9fafb",
    label: "#9ca3af",
  };

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("LOGIN:", { email, password });

      const res = await login({ email, password });

      console.log("RESPONSE:", res);

      // ambil user
      const user = res.user || res;

      // ambil role
      let role = user.role;

      // kalau role dari pivot roles
      if (!role && user.roles?.length > 0) {
        role = user.roles[0].name;
      }

      console.log("ROLE:", role);

      if (!role) {
        alert("Role tidak ditemukan!");
        return;
      }

      // simpan user
      localStorage.setItem("user", JSON.stringify(user));

      const roleRoutes = {
        super_admin: "/super-admin",
        admin_basecamp: "/admin-basecamp",
        admin_gunung: "/admin-gunung",
        user: "/user",
      };

      navigate(roleRoutes[role] || "/");

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Login gagal!");
    }
  };

  // 🔹 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register({
        name: nama,
        email,
        password,
        password_confirmation,
      });

      alert("Register berhasil, silakan login!");

      setIsLoginMode(true);
      setNama('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Register gagal!");
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: colors.bg,
      fontFamily: 'sans-serif'
    }}>

      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{
            color: colors.primary,
            fontSize: '32px',
            fontWeight: '900',
            fontStyle: 'italic',
            margin: 0
          }}>
            SummitGo
          </h1>

          <div style={{
            display: 'inline-block',
            backgroundColor: colors.accent,
            color: colors.primary,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '5px'
          }}>
            Portal Manajemen Pendakian
          </div>
        </div>

        {/* CARD */}
        <div style={{
          backgroundColor: colors.white,
          padding: '35px',
          borderRadius: '25px',
          border: `2px solid ${colors.accent}`,
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
        }}>

          <h2 style={{
            textAlign: 'center',
            color: colors.primary,
            marginBottom: '25px'
          }}>
            {isLoginMode ? "Selamat Datang" : "Buat Akun"}
          </h2>

          <form onSubmit={isLoginMode ? handleLogin : handleRegister}>

            {!isLoginMode && (
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                style={inputStyle(colors)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle(colors)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle(colors)}
            />

            {!isLoginMode && (
              <input
                type="password"
                placeholder="Konfirmasi Password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                style={inputStyle(colors)}
              />
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isLoginMode ? "Masuk" : "Daftar"}
            </button>

          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              color: colors.label,
              cursor: 'pointer'
            }}
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode
              ? "Belum punya akun? Daftar"
              : "Sudah punya akun? Login"}
          </p>

        </div>

      </div>
    </div>
  );
};

const inputStyle = (colors) => ({
  width: '100%',
  padding: '14px',
  marginBottom: '15px',
  borderRadius: '12px',
  border: `1px solid ${colors.accent}`,
  background: colors.inputBg,
  outline: 'none'
});

export default Login;