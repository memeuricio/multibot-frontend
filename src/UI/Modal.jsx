// CONTEXTOS
import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";

// COMPONENTES
import Icon from "../components/Icon";

/**
 * Componente Modal
 * Modal genérico con soporte de modo oscuro, backdrop con blur y animación.
 *
 * Props:
 *   open             — booleano para mostrar/ocultar (default false)
 *   onClose          — función al cerrar (botón X o backdrop)
 *   title            — título del modal
 *   children         — contenido del modal (form, texto, etc.)
 *   size             — "sm" | "md" | "lg" | "xl" | "2xl" (default "md")
 *   accent           — "red" | "blue" | "green" | "yellow" | null
 *                       (default null → usa border temático de 1px)
 *   showCloseButton  — mostrar botón X (default true)
 *   closeOnBackdrop  — cerrar al hacer click fuera del card (default true)
 *   className        — clases extra para el contenedor interno
 *   bodyClassName    — clases extra para el wrapper del contenido (default "p-6")
 */
const Modal = ({
  open = false,
  onClose,
  title,
  children,
  size = "md",
  accent = null,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = "",
  bodyClassName = "",
}) => {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  if (!open) return null;

  const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const accentMap = {
    red: "border-2 border-accent-red",
    blue: "border-2 border-blue-500",
    green: "border-2 border-green-500",
    yellow: "border-2 border-yellow-500",
  };

  const backdrop = darkMode ? "bg-black/60" : "bg-black/20";
  const closeHover = darkMode ? "hover:text-gray-300" : "hover:text-gray-600";

  return (
    <div
      className={`fixed inset-0 ${backdrop} backdrop-blur-2xl flex items-center justify-center z-[60] p-4 animate-fade-in`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`${t.cardBg} ${
          accent ? accentMap[accent] : `border ${t.border}`
        } rounded-lg shadow-xl w-full ${
          sizeMap[size] ?? sizeMap.md
        } max-h-[90vh] overflow-y-auto animate-modal-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 ${bodyClassName}`}>
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-6">
              {title ? (
                <h2 className={`text-2xl font-bold ${t.textPrimary}`}>
                  {title}
                </h2>
              ) : (
                <div />
              )}
              {showCloseButton && onClose && (
                <button
                  onClick={onClose}
                  className={`${t.textMuted} ${closeHover} transition-colors`}
                  aria-label="Cerrar modal"
                >
                  <Icon name="close" className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
