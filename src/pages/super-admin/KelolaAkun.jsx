import React, { useEffect, useState } from 'react';
import { UserMinus, Trash2 } from 'lucide-react';

import {
  getUsers,
  deleteUser,
  removeUserRole
} from '../../services/super-admin/superAdminService';

const KelolaAkun = () => {

  const [users, setUsers] = useState([]);

  // 🔹 FETCH DATA USER
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      const res = await getUsers();

      console.log("USERS:", res.data);

      setUsers(res.data.data.data || []);

    } catch (err) {

      console.log(err.response?.data);

    }
  };

  // 🔹 DELETE USER
  const handleDelete = async (id) => {

    if (!window.confirm('Yakin ingin menghapus akun ini?')) return;

    try {

      await deleteUser(id);

      fetchUsers();

      alert("User berhasil dihapus");

    } catch (err) {

      console.log(err.response?.data);

      alert("Gagal hapus user");
    }
  };

  // 🔹 REMOVE ROLE
  const handleRemove = async (id, role) => {

    if (!window.confirm('Yakin ingin menghapus role dari akun ini?')) return;

    try {

      await removeUserRole(id, role);

      fetchUsers();

      alert("Role berhasil dihapus");

    } catch (err) {

      console.log(err.response?.data);

      alert("Gagal hapus role dari user");
    }
  };

  return (
    <div className="relative space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-[#24426d]">
          Kelola Akun
        </h1>

      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 bg-[#b9d1f1] p-4 rounded-full mb-6 shadow-sm">

        {['Nama', 'Email', 'Role', 'Status', 'Aksi'].map((head) => (

          <div
            key={head}
            className="text-center font-bold text-[#24426d]"
          >
            {head}
          </div>

        ))}

      </div>

      {/* TABLE BODY */}
      <div className="space-y-4">

        {users.length > 0 ? (

          users.map((user) => (

            <div
              key={user.id}
              className="grid grid-cols-5 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm"
            >

              {/* NAMA */}
              <div className="text-center font-medium text-gray-700">
                {user.name}
              </div>

              {/* EMAIL */}
              <div className="text-center font-medium text-gray-700 truncate px-2">
                {user.email}
              </div>

              {/* ROLE */}
              <div className="text-center font-medium text-gray-700">
                {user.roles?.[0]?.name || "User"}
              </div>

              {/* STATUS */}
              <div className="text-center text-green-600 font-bold">
                Aktif
              </div>

              {/* AKSI */}
              <div className="flex justify-center gap-4">

                {/* REMOVE ROLE */}
                <button
                  onClick={() =>
                    handleRemove(
                      user.id,
                      user.roles?.[0]?.name
                    )
                  }
                  className="text-blue-600 hover:scale-125 transition-transform"
                  title="Remove Role"
                >
                  <UserMinus size={22} />
                </button>

                {/* DELETE USER */}
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:scale-125 transition-transform"
                  title="Delete User"
                >
                  <Trash2 size={22} />
                </button>

              </div>

            </div>

          ))

        ) : (

          <div className="text-center py-10 text-gray-400 italic">
            Tidak ada data user.
          </div>

        )}

      </div>

    </div>
  );
};

export default KelolaAkun;