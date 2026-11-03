import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  BadgePercent
} from 'lucide-react';

import {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo
} from '../../services/super-admin/superAdminService';

const emptyForm = {
  code: '',
  title: '',
  tag: '',
  description: '',
  valid_until: '',
  image_url: '',
  is_active: true,
};

const Promo = () => {

  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH PROMO
  // =========================
  const fetchPromos = async () => {

    try {

      setLoading(true);

      const res = await getPromos();

      console.log("PROMOS:", res.data);

      // dukung response array langsung maupun pagination
      setPromos(res.data.data.data || res.data.data || []);

    } catch (err) {

      console.log(err.response?.data);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // =========================
  // MODAL HANDLER
  // =========================
  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setEditingId(promo.id);
    setForm({
      code: promo.code || '',
      title: promo.title || '',
      tag: promo.tag || '',
      description: promo.description || '',
      valid_until: promo.valid_until
        ? String(promo.valid_until).slice(0, 10)
        : '',
      image_url: promo.image_url || '',
      is_active: promo.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // =========================
  // SAVE PROMO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code.trim() || !form.title.trim()) {
      alert('Kode dan judul promo wajib diisi');
      return;
    }

    try {

      setSaving(true);

      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        tag: form.tag.trim(),
        description: form.description.trim(),
        valid_until: form.valid_until || null,
        image_url: form.image_url.trim(),
      };

      if (editingId) {
        await updatePromo(editingId, payload);
        alert('Promo berhasil diperbarui');
      } else {
        await createPromo(payload);
        alert('Promo berhasil ditambahkan');
      }

      closeModal();
      await fetchPromos();

    } catch (err) {

      console.log("ERROR SAVE PROMO:", err.response?.data);

      alert(
        err.response?.data?.message ||
        'Gagal menyimpan promo'
      );

    } finally {

      setSaving(false);

    }
  };

  // =========================
  // DELETE PROMO
  // =========================
  const handleDelete = async (id) => {

    if (!window.confirm('Yakin ingin menghapus promo ini?')) return;

    try {

      await deletePromo(id);

      await fetchPromos();

      alert('Promo berhasil dihapus');

    } catch (err) {

      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
        'Gagal menghapus promo'
      );

    }
  };

  // =========================
  // FILTER SEARCH
  // =========================
  const filteredPromos = promos.filter((item) => {

    const keyword = search.toLowerCase();

    return (
      item.code?.toLowerCase().includes(keyword) ||
      item.title?.toLowerCase().includes(keyword) ||
      item.tag?.toLowerCase().includes(keyword)
    );
  });

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {

    if (!date) return '-';

    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="relative space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-[#24426d]">
            Promo
          </h1>

          <p className="text-gray-500 mt-2">
            Kelola banner dan kode promo yang tampil di halaman utama
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-[#f3e03b] hover:bg-yellow-400 text-[#24426d] font-bold px-5 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Plus size={18} />
          Tambah Promo
        </button>

      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari kode atau judul promo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
          />

        </div>

      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-6 bg-[#b9d1f1] p-4 rounded-full mb-6 shadow-sm">

        {['Kode', 'Judul', 'Tag', 'Masa Berlaku', 'Status', 'Aksi'].map((head) => (

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

        {loading ? (

          <div className="text-center py-10 text-gray-400">
            Loading...
          </div>

        ) : filteredPromos.length > 0 ? (

          filteredPromos.map((item) => (

            <div
              key={item.id}
              className="grid grid-cols-6 bg-white border-4 border-[#b9d1f1] p-4 rounded-full items-center shadow-sm"
            >

              {/* KODE */}
              <div className="flex justify-center">
                <span className="bg-[#24426d]/10 text-[#24426d] font-bold text-sm px-4 py-1 rounded-full tracking-wider">
                  {item.code || '-'}
                </span>
              </div>

              {/* JUDUL */}
              <div className="text-center font-medium text-gray-700 truncate px-2">
                {item.title || '-'}
              </div>

              {/* TAG */}
              <div className="text-center font-medium text-gray-700 truncate px-2">
                {item.tag || '-'}
              </div>

              {/* MASA BERLAKU */}
              <div className="text-center font-medium text-gray-700">
                {formatDate(item.valid_until)}
              </div>

              {/* STATUS */}
              <div className="flex justify-center">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                    item.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>

              {/* AKSI */}
              <div className="flex justify-center gap-4">

                <button
                  onClick={() => openEditModal(item)}
                  className="text-blue-600 hover:scale-125 transition-transform"
                  title="Edit Promo"
                >
                  <Pencil size={22} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:scale-125 transition-transform"
                  title="Hapus Promo"
                >
                  <Trash2 size={22} />
                </button>

              </div>

            </div>

          ))

        ) : (

          <div className="text-center py-10 text-gray-400 italic">
            Tidak ada data promo.
          </div>

        )}

      </div>

      {/* MODAL FORM */}
      {isModalOpen && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white rounded-[40px] p-8 md:p-10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-[#24426d]/10 flex items-center justify-center">
                  <BadgePercent size={22} className="text-[#24426d]" />
                </div>

                <h2 className="text-2xl font-bold text-[#24426d]">
                  {editingId ? 'Edit Promo' : 'Tambah Promo'}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={26} />
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* KODE + TAG */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-bold text-[#24426d] mb-2">
                    Kode Promo
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="SUMMIT30"
                    className="w-full px-5 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d] uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#24426d] mb-2">
                    Tag Banner
                  </label>

                  <input
                    type="text"
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    placeholder="FLASH SALE 30%"
                    className="w-full px-5 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
                  />
                </div>

              </div>

              {/* JUDUL */}
              <div>
                <label className="block text-sm font-bold text-[#24426d] mb-2">
                  Judul Promo
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Diskon Tiket Pendakian Akhir Pekan"
                  className="w-full px-5 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="block text-sm font-bold text-[#24426d] mb-2">
                  Deskripsi
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Deskripsi singkat promo..."
                  className="w-full px-5 py-3 rounded-[24px] border border-gray-200 outline-none focus:border-[#24426d] resize-none"
                />
              </div>

              {/* MASA BERLAKU + STATUS */}
              <div className="grid md:grid-cols-2 gap-4 items-end">

                <div>
                  <label className="block text-sm font-bold text-[#24426d] mb-2">
                    Berlaku Sampai
                  </label>

                  <input
                    type="date"
                    name="valid_until"
                    value={form.valid_until}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
                  />
                </div>

                <label className="flex items-center gap-3 px-5 py-3 rounded-full border border-gray-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 accent-[#24426d]"
                  />

                  <span className="font-bold text-[#24426d] text-sm">
                    Promo Aktif
                  </span>
                </label>

              </div>

              {/* GAMBAR */}
              <div>
                <label className="block text-sm font-bold text-[#24426d] mb-2">
                  URL Gambar Banner
                </label>

                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-5 py-3 rounded-full border border-gray-200 outline-none focus:border-[#24426d]"
                />
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-4 pt-4">

                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white border-4 border-[#24426d] text-[#24426d] font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-all active:scale-95"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#24426d] hover:bg-[#1a3152] text-white font-bold px-10 py-3 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Promo;
