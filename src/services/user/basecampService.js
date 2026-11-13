import API from "../api";

export const getBasecampsByGunung = async (gunungId) => {
  const endpoints = [
    `/gunungs/${gunungId}/basecamps`,
    `/user/gunungs/${gunungId}/basecamps`,
    `/basecamps`,
    `/user/basecamps`,
  ];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const res = await API.get(endpoint, {
        params: endpoint.endsWith("/basecamps") && !endpoint.includes(`/gunungs/${gunungId}`)
          ? { gunung_id: gunungId }
          : undefined,
      });

      // Jika endpoint mengembalikan semua basecamp, filter di sisi pemanggil juga bisa,
      // tapi kita kembalikan respons apa adanya.
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

export const getBasecampDetail = async (basecampId) => {
  const endpoints = [
    `/basecamps/${basecampId}`,
    `/user/basecamps/${basecampId}`,
    `/gunungs/basecamps/${basecampId}`,
  ];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      return await API.get(endpoint);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

export const getBasecampJalurs = async (basecampId) => {
  const endpoints = [
    `/basecamps/${basecampId}/jalurs`,
    `/user/basecamps/${basecampId}/jalurs`,
    `/jalurs`,
  ];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      const res = await API.get(endpoint, {
        params: endpoint === "/jalurs" ? { basecamp_id: basecampId } : undefined,
      });
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};
