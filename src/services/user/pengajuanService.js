import API from "../api";

export const createPengajuan = (data) => {
  return API.post("/user/requests", data);
};

// sementara dummy dulu
export const getPengajuan = async () => {
  return {
    data: [],
  };
};