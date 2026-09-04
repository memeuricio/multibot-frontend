import { useTheme } from "../contexts/ThemeProvider";
import { uiTokens } from "../contexts/ConfigProvider";
import Icon from "../components/Icon";

/**
 * Componente Tabla
 *
 * Props:
 *   columns     — array de columnas: [{ key, label, align?: "left"|"center"|"right", width? }]
 *   data        — array de filas (objetos)
 *   renderCell  — fn(row, colKey) => ReactNode  — renderizado personalizado por celda
 *   keyField    — nombre del campo que actúa como key única (default "id")
 *   header      — objeto opcional para mostrar encabezado con color:
 *                 { title, icon, color: "blue"|"red"|"green"|"gray", count? }
 *   emptyText   — texto cuando no hay datos (default "No hay datos")
 *   emptyIcon   — icono Material Symbols para estado vacío
 *   striped     — filas alternadas (default false)
 *   hoverable   — resaltado al hover (default true)
 *   stickyHeader — encabezado fijo al hacer scroll (default false)
 *   onRowClick  — fn(row) => void — callback al hacer click en una fila
 *   className   — clases extra para el contenedor
 */
const Tabla = ({
  columns = [],
  data = [],
  renderCell,
  keyField = "id",
  header,
  emptyText = "No hay datos",
  emptyIcon = "inbox",
  striped = false,
  hoverable = true,
  stickyHeader = false,
  onRowClick,
  className = "",
}) => {
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  // Colores del encabezado de sección
  const headerColorMap = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      badge: "bg-white text-blue-600",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      badge: "bg-white text-red-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      badge: "bg-white text-green-600",
    },
    gray: {
      gradient: "from-gray-500 to-gray-600",
      badge: "bg-white text-gray-600",
    },
  };

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Estilos de la cabecera de columnas
  const theadBg = darkMode ? "bg-gray-800" : "bg-gray-50";
  const theadText = darkMode ? "text-gray-300" : "text-gray-700";
  const theadBorder = darkMode ? "border-gray-700" : "border-gray-200";

  // Estilos de filas
  const rowBase = darkMode ? "text-gray-200" : "text-gray-800";
  const rowHover = hoverable
    ? darkMode
      ? "hover:bg-gray-800"
      : "hover:bg-gray-50"
    : "";
  const rowClickable = onRowClick ? "cursor-pointer" : "";
  const rowDivide = darkMode ? "divide-gray-800" : "divide-gray-100";
  const rowStriped = (i) =>
    striped
      ? i % 2 === 0
        ? darkMode
          ? "bg-gray-900"
          : "bg-white"
        : darkMode
          ? "bg-gray-850"
          : "bg-gray-50/60"
      : "";

  return (
    <div
      className={`overflow-hidden rounded-lg border ${t.border} ${className}`}
    >
      {/* Encabezado de sección (opcional) */}
      {header &&
        (() => {
          const hc = headerColorMap[header.color] ?? headerColorMap.blue;
          return (
            <div
              className={`bg-gradient-to-r ${hc.gradient} px-4 py-3 flex items-center gap-2`}
            >
              {header.icon && (
                <Icon
                  name={header.icon}
                  size={20}
                  className="text-white shrink-0"
                />
              )}
              <span className="font-semibold text-white text-base leading-tight">
                {header.title}
              </span>
              {header.count !== undefined && (
                <span
                  className={`ml-auto px-2.5 py-0.5 rounded-full text-sm font-bold ${hc.badge}`}
                >
                  {header.count}
                </span>
              )}
            </div>
          );
        })()}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Cabecera de columnas */}
          <thead
            className={`${theadBg} border-b-2 ${theadBorder} ${stickyHeader ? "sticky top-0 z-10" : ""}`}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`
                    p-3 text-xs font-semibold uppercase tracking-wide
                    ${theadText}
                    ${alignMap[col.align ?? "left"]}
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody className={`divide-y ${rowDivide}`}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`text-center py-12 px-4 ${t.textSecondary}`}
                >
                  <Icon
                    name={emptyIcon}
                    size={40}
                    className={`mx-auto mb-3 opacity-40 ${t.textMuted}`}
                  />
                  <p className="text-sm font-medium">{emptyText}</p>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row[keyField] ?? i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`transition-colors ${rowBase} ${rowHover} ${rowStriped(i)} ${rowClickable}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-3 ${alignMap[col.align ?? "left"]}`}
                    >
                      {renderCell ? renderCell(row, col.key) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tabla;
