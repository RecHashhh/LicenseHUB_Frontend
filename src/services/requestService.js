import api from "./api";

export const getRequests = async () => {
  const { data } = await api.get("/requests");
  return data;
};

export const createRequest = async (payload) => {
  const { data } = await api.post("/requests", payload);
  return data;
};

export const updateRequestStatus = async (id, status) => {
  const { data } = await api.patch(`/requests/${id}/status`, { status });
  return data;
};
