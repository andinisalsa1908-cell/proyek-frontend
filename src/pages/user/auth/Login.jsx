import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authService from "../../../services/auth/authService";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const colors = {
    primary: "#24426d",
    accent: "#b9d1f1",
    bg: "rgba(185, 209, 241, 0.3)",
    white: "#ffffff",
    inputBg: "#f9fafb",
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

      const res = await authService.login(form);

      console.log(res);

      localStorage.setItem("token", res.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );

      const role = res.user.role;

      if (role === "super_admin") {
        navigate("/super-admin");
      } else if (role === "admin_gunung") {
        navigate("/admin-gunung");
      } else if (role === "admin_basecamp") {
        navigate("/admin-basecamp");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);

      alert("Login gagal");
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
    backgroundColor: colors.inputBg,
    outline: "none",
    fontSize: "14px",
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
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              color: colors.primary,
              fontSize: "34px",
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
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            Portal Manajemen Pendakian
          </div>
        </div>

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
            Login Akun
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Masukkan Email"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Masukkan Password"
              value={form.password}
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
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            <Link
              to="/user/forgot-password"
              style={{
                color: colors.primary,
                textDecoration: "none",
              }}
            >
              Lupa Password?
            </Link>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            Belum punya akun?{" "}
            <Link
              to="/user/register"
              style={{
                color: colors.primary,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}