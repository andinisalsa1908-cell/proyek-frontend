import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../../../services/auth/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const colors = {
    primary: "#24426d",
    accent: "#b9d1f1",
    bg: "rgba(185, 209, 241, 0.3)",
    white: "#ffffff",
    inputBg: "#f9fafb",
    label: "#9ca3af",
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authService.register(form);

      console.log("REGISTER:", res.data);

      alert("Register berhasil");
      navigate("/user/login");
    } catch (error) {
      console.log(error.response?.data);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        alert(firstError);
      } else {
        alert("Register gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: `1px solid ${colors.accent}`,
    background: colors.inputBg,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: colors.bg,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h1
            style={{
              color: colors.primary,
              fontSize: "32px",
              fontWeight: "900",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            SummitGo
          </h1>

          <div
            style={{
              display: "inline-block",
              backgroundColor: colors.accent,
              color: colors.primary,
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            Portal Manajemen Pendakian
          </div>
        </div>

        {/* CARD */}
        <div
          style={{
            backgroundColor: colors.white,
            padding: "35px",
            borderRadius: "25px",
            border: `2px solid ${colors.accent}`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: colors.primary,
              marginBottom: "25px",
            }}
          >
            Buat Akun
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="password"
              name="password_confirmation"
              placeholder="Konfirmasi Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: colors.primary,
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Daftar"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: colors.label,
            }}
          >
            Sudah punya akun?{" "}
            <Link
              to="/user/login"
              style={{
                color: colors.primary,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}