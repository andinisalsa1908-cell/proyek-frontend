import API from "../api";

export const getGunungs = () => {
  return API.get("/user/gunungs");
};

export const getGunungDetail = (id) => {
  return API.get(`/user/gunungs/${id}`);
};