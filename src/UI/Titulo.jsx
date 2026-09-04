import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";
import Icon from "../components/Icon";

/**
 * Componente Titulo
 *
 * Props:
 *   titulo      — texto principal del título (requerido)
 *   subtitulo   — texto secundario debajo del título
 *   icon        — nombre de icono Material Symbols (ej. "analytics")
 *   actions     — nodo React para botones/acciones en el lado derecho
 *   size        — "sm" | "md" | "lg" (default "lg")
 *   divider     — mostrar línea divisoria inferior (default true)
 *   className   — clases extra para el contenedor
 */
const Titulo = ({
  titulo,
  subtitulo,
  icon,
  actions,
  size = "lg",
  divider = true,
  className = "",
}) => {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const sizeConfig = {
    sm: {
      title: "text-base font-semibold",
      subtitle: "text-xs",
      icon: 18,
      padding: "py-3 px-4",
    },
    md: {
      title: "text-lg font-semibold",
      subtitle: "text-sm",
      icon: 22,
      padding: "py-4 px-6",
    },
    lg: {
      title: "text-2xl font-bold",
      subtitle: "text-base",
      icon: 28,
      padding: "py-5 px-6",
    },
  };

  const cfg = sizeConfig[size] ?? sizeConfig.md;

  return (
    <div
      className={`
        flex items-center justify-between
        ${cfg.padding}
        ${divider ? `border-b ${t.border}` : ""}
        ${className}
      `}
    >
      {/* Lado izquierdo: icono + textos */}
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className={`shrink-0 ${t.accent}`}>
            <Icon name={icon} size={cfg.icon} />
          </span>
        )}

        <div className="min-w-0">
          <h1
            className={`${cfg.title} ${t.textPrimary} leading-tight truncate`}
          >
            {titulo}
          </h1>

          {subtitulo && (
            <p className={`${cfg.subtitle} ${t.textSecondary} mt-0.5 truncate`}>
              {subtitulo}
            </p>
          )}
        </div>
      </div>

      {/* Lado derecho: acciones opcionales */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-4">{actions}</div>
      )}
    </div>
  );
};

export default Titulo;
