import Icon from "../components/Icon";

// MARCA
export const APP_NAME = "MineGo";
export const APP_SUBTITLE = "Panel de Bots";

// Servidor de Minecraft administrado
export const MC_SERVER = {
  mapUrl: import.meta.env.VITE_MAP_URL ?? "http://35.225.251.194:8080",
  apiUrl: import.meta.env.VITE_BOT_API_URL ?? "http://localhost:8080",
};

// Configuración de secciones del menú con sus permisos
export const menuSections = [
  {
    key: "inicio",
    icon: <Icon name="home" />,
    title: "Inicio",
    permission: null,
    items: [{ text: "Resumen", path: "/" }],
  },
  {
    key: "bots",
    icon: <Icon name="smart_toy" />,
    title: "Bots",
    permission: null,
    items: [
      { text: "Dashboard", path: "/bots" },
      { text: "Crear bot", path: "/bots/crear" },
    ],
  },
  {
    key: "mapa",
    icon: <Icon name="map" />,
    title: "Mapa",
    permission: null,
    items: [{ text: "Mapa del servidor", path: "/mapa" }],
  },
  {
    key: "configuraciones",
    icon: <Icon name="settings" />,
    title: "Configuración",
    permission: null,
    items: [{ text: "Configuraciones", path: "/configuraciones" }],
  },
];

export const sidebarTheme = {
  // Color del sidebar
  background: "bg-emerald-900",

  // Colores de los items
  activeItemClass: "bg-emerald-600 text-white shadow-md",
  inactiveItemClass: "text-emerald-100 hover:bg-emerald-700 hover:text-white",

  // Color linea submenu
  submenuLine: "border-emerald-600",

  // Colores del perfil de usuario
  userProfileBg: "bg-emerald-800",
  userProfileHover: "hover:bg-emerald-700",
  userProfileBorder: "border-emerald-700",

  // Colores del contenido principal (CHILDREN)
  contentBg: "bg-slate-50",

  // Colores del botón móvil
  mobileButtonBg: "bg-emerald-600",
  mobileButtonHover: "hover:bg-emerald-700",

  // Color del overlay móvil
  overlayBg: "bg-white",
};

// Tema oscuro
export const sidebarThemeDark = {
  background: "bg-gray-900",

  activeItemClass: "bg-emerald-700 text-white shadow-md",
  inactiveItemClass: "text-gray-300 hover:bg-gray-700 hover:text-white",

  submenuLine: "border-emerald-800",

  userProfileBg: "bg-gray-800",
  userProfileHover: "hover:bg-gray-700",
  userProfileBorder: "border-gray-700",

  contentBg: "bg-gray-950",

  mobileButtonBg: "bg-gray-700",
  mobileButtonHover: "hover:bg-gray-600",

  overlayBg: "bg-black",
};

// Logo del sistema
export const sidebarLogo = "/mc_logo.svg";

// ─── Tokens de diseño UI ──────────────────────────────────────────────────────

export const uiTokens = {
  light: {
    // Fondos
    pageBg: "bg-slate-50",
    cardBg: "bg-white",
    subtleBg: "bg-slate-100",

    // Texto
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-500",
    textMuted: "text-gray-400",

    // Bordes
    border: "border-gray-200",
    borderStrong: "border-gray-300",

    // Acento (verde Minecraft)
    accent: "text-emerald-600",
    accentBg: "bg-emerald-600",
    accentBorder: "border-emerald-600",
    accentHover: "hover:bg-emerald-700",
    accentSubtle: "bg-emerald-50",
    accentSubtleText: "text-emerald-700",

    // Divisor
    divider: "divide-gray-200",
  },
  dark: {
    // Fondos
    pageBg: "bg-gray-950",
    cardBg: "bg-gray-900",
    subtleBg: "bg-gray-800",

    // Texto
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    textMuted: "text-gray-500",

    // Bordes
    border: "border-gray-800",
    borderStrong: "border-gray-700",

    // Acento
    accent: "text-emerald-400",
    accentBg: "bg-emerald-600",
    accentBorder: "border-emerald-500",
    accentHover: "hover:bg-emerald-700",
    accentSubtle: "bg-emerald-950",
    accentSubtleText: "text-emerald-300",

    // Divisor
    divider: "divide-gray-800",
  },
};
