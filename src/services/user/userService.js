import API from "../api";

export const getProfile = () => {
  return API.get("/user/profile");
};

export const updateProfile = (data) => {
  return API.put("/user/profile", data);
};

export const uploadFoto = (data) => {
  return API.patch("/user/profile/foto", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = (data) => {
  return API.patch("/user/profile/change-password", data);
};