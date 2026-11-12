import API from "../api";

export const getPromos = () => {
  return API.get("/user/promos");
};
