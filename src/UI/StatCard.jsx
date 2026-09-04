import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";
import Icon from "../components/Icon";

/**
 * Componente StatCard
 * Tarjeta de estadística con número destacado y etiqueta.
 *
 * Props:
 *   value      — valor principal (número o string)
 *   label      — etiqueta descriptiva
 *   icon       — nombre de icono Material Symbols (opcional)
 *   color      — "blue" | "green" | "red" | "purple" | "gray" (default "blue")
 *   size       — "sm" | "md" | "lg" (default "md")
 *   className  — clases extra
 */
const StatCard = ({
  value,
  label,
  icon,
  color = "blue",
  size = "md",
  className = "",
}) => {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const colorMap = {
    blue: {
      value: "text-blue-500",
      icon: "text-blue-400",
      bg: darkMode ? "bg-blue-950/40" : "bg-blue-50",
    },
    green: {
      value: "text-green-500",
      icon: "text-green-400",
      bg: darkMode ? "bg-green-950/40" : "bg-green-50",
    },
    red: {
      value: "text-red-500",
      icon: "text-red-400",
      bg: darkMode ? "bg-red-950/40" : "bg-red-50",
    },
    purple: {
      value: "text-purple-500",
      icon: "text-purple-400",
      bg: darkMode ? "bg-purple-950/40" : "bg-purple-50",
    },
    gray: {
      value: "text-gray-500",
      icon: "text-gray-400",
      bg: darkMode ? "bg-gray-800" : "bg-gray-100",
    },
  };

  const sizeMap = {
    sm: {
      value: "text-xl font-bold",
      label: "text-xs",
      icon: 18,
      padding: "p-3",
    },
    md: {
      value: "text-3xl font-bold",
      label: "text-sm",
      icon: 22,
      padding: "p-4",
    },
    lg: {
      value: "text-4xl font-bold",
      label: "text-base",
      icon: 26,
      padding: "p-5",
    },
  };

  const c = colorMap[color] ?? colorMap.blue;
  const s = sizeMap[size] ?? sizeMap.md;

  return (
    <div
      className={`
        ${t.cardBg} ${c.bg}
        border ${t.border}
        rounded-lg ${s.padding}
        flex items-center gap-3
        ${className}
      `}
    >
      {icon && (
        <Icon name={icon} size={s.icon} className={`shrink-0 ${c.icon}`} />
      )}
      <div>
        <div className={`${s.value} ${c.value} leading-none`}>{value}</div>
        <div className={`${s.label} ${t.textSecondary} mt-1`}>{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
