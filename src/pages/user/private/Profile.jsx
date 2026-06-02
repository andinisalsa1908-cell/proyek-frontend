import React, {
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  updateProfile,
} from "../../../services/user";

export default function Profile() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();

      setForm({
        nama: res.data.nama || "",
        email: res.data.email || "",
      });
    } catch (error) {
      console.log(error);
    }
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
      await updateProfile(form);
      alert("Profile berhasil diperbarui");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Profil Saya</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama</label>
          <input
            className="form-control"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}