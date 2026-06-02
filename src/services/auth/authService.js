import API from "../api";

export const login = async (data) => {
  localStorage.removeItem("token");

  const res = await API.post("/login", data);

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

export const register = (data) =>
  API.post("/register", data);

export const forgotPassword = (data) =>
  API.post("/forgot-password", data);

export const logout = async () => {
  await API.post("/logout");
  localStorage.clear();
};