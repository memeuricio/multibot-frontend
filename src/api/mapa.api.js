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

// { worlds: [{name, display_name, type, order}], ui: {...} }
export const getMapSettings = async () => {
  try {
    const { data } = await mapaAxios.get(`${MAP_BASE}/tiles/settings.json`);
    return data;
  } catch (err) {
    throw new Error("No se pudo cargar la configuración del mapa", { cause: err });
  }
};

// { max: <slots>, players: [{ uuid, name, x, y, z, yaw, pitch, health, armor, world }] }
export const getMapPlayers = async () => {
  try {
    const { data } = await mapaAxios.get(`${MAP_BASE}/tiles/players.json`);
    return data;
  } catch (err) {
    throw new Error("No se pudo cargar la lista de jugadores", { cause: err });
  }
};
