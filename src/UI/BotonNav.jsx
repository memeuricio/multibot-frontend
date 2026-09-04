import { useTheme } from "../contexts/ThemeProvider";

/**
 * Componente BotonNav
 * Botón grande de navegación tipo card, con icono y label.
 * Ideal para páginas de selección/menú.
 *
 * Props:
 *   label      — texto del botón (requerido)
 *   icon       — string de Material Symbol (ej. "directions_walk")
 *   onClick    — función al hacer click
 *   color      — "blue" | "green" | "red" | "purple" | "orange" | "teal" | "gray" (default "blue")
 *   size       — "sm" | "md" | "lg" (default "md")
 *   disabled   — deshabilita el botón (default false)
 *   className  — clases extra
 */
const BotonNav = ({
  label,
  icon,
  onClick,
  color = "blue",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const { darkMode } = useTheme();

  const colorMap = {
    blue: {
      base: "bg-blue-500",
      hover: "hover:bg-blue-600",
      ring: "focus:ring-blue-400",
    },
    green: {
      base: "bg-green-500",
      hover: "hover:bg-green-600",
      ring: "focus:ring-green-400",
    },
    red: {
      base: "bg-red-500",
      hover: "hover:bg-red-600",
      ring: "focus:ring-red-400",
    },
    purple: {
      base: "bg-purple-500",
      hover: "hover:bg-purple-600",
      ring: "focus:ring-purple-400",
    },
    orange: {
      base: "bg-orange-500",
      hover: "hover:bg-orange-600",
      ring: "focus:ring-orange-400",
    },
    teal: {
      base: "bg-teal-500",
      hover: "hover:bg-teal-600",
      ring: "focus:ring-teal-400",
    },
    gray: {
      base: "bg-gray-500",
      hover: "hover:bg-gray-600",
      ring: "focus:ring-gray-400",
    },
  };

  // En dark mode se oscurece ligeramente el tono base
  const darkOverlay = darkMode ? "brightness-90" : "";

  const sizeMap = {
    sm: {
      box: "w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 p-4 sm:p-6",
      iconWrap: "text-3xl sm:text-4xl md:text-5xl mb-1.5 sm:mb-2",
      label: "text-xs sm:text-sm",
    },
    md: {
      box: "w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 p-5 sm:p-7 md:p-8",
      iconWrap: "text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3",
      label: "text-xs sm:text-sm md:text-base",
    },
    lg: {
      box: "w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 p-6 sm:p-8 md:p-10",
      iconWrap: "text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 md:mb-4",
      label: "text-sm sm:text-base md:text-lg",
    },
  };

  const c = colorMap[color] ?? colorMap.blue;
  const s = sizeMap[size] ?? sizeMap.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center
        ${s.box}
        ${c.base} ${c.hover}
        text-white rounded-xl
        shadow-md hover:shadow-xl
        hover:scale-105 active:scale-95
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 ${c.ring}
        ${darkOverlay}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Icono */}
      <span
        className={`material-symbols-outlined ${s.iconWrap} flex items-center justify-center leading-none`}
      >
        {icon}
      </span>

      {/* Label */}
      <span className={`${s.label} font-medium tracking-wide`}>{label}</span>
    </button>
  );
};

export default BotonNav;
