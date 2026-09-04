import Badge from "./Badge";

/**
 * Componente EstadoBot
 * Badge semántico del estado de un bot.
 *
 * Props:
 *   status — "connecting" | "online" | "disconnected" | "error"
 *   size   — "sm" | "md" (pasado a Badge)
 */
const STATUS_CONFIG = {
  connecting: { color: "yellow", label: "Conectando" },
  online: { color: "green", label: "Online" },
  disconnected: { color: "gray", label: "Desconectado" },
  error: { color: "red", label: "Error" },
};

const EstadoBot = ({ status, size = "sm" }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected;
  return (
    <Badge color={cfg.color} size={size} dot={status !== "connecting"} className={status === "connecting" ? "animate-pulse" : ""}>
      {cfg.label}
    </Badge>
  );
};

export { STATUS_CONFIG };
export default EstadoBot;
