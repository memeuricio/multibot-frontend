import axios from "axios";

// Autenticación de la API de bots.
// El backend solo guarda el SHA-256 del token (ADMIN_KEY_HASH); el token
// plano vive únicamente en el localStorage del navegador ("botapi_key").
// Toda ruta bajo /api/* exige el header X-API-Key: <token>.

const apiUrl = import.meta.env.VITE_BOT_API_URL ?? "http://localhost:8080";
export const KEY_STORAGE = "botapi_key";
export const API_URL = apiUrl;

export const getToken = () => localStorage.getItem(KEY_STORAGE);

// Valida el token contra un endpoint protegido.
// Devuelve { ok, status, message } para diagnosticar el fallo:
//   - ok: true       → 200, credencial válida
//   - status 401     → token incorrecto (message = error del backend)
//   - status 503     → backend sin ADMIN_KEY_HASH configurado
//   - status: null   → sin respuesta (servicio caído / URL incorrecta)
export const loginBotApi = async (token) => {
  try {
    const res = await axios.get(`${apiUrl}/api/bots`, {
      headers: { "X-API-Key": token },
      timeout: 10000,
    });
    if (res.status === 200) return { ok: true };
    return { ok: false, status: res.status, message: res.data?.error };
  } catch (err) {
    if (err.response) {
      return {
        ok: false,
        status: err.response.status,
        message: err.response.data?.error,
      };
    }
    return { ok: false, status: null, message: null };
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
