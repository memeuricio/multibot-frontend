import axios from "axios";

// Config de axios para la API de bots (MineGo Bot API).
// Autenticación vía header X-API-Key (token plano en localStorage).

const apiUrl = import.meta.env.VITE_BOT_API_URL ?? "http://localhost:8080";

const botAxios = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});

// Adjunta el token a todas las peticiones
botAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("botapi_key");
  if (token) config.headers["X-API-Key"] = token;
  return config;
});

// 401 → token inválido/eliminado: limpiar y volver al login
botAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("botapi_key");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Extrae el mensaje de error legible del backend (siempre {error: "..."})
export const extractError = (err, fallback = "Error inesperado") =>
  err?.response?.data?.error ?? fallback;

export default botAxios;
