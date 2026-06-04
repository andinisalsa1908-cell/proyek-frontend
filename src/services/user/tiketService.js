import API from "../api";

export const getBookings = () => {
  return API.get("/user/bookings");
};

export const createBooking = (data) => {
  return API.post("/user/bookings", data);
};

export const cancelBooking = (id) => {
  return API.patch(`/user/bookings/${id}/cancel`);
};

export const getHistory = () => {
  return API.get("/user/bookings/history");
};

export const downloadBookingPdf = (id) => {
  return API.get(`/user/bookings/${id}/pdf`, {
    responseType: "blob",
  });
};