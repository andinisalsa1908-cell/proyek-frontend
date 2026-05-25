import API from "../api";

// 🔹 BOOKINGS
export const getBookings = () =>
  API.get("/admin-basecamp/bookings");

export const getBookingDetail = (id) =>
  API.get(`/admin-basecamp/bookings/${id}`);

export const checkinBooking = (id) =>
  API.patch(`/admin-basecamp/bookings/${id}/checkin`);

export const checkoutBooking = (id) =>
  API.patch(`/admin-basecamp/bookings/${id}/checkout`);


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


// 🔹 JALUR
export const getJalurs = (basecampId) =>
  API.get(`/admin-basecamp/basecamps/${basecampId}/jalurs`);

export const getJalurDetail = (basecampId, id) =>
  API.get(`/admin-basecamp/basecamps/${basecampId}/jalurs/${id}`);

export const createJalur = (basecampId, data) =>
  API.post(`/admin-basecamp/basecamps/${basecampId}/jalurs`, data, {
    headers: {
      'Content-Type': 'multipart:form-data',
    }
  });

export const updateJalur = (basecampId, id, data) =>
  API.post(`/admin-basecamp/basecamps/${basecampId}/jalurs/${id}`, data, {
    headers: {
      'Content-Type': 'multipart:form-data',
    }
  });

export const deleteJalur = (basecampId, id) =>
  API.delete(`/admin-basecamp/basecamps/${basecampId}/jalurs/${id}`);


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