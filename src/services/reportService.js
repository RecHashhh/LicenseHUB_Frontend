import api from "./api";

export const downloadPdfReport = async (params = {}) => {
  const response = await api.get("/reports/pdf", { params, responseType: "blob" });
  return response.data;
};

export const getDashboardSummary = async () => {
  const { data } = await api.get("/dashboard/summary");
  return data;
};
