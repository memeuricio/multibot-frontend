import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";

/**
 * Componente Paginacion
 * Barra de paginación reutilizable con contador de registros.
 *
 * Props:
 *   currentPage      — página actual (1-indexed)
 *   totalPages       — total de páginas
 *   totalItems       — total de registros
 *   indexOfFirst     — índice del primer ítem visible (0-indexed)
 *   indexOfLast      — índice del último ítem visible (0-indexed, exclusivo)
 *   onPageChange     — fn(page: number) => void
 *   maxButtons       — máximo de botones de página visibles (default 5)
 *   className        — clases extra para el contenedor
 */
const Paginacion = ({
  currentPage,
  totalPages,
  totalItems,
  indexOfFirst,
  indexOfLast,
  onPageChange,
  maxButtons = 5,
  className = "",
}) => {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  if (totalPages <= 0) return null;

  // Genera el rango de páginas a mostrar centrado en la página actual
  const pages = Array.from(
    { length: Math.min(maxButtons, totalPages) },
    (_, i) => {
      if (currentPage <= Math.ceil(maxButtons / 2)) return i + 1;
      if (currentPage >= totalPages - Math.floor(maxButtons / 2))
        return totalPages - (maxButtons - 1) + i;
      return currentPage - Math.floor(maxButtons / 2) + i;
    },
  ).filter((p) => p > 0 && p <= totalPages);

  return (
    <div
      className={`
        flex flex-col sm:flex-row items-center justify-between gap-3
        px-4 py-3 rounded-lg border ${t.border} ${t.cardBg}
        ${className}
      `}
    >
      {/* Contador */}
      <p className={`text-xs sm:text-sm ${t.textSecondary}`}>
        Mostrando{" "}
        <span className={`font-semibold ${t.textPrimary}`}>
          {indexOfFirst + 1}
        </span>{" "}
        -{" "}
        <span className={`font-semibold ${t.textPrimary}`}>
          {Math.min(indexOfLast, totalItems)}
        </span>{" "}
        de{" "}
        <span className={`font-semibold ${t.textPrimary}`}>{totalItems}</span>{" "}
        registros
      </p>

      {/* Botones */}
      <div className="flex flex-wrap justify-center gap-1">
        <PageBtn
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          darkMode={darkMode}
          t={t}
        >
          Anterior
        </PageBtn>

        {pages.map((page) => (
          <PageBtn
            key={page}
            onClick={() => onPageChange(page)}
            active={currentPage === page}
            darkMode={darkMode}
            t={t}
          >
            {page}
          </PageBtn>
        ))}

        <PageBtn
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          darkMode={darkMode}
          t={t}
        >
          Siguiente
        </PageBtn>
      </div>
    </div>
  );
};

// Botón interno de paginación
const PageBtn = ({ children, active, disabled, onClick, darkMode, t }) => {
  let classes;

  if (disabled) {
    classes = darkMode
      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
      : "bg-gray-100 text-gray-400 cursor-not-allowed";
  } else if (active) {
    classes = "bg-blue-600 text-white shadow-sm";
  } else {
    classes = darkMode
      ? `${t.subtleBg} ${t.textSecondary} hover:bg-gray-700 hover:text-white`
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[36px] px-2.5 py-1.5 rounded text-xs sm:text-sm font-medium
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${classes}
      `}
    >
      {children}
    </button>
  );
};

export default Paginacion;
