import axios from "axios";

// Mapa squaremap del servidor.
// El mapa se consume a través de un proxy en el MISMO origen del panel
// (ruta /squaremap por defecto) para evitar CORS (dev) y mixed content
// (prod HTTPS). El prefijo lo resuelve:
//   - Vite dev server (vite.config.js → server.proxy)
//   - El reverse proxy en producción (regla: strip prefix → 35.225.251.194:8080)
//
// Si prefieres consumo directo, define VITE_MAP_PROXY_PATH con la URL
// absoluta del mapa (ej: http://35.225.251.194:8080). Requiere que squaremap
// envíe CORS y que el panel no esté en HTTPS.

const MAP_BASE = import.meta.env.VITE_MAP_PROXY_PATH ?? "/squaremap";

export { MAP_BASE };

const mapaAxios = axios.create({ timeout: 8000 });

// El proxy no configurado suele devolver el index.html del panel (SPA
// fallback) con status 200. Detectamos ese caso para fallar con un mensaje
// claro en vez de dejar la UI cargando indefinidamente.
const PROXY_HINT =
  "El proxy del mapa no está activo en este entorno: la ruta del mapa devolvió HTML del panel en lugar de JSON. Configura la regla /squaremap en el reverse proxy (ver README).";

function assertMapJson(data) {
  return data !== null && typeof data === "object";
}

// { worlds: [{name, display_name, type, order}], ui: {...} }
export const getMapSettings = async () => {
  let data;
  try {
    const res = await mapaAxios.get(`${MAP_BASE}/tiles/settings.json`);
    data = res.data;
  } catch (err) {
    throw new Error("No se pudo contactar el mapa del servidor", { cause: err });
  }
  if (!assertMapJson(data) || !Array.isArray(data.worlds)) {
    throw new Error(PROXY_HINT);
  }
  return data;
};

// { max: <slots>, players: [{ uuid, name, x, y, z, yaw, pitch, health, armor, world }] }
export const getMapPlayers = async () => {
  let data;
  try {
    const res = await mapaAxios.get(`${MAP_BASE}/tiles/players.json`);
    data = res.data;
  } catch (err) {
    throw new Error("No se pudo contactar el mapa del servidor", { cause: err });
  }
  if (!assertMapJson(data) || !Array.isArray(data.players)) {
    throw new Error(PROXY_HINT);
  }
  return data;
};
