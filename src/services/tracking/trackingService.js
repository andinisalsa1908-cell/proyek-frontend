import API from "../api";

// =========================
// 🔹 TRACKING GPS PENDAKI
// =========================

// Pendaki yang sudah check-in dan belum checkout.
// Parameter: search, basecamp_id, gunung_id, date, only_tracking
export const getActiveHikers = (params) =>
  API.get("/admin/tracking/hikers", { params });

// Detail satu booking + jejak perjalanan (titik GPS).
export const getBookingTracking = (bookingId) =>
  API.get(`/admin/tracking/bookings/${bookingId}`);

// Riwayat sesi tracking yang sudah selesai.
// Parameter: basecamp_id, gunung_id, from, to, page
export const getTrackingHistory = (params) =>
  API.get("/admin/tracking/history", { params });
