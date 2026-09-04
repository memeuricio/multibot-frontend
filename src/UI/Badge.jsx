/**
 * Componente Badge
 * Pill de estado/etiqueta de color.
 *
 * Props:
 *   children   — texto del badge
 *   color      — "blue" | "green" | "red" | "yellow" | "purple" | "gray" (default "gray")
 *   size       — "sm" | "md" (default "sm")
 *   dot        — mostrar punto de color (default false)
 *   className  — clases extra
 *
 * No usa darkMode intencionalmente: los badges son semánticos
 * y mantienen su color en ambos temas para legibilidad.
 */
const Badge = ({
  children,
  color = "gray",
  size = "sm",
  dot = false,
  className = "",
}) => {
  const colorMap = {
    blue: "bg-blue-100   text-blue-700   border-blue-200",
    green: "bg-green-100  text-green-700  border-green-200",
    red: "bg-red-100    text-red-700    border-red-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    gray: "bg-gray-100   text-gray-600   border-gray-200",
  };

  const dotColorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-400",
  };

  const sizeMap = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  const c = colorMap[color] ?? colorMap.gray;
  const s = sizeMap[size] ?? sizeMap.sm;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full border
        ${c} ${s}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorMap[color] ?? dotColorMap.gray}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
