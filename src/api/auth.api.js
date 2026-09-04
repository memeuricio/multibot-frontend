import axios from "axios";

// Autenticación de la API de bots.
// El backend solo guarda el SHA-256 del token; el token plano vive
// únicamente en el localStorage del navegador (clave: "botapi_key").

const apiUrl = import.meta.env.VITE_BOT_API_URL ?? "http://localhost:8080";
export const KEY_STORAGE = "botapi_key";

export const getToken = () => localStorage.getItem(KEY_STORAGE);

// Valida el token contra un endpoint protegido. true si es válido.
export const loginBotApi = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/api/bots`, {
      headers: { "X-API-Key": token },
      timeout: 10000,
    });
    return res.status === 200;
  } catch {
    return false;
  }
};

export const logoutBotApi = () => {
  localStorage.removeItem(KEY_STORAGE);
};

// GET /health — no requiere autenticación
export const getHealth = async () => {
  try {
    const res = await axios.get(`${apiUrl}/health`, { timeout: 8000 });
    return res.data; // { status: "ok", time }
  } catch {
    return null;
  }
};
