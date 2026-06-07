import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Fitur reset password belum tersedia"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Lupa Password
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full border p-3 rounded-lg mb-4"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >
            Kirim
          </button>

        </form>

      </div>

    </div>
  );
}