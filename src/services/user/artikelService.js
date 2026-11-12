import API from "../api";

export const getArtikels = () => {
  return API.get("/user/articles");
};

export const getArtikelDetail = (id) => {
  return API.get(`/user/articles/${id}`);
};
