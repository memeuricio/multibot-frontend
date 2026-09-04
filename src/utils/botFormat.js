// Helpers de formato para la UI de bots

// Posición {x,y,z} → "x, y, z" (Math.floor como indica la API)
export const formatPosition = (pos) =>
  pos ? `${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}` : "—";

// ISO 8601 → fecha local legible (ej. "04-09 15:30")
export const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// ISO 8601 → hora local (ej. "15:30") para el chat
export const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : "";

// gameMode numérico → etiqueta
export const GAME_MODES = {
  0: "Supervivencia",
  1: "Creativo",
  2: "Aventura",
  3: "Espectador",
};

// Protocolo → etiqueta legible (776 = MC 26.2, 775 = 26.1; 0 = aún no conectado)
export const formatProtocol = (protocol) => {
  if (!protocol) return "—";
  const map = { 776: "MC 26.2", 775: "MC 26.1" };
  return map[protocol] ? `${protocol} · ${map[protocol]}` : String(protocol);
};

// Latencia → "45 ms"
export const formatPing = (latency) =>
  latency != null ? `${latency} ms` : "—";
