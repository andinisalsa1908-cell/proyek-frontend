import API from "../api";

// 🔹 DASHBOARD
export const getDashboard = () =>
  API.get("/super-admin/dashboard");

export const getDashboardCharts = () =>
  API.get("/super-admin/dashboard/charts");


// 🔹 ADMIN REQUEST
export const getRequests = () =>
  API.get("/super-admin/requests");

export const approveRequest = (id) =>
  API.post(`/super-admin/requests/${id}/approve`);

export const rejectRequest = (id, data) =>
  API.post(`/super-admin/requests/${id}/reject`, data);


// 🔹 USER MANAGEMENT
export const getUsers = () =>
  API.get("/super-admin/users");

export const deleteUser = (id) =>
  API.delete(`/super-admin/users/${id}`);

export const removeUserRole = (id, role) =>
  API.delete(`/super-admin/users/${id}/roles/${role}`);


// 🔹 GUNUNG
export const getGunungs = () =>
  API.get("/super-admin/gunungs");


// 🔹 ACTIVITY LOG
export const getActivityLogs = () =>
  API.get("/super-admin/activity-logs");