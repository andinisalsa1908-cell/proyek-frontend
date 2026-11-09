import API from "../api";

export const createPengajuan = (data) => {
  return API.post("/user/requests", data);
};

export const getPengajuan = () => {
  return API.get("/user/requests");
};