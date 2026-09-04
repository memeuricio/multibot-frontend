import axios from "axios";

// API JSON de squaremap (mapa interactivo del servidor).
// No requiere autenticación.

const mapUrl = import.meta.env.VITE_MAP_URL ?? "http://35.225.251.194:8080";

export const MAP_URL = mapUrl;

const mapaAxios = axios.create({ baseURL: mapUrl, timeout: 8000 });

// { worlds: [{name, display_name, type, order}], ui: {...} }
export const getMapSettings = async () => {
  try {
    const { data } = await mapaAxios.get("/tiles/settings.json");
    return data;
  } catch {
    throw new Error("No se pudo cargar la configuración del mapa");
  }
};

// { max: <slots>, players: [{ uuid, name, x, y, z, yaw, pitch, health, armor, world }] }
export const getMapPlayers = async () => {
  try {
    const { data } = await mapaAxios.get("/tiles/players.json");
    return data;
  } catch {
    throw new Error("No se pudo cargar la lista de jugadores");
  }
};
