import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../../services/auth/authService";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      alert("Login berhasil");
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login User
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg mb-4"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg mb-4"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >
            Login
          </button>

        </form>

        <div className="flex justify-between mt-4 text-sm">

          <Link to="/user/register">
            Daftar
          </Link>

          <Link to="/user/forgot-password">
            Lupa Password
          </Link>

        </div>

      </div>

    </div>
  );
}