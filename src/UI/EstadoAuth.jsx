import Badge from "./Badge";

/**
 * Componente EstadoAuth
 * Badge del estado de auto-login (/login · /register) de un bot.
 *
 * Props:
 *   auth  — "none" | "pending" | "login_sent" | "register_sent" |
 *           "logged_in" | "not_required" | "timeout" | "error"
 *   size  — "sm" | "md" (pasado a Badge)
 *   short — usar etiquetas compactas (para tablas)
 */
const AUTH_CONFIG = {
  none: { color: "gray", label: "Sin contraseña", short: "Sin login" },
  pending: { color: "yellow", label: "Esperando login…", short: "Login…" },
  login_sent: { color: "yellow", label: "Login enviado", short: "Login…" },
  register_sent: { color: "yellow", label: "Registro enviado", short: "Registro…" },
  logged_in: { color: "green", label: "Sesión iniciada", short: "Autenticado" },
  not_required: { color: "gray", label: "No requiere login", short: "Sin plugin" },
  timeout: { color: "yellow", label: "Sin confirmación", short: "Sin confirmar" },
  error: { color: "red", label: "Error de autenticación", short: "Error login" },
};

const EN_PROGRESO = ["pending", "login_sent", "register_sent"];

const EstadoAuth = ({ auth, size = "sm", short = false, className = "" }) => {
  const cfg = AUTH_CONFIG[auth] ?? AUTH_CONFIG.none;
  const enProgreso = EN_PROGRESO.includes(auth);
  return (
    <Badge
      color={cfg.color}
      size={size}
      dot={auth === "logged_in" || auth === "error"}
      className={`${enProgreso ? "animate-pulse" : ""} ${className}`}
    >
      {short ? cfg.short : cfg.label}
    </Badge>
  );
};

export { AUTH_CONFIG };
export default EstadoAuth;
