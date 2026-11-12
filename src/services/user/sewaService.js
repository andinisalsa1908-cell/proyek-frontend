import API from "../api";

export const getPeralatans = (params = {}) => {
  return API.get("/user/peralatans", { params });
};

export const createSewa = (data) => {
  return API.post("/user/rentals", data);
};

export const getSewaSaya = () => {
  return API.get("/user/rentals");
};

export const cancelSewa = (id) => {
  return API.patch(`/user/rentals/${id}/cancel`);
};
