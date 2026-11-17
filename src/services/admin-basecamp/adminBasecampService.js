import API from "../api";

// 🔹 BOOKINGS
export const getBookings = (params) =>
  API.get("/admin-basecamp/bookings", { params });

export const getBookingDetail = (id) =>
  API.get(`/admin-basecamp/bookings/${id}`);

export const confirmBooking = (id) =>
  API.patch(`/admin-basecamp/bookings/${id}/confirm`);

export const checkinBooking = (id) =>
  API.patch(`/admin-basecamp/bookings/${id}/checkin`);

export const checkoutBooking = (id) =>
  API.patch(`/admin-basecamp/bookings/${id}/checkout`);


// 🔹 BASECAMP (harga tiket dikelola admin basecamp)
export const getBasecamp = () =>
  API.get("/admin-basecamp/basecamp");

export const updateHargaTiket = (data) =>
  API.put("/admin-basecamp/basecamp/harga-tiket", data);


// 🔹 KUOTA
export const getKuotas = (basecampId) =>
  API.get(`/admin-basecamp/basecamps/${basecampId}/kuotas`);

export const getKuotaDetail = (basecampId, id) =>
  API.get(`/admin-basecamp/basecamps/${basecampId}/kuotas/${id}`);

export const createKuota = (basecampId, data) =>
  API.post(`/admin-basecamp/basecamps/${basecampId}/kuotas`, data);

export const updateKuota = (basecampId, id, data) =>
  API.put(`/admin-basecamp/basecamps/${basecampId}/kuotas/${id}`, data);

export const deleteKuota = (basecampId, id) =>
  API.delete(`/admin-basecamp/basecamps/${basecampId}/kuotas/${id}`);


// 🔹 PERALATAN
export const getPeralatans = (basecampId) =>
  API.get(`/admin-basecamp/basecamps/${basecampId}/peralatans`);

export const getPeralatanDetail = (basecampId, id) =>
  API.get(`/admin-basecamp/basecamps/${basecampId}/peralatans/${id}`);

export const createPeralatan = (basecampId, data) =>
  API.post(`/admin-basecamp/basecamps/${basecampId}/peralatans`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

export const updatePeralatan = (basecampId, id, data) =>
  API.put(`/admin-basecamp/basecamps/${basecampId}/peralatans/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

export const deletePeralatan = (basecampId, id) =>
  API.delete(`/admin-basecamp/basecamps/${basecampId}/peralatans/${id}`);


// 🔹 DASHBOARD
export const getDashboard = () =>
  API.get("/admin-basecamp/dashboard");

export const getDashboardCharts = () =>
  API.get("/admin-basecamp/dashboard/charts");


// 🔹 REPORT
export const getReports = () =>
  API.get("/admin-basecamp/reports");

export const downloadReportPdf = () =>
  API.get("/admin-basecamp/reports/pdf", {
    responseType: "blob",
  });