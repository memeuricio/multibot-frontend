/**
 * Componente para Material Symbols Outlined (variable font local).
 *
 * Props:
 *   name      — nombre del icono, ej. "home", "settings", "logout"
 *   fill      — 0 (outline) | 1 (filled), default 0
 *   weight    — 100–700, default 400
 *   grade     — -25 | 0 | 200, default 0
 *   opsz      — optical size hint: 20 | 24 | 40 | 48, default 24
 *   size      — font-size en px, controla el tamaño visual real, default 24
 *   className — clases extra de Tailwind
 */
const Icon = ({
  name,
  fill = 0,
  weight = 400,
  grade = 0,
  opsz = 24,
  size = 24,
  className = "",
}) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontSize: `${size}px`,
      fontVariationSettings: `"FILL" ${fill}, "wght" ${weight}, "GRAD" ${grade}, "opsz" ${opsz}`,
    }}
    aria-hidden="true"
  >
    {name}
  </span>
);

export default Icon;
