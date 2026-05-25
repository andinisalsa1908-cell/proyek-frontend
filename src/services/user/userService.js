import API from "../api";

// gunung
export const getGunungs = () => API.get("/user/gunungs");
export const getGunungDetail = (id) => API.get(`/user/gunungs/${id}`);

// booking
export const getBookings = () => API.get("/user/bookings");
export const createBooking = (data) => API.post("/user/bookings", data);
export const cancelBooking = (id) =>
  API.patch(`/user/bookings/${id}/cancel`);

// profile
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) =>
  API.put("/user/profile", data);

export const getHistory = () =>
  API.get("/user/bookings/history");

export const downloadBookingPdf = (id) =>
  API.get(`/user/bookings/${id}/pdf`, {
    responseType: "blob",
  });