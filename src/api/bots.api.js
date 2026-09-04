import botAxios, { extractError } from "./config/botAxiosConfig";

// API de bots (MineGo Bot API)
// Todos los errores se lanzan como Error con mensaje legible en español.

export const listBots = async () => {
  try {
    const { data } = await botAxios.get("/api/bots");
    return data.bots ?? [];
  } catch (err) {
    throw new Error(extractError(err, "No se pudo cargar la lista de bots"), { cause: err });
  }
};

export const getBot = async (id) => {
  try {
    const { data } = await botAxios.get(`/api/bots/${id}`);
    return data;
  } catch (err) {
    const e = new Error(extractError(err, "No se pudo cargar el bot"), { cause: err });
    e.status = err?.response?.status;
    throw e;
  }
};

export const createBot = async (config) => {
  try {
    const { data } = await botAxios.post("/api/bots", config);
    return data;
  } catch (err) {
    throw new Error(extractError(err, "No se pudo crear el bot"), { cause: err });
  }
};

export const connectBot = async (id) => {
  try {
    const { data } = await botAxios.post(`/api/bots/${id}/connect`);
    return data;
  } catch (err) {
    const e = new Error(extractError(err, "No se pudo conectar el bot"), { cause: err });
    e.status = err?.response?.status;
    throw e;
  }
};

export const disconnectBot = async (id) => {
  try {
    const { data } = await botAxios.post(`/api/bots/${id}/disconnect`);
    return data;
  } catch (err) {
    const e = new Error(extractError(err, "No se pudo desconectar el bot"), { cause: err });
    e.status = err?.response?.status;
    throw e;
  }
};

export const deleteBot = async (id) => {
  try {
    const { data } = await botAxios.delete(`/api/bots/${id}`);
    return data; // { deleted: true, id }
  } catch (err) {
    const e = new Error(extractError(err, "No se pudo eliminar el bot"), { cause: err });
    e.status = err?.response?.status;
    throw e;
  }
};

export const sendChat = async (id, message) => {
  try {
    const { data } = await botAxios.post(`/api/bots/${id}/chat`, { message });
    return data; // { sent: true }
  } catch (err) {
    const e = new Error(extractError(err, "No se pudo enviar el mensaje"), { cause: err });
    e.status = err?.response?.status;
    throw e;
  }
};

export const getChat = async (id, limit = 100) => {
  try {
    const { data } = await botAxios.get(`/api/bots/${id}/chat`, {
      params: { limit },
    });
    return data.chat ?? [];
  } catch (err) {
    throw new Error(extractError(err, "No se pudo cargar el chat"), { cause: err });
  }
};
