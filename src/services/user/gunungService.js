import API from "../api";

const extractList = (res) =>
  res?.data?.data?.data || res?.data?.data || res?.data || [];

export const getGunungs = async () => {
  const endpoints = ["/gunungs", "/user/gunungs", "/public/gunungs"];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const res = await API.get(endpoint);
      // Jika berhasil, kembalikan respons (termasuk jika list kosong tapi endpoint valid)
      return res;
    } catch (err) {
      lastError = err;
      // coba endpoint berikutnya jika 404/405, selain itu lempar
      const status = err?.response?.status;
      if (status && status !== 404 && status !== 405) {
        // endpoint ada tapi error lain; tetap coba fallback hanya jika perlu,
        // namun simpan error ini
      }
    }
  }

  throw lastError;
};

export const getGunungDetail = async (id) => {
  const endpoints = [`/gunungs/${id}`, `/user/gunungs/${id}`, `/public/gunungs/${id}`];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const res = await API.get(endpoint);
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};