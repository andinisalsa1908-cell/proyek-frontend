import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../services/user/userService";
import UserPrivateLayout from "../../../layouts/UserPrivateLayout";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(profile);
      alert("Profile berhasil diupdate");
    } catch (err) {
      alert("Gagal update profile");
    }
  };

  return (
    <UserPrivateLayout>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          className="w-full border p-3 rounded mb-4"
          value={profile.name}
          onChange={(e) =>
            setProfile({
              ...profile,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          className="w-full border p-3 rounded mb-4"
          value={profile.email}
          onChange={(e) =>
            setProfile({
              ...profile,
              email: e.target.value,
            })
          }
        />

        <button className="bg-green-600 text-white px-5 py-2 rounded">
          Simpan
        </button>
      </form>
    </UserPrivateLayout>
  );
}