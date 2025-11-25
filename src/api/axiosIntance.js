import axios from "axios";
const baseURL = import.meta.env.VITE_APP_HOME_SERVICE_URL;

const API = axios.create({
  baseURL: `${baseURL}`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
