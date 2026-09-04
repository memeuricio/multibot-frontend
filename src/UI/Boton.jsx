import { useTheme } from "../contexts/ThemeProvider";
import Icon from "../components/Icon";

/**
 * Componente Boton
 *
 * Props:
 *   children    — texto o contenido del botón
 *   onClick     — función al hacer click
 *   type        — "button" | "submit" | "reset" (default "button")
 *   variant     — "primary" | "secondary" | "danger" | "success" | "ghost" | "outline" (default "primary")
 *   size        — "xs" | "sm" | "md" | "lg" (default "md")
 *   icon        — nombre de icono Material Symbols (lado izquierdo)
 *   iconRight   — nombre de icono Material Symbols (lado derecho)
 *   loading     — muestra spinner y deshabilita (default false)
 *   disabled    — deshabilita el botón (default false)
 *   fullWidth   — ocupa el ancho completo (default false)
 *   className   — clases extra
 */
const Boton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const { darkMode } = useTheme();

  const sizeConfig = {
    xs: { padding: "px-2.5 py-1", text: "text-xs", iconSize: 14, gap: "gap-1" },
    sm: {
      padding: "px-3 py-1.5",
      text: "text-sm",
      iconSize: 16,
      gap: "gap-1.5",
    },
    md: { padding: "px-4 py-2", text: "text-sm", iconSize: 18, gap: "gap-2" },
    lg: {
      padding: "px-5 py-2.5",
      text: "text-base",
      iconSize: 20,
      gap: "gap-2",
    },
  };

  // Variantes: [base, hover, active, disabled]
  const variantConfig = {
    primary: {
      base: "bg-blue-600 text-white border border-blue-600",
      hover: "hover:bg-blue-700 hover:border-blue-700",
      active: "active:bg-blue-800",
      dark: "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700",
    },
    secondary: {
      base: "bg-gray-100 text-gray-700 border border-gray-200",
      hover: "hover:bg-gray-200 hover:border-gray-300",
      active: "active:bg-gray-300",
      dark: "bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600",
    },
    danger: {
      base: "bg-red-500 text-white border border-red-500",
      hover: "hover:bg-red-600 hover:border-red-600",
      active: "active:bg-red-700",
      dark: "bg-red-600 text-white border border-red-600 hover:bg-red-700",
    },
    success: {
      base: "bg-green-500 text-white border border-green-500",
      hover: "hover:bg-green-600 hover:border-green-600",
      active: "active:bg-green-700",
      dark: "bg-green-600 text-white border border-green-600 hover:bg-green-700",
    },
    ghost: {
      base: "bg-transparent text-gray-600 border border-transparent",
      hover: "hover:bg-gray-100 hover:text-gray-900",
      active: "active:bg-gray-200",
      dark: "bg-transparent text-gray-400 border border-transparent hover:bg-gray-800 hover:text-white",
    },
    outline: {
      base: "bg-transparent text-blue-600 border border-blue-600",
      hover: "hover:bg-blue-50",
      active: "active:bg-blue-100",
      dark: "bg-transparent text-blue-400 border border-blue-500 hover:bg-blue-950",
    },
  };

  const cfg = sizeConfig[size] ?? sizeConfig.md;
  const v = variantConfig[variant] ?? variantConfig.primary;

  const variantClasses = darkMode ? v.dark : `${v.base} ${v.hover} ${v.active}`;

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        ${cfg.padding} ${cfg.text} ${cfg.gap}
        ${variantClasses}
        rounded-md font-medium
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {/* Spinner de carga */}
      {loading && (
        <svg
          className={`animate-spin shrink-0 ${size === "xs" || size === "sm" ? "h-3 w-3" : "h-4 w-4"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icono izquierdo */}
      {!loading && icon && (
        <Icon name={icon} size={cfg.iconSize} className="shrink-0" />
      )}

      {/* Contenido */}
      {children && <span>{children}</span>}

      {/* Icono derecho */}
      {!loading && iconRight && (
        <Icon name={iconRight} size={cfg.iconSize} className="shrink-0" />
      )}
    </button>
  );
};

export default Boton;
