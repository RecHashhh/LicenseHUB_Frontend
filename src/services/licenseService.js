import api from "./api";

export const getLicenses = async (params = {}) => {
  const { data } = await api.get("/licenses", { params });
  return data;
};

export const createLicense = async (payload) => {
  const { data } = await api.post("/licenses", payload);
  return data;
};

export const updateLicense = async (id, payload) => {
  const { data } = await api.put(`/licenses/${id}`, payload);
  return data;
};

export const removeLicense = async (id) => {
  const { data } = await api.delete(`/licenses/${id}`);
  return data;
};

export const exportLicenses = async () => {
  const response = await api.get("/licenses/export", { responseType: "blob" });
  return response.data;
};

export const importLicenses = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/licenses/import", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};
