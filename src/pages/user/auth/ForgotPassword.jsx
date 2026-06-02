import React, { useState } from "react";
import * as authService from "../../../services/auth/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authService.forgotPassword({
        email,
      });

      alert(
        "Link reset password berhasil dikirim"
      );
    } catch (error) {
      console.log(error);
      alert("Gagal kirim email");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 mx-auto"
        style={{ maxWidth: "420px" }}
      >
        <h2 className="mb-4 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button className="btn btn-warning w-100">
            Kirim Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}