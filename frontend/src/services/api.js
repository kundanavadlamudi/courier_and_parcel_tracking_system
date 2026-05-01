import axios from "axios";

const rawBaseUrl = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL
)?.trim();
const baseURL = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, "")
  : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("courier_user");
      localStorage.removeItem("courier_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
