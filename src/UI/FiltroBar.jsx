import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";

/**
 * Componente FiltroBar
 * Contenedor de filtros con grid responsivo.
 *
 * Props:
 *   children   — inputs, selects u otros controles de filtro
 *   cols       — columnas en desktop: 2 | 3 | 4 | 5 (default 4)
 *   className  — clases extra
 *
 * ---
 * Componente FiltroInput — input de texto/fecha/número para usar dentro de FiltroBar
 *
 * Props:
 *   label      — etiqueta visible (opcional)
 *   type       — tipo de input (default "text")
 *   value, onChange, placeholder — estándar de input
 *   className  — clases extra
 *
 * ---
 * Componente FiltroSelect — select para usar dentro de FiltroBar
 *
 * Props:
 *   label      — etiqueta visible (opcional)
 *   value, onChange — estándar de select
 *   options    — array de { value, label }
 *   className  — clases extra
 */

const colsMap = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

export function FiltroBar({ children, cols = 4, className = "" }) {
  return (
    <div className={`grid gap-3 ${colsMap[cols] ?? colsMap[4]} ${className}`}>
      {children}
    </div>
  );
}

// Estilos base compartidos para inputs y selects
function useInputStyles() {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const base = `
    w-full px-3 py-2 text-sm rounded-md border
    ${t.cardBg} ${t.textPrimary} ${t.border}
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    placeholder:${t.textMuted}
    transition-colors
  `;

  return { base, t };
}

export function FiltroInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...rest
}) {
  const { base, t } = useInputStyles();

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-xs font-medium ${t.textSecondary}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={base}
        {...rest}
      />
    </div>
  );
}

export function FiltroSelect({
  label,
  value,
  onChange,
  options = [],
  className = "",
  ...rest
}) {
  const { base, t } = useInputStyles();

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-xs font-medium ${t.textSecondary}`}>
          {label}
        </label>
      )}
      <select value={value} onChange={onChange} className={base} {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
