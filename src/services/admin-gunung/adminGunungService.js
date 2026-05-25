import API from "../api";


// =========================
// 🔹 REQUEST ADMIN BASECAMP
// =========================

// kirim request jadi admin basecamp
export const createRequestAdminBasecamp = (data) =>
  API.post("/admin-gunung/requests", data);

// ambil daftar request
export const getRequests = () =>
  API.get("/admin-gunung/requests");


// =========================
// 🔹 GUNUNG
// =========================

export const getGunungs = () =>
  API.get("/admin-gunung/gunungs");

export const getGunungDetail = (id) =>
  API.get(`/admin-gunung/gunungs/${id}`);

export const createGunung = (data) =>
  API.post("/admin-gunung/gunungs", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateGunung = (id, data) =>
  API.post(`/admin-gunung/gunungs/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteGunung = (id) =>
  API.delete(`/admin-gunung/gunungs/${id}`);

export const uploadGaleri = (id, data) =>
  API.post(`/admin-gunung/gunungs/${id}/galeri`, data);


// =========================
// 🔹 BASECAMP
// =========================

export const getBasecamps = () =>
  API.get("/admin-gunung/basecamps");

export const getBasecampDetail = (id) =>
  API.get(`/admin-gunung/basecamps/${id}`);

export const createBasecamp = (data) =>
  API.post("/admin-gunung/basecamps", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateBasecamp = (id, data) =>
  API.post(`/admin-gunung/basecamps/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

export const deleteBasecamp = (id) =>
  API.delete(`/admin-gunung/basecamps/${id}`);

// assign admin ke basecamp
export const assignAdminBasecamp = (id, data) =>
  API.patch(`/admin-gunung/basecamps/${id}/assign-admin`, data);


// =========================
// 🔹 REPORT
// =========================

// ambil laporan
export const getReports = () =>
  API.get("/admin-gunung/reports");

// download PDF
export const downloadReportPDF = () =>
  API.get("/admin-gunung/reports/pdf", {
    responseType: "blob", // ⛔ WAJIB untuk file
  });


// =========================
// 🔹 DASHBOARD
// =========================

export const getDashboard = () =>
  API.get("/admin-gunung/dashboard");

export const getDashboardCharts = () =>
  API.get("/admin-gunung/dashboard/charts");