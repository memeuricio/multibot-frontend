import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";

/**
 * Componente Contenedor
 *
 * Props:
 *   children    — contenido interno
 *   padding     — "none" | "sm" | "md" | "lg" (default "md")
 *   rounded     — "none" | "sm" | "md" | "lg" | "xl" (default "lg")
 *   border      — mostrar borde (default true)
 *   shadow      — "none" | "sm" | "md" | "lg" (default "sm")
 *   fullHeight  — ocupa el alto disponible (default false)
 *   className   — clases extra
 */
const Contenedor = ({
  children,
  padding = "md",
  rounded = "lg",
  border = true,
  shadow = "sm",
  fullHeight = false,
  className = "",
}) => {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const paddingMap = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  const roundedMap = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  const shadowMap = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={`
        ${t.cardBg}
        ${paddingMap[padding] ?? paddingMap.md}
        ${roundedMap[rounded] ?? roundedMap.lg}
        ${border ? `border ${t.border}` : ""}
        ${shadowMap[shadow] ?? shadowMap.sm}
        ${fullHeight ? "h-full" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Contenedor;
