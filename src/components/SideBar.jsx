// LIBRERIAS
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// CONTEXTOS
import { useSesionContext } from "../contexts/SesionProvider";
import { useTheme } from "../contexts/ThemeProvider";
import {
  menuSections,
  sidebarTheme,
  sidebarThemeDark,
  sidebarLogo,
  APP_NAME,
  APP_SUBTITLE,
} from "../contexts/ConfigProvider";

// COMPONENTES
import Icon from "./Icon";

const CollapsibleSection = ({ section, activePath, theme }) => {
  const isSingle = section.items.length === 1;
  const singleItem = isSingle ? section.items[0] : null;

  const hasActiveItem = section.items.some(
    (item) =>
      activePath === item.path || activePath.startsWith(item.path + "/"),
  );
  // null = sin preferencia del usuario → sigue el estado activo de la ruta
  const [userOpen, setUserOpen] = useState(null);
  const isOpen = userOpen ?? hasActiveItem;
  const toggle = () => setUserOpen(!isOpen);

  if (section.items.length == 0) {
    return null;
  }

  if (isSingle) {
    const isActive =
      activePath === singleItem.path ||
      activePath.startsWith(singleItem.path + "/");
    return (
      <div className="pt-1">
        <Link
          to={singleItem.path}
          className={`flex items-center w-full rounded-sm p-2 transition-all duration-200 justify-start ${
            isActive ? theme.activeItemClass : theme.inactiveItemClass
          }`}
        >
          <span className="text-xl md:text-2xl shrink-0">{section.icon}</span>
          <span className="ml-3 text-sm md:text-base font-medium truncate">
            {section.title}
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-1">
      <button
        onClick={toggle}
        className={`flex items-center w-full rounded-sm p-2 transition-all duration-200 cursor-pointer justify-between ${
          hasActiveItem ? theme.activeItemClass : theme.inactiveItemClass
        }`}
      >
        <div className="flex items-center">
          <span className="text-xl md:text-2xl shrink-0">{section.icon}</span>
          <span className="ml-3 text-sm md:text-base font-medium truncate">
            {section.title}
          </span>
        </div>
        <span className="ml-2 shrink-0 text-xs opacity-70">
          {isOpen ? (
            <Icon name="expand_less" size={20} />
          ) : (
            <Icon name="expand_more" size={20} />
          )}
        </span>
      </button>

      {isOpen && (
        <div className={`ml-4 mt-0.5 border-l ${theme.submenuLine} pl-3`}>
          {section.items.map((item) => {
            const isActive =
              activePath === item.path ||
              activePath.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block text-sm py-1.5 px-2 rounded-sm mb-0.5 transition-all duration-150 ${
                  isActive ? theme.activeItemClass : theme.inactiveItemClass
                }`}
              >
                {item.text}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BrandHeader = () => (
  <div className="flex flex-col items-center py-2 select-none">
    <img src={sidebarLogo} alt="Logo" className="h-12 w-12 object-contain" />
    <p className="text-white text-lg font-bold mt-1.5 tracking-wide">
      {APP_NAME}
    </p>
    <p
      className={`text-[10px] uppercase tracking-widest opacity-60 text-white`}
    >
      {APP_SUBTITLE}
    </p>
  </div>
);

const UserProfile = ({ logout, theme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`absolute bottom-full mb-2 left-0 w-full rounded-lg shadow-lg border py-3 z-40
        ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        transition-all duration-200 origin-bottom
        ${isDropdownOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-1 pointer-events-none"}`}
      >
        <div className="flex items-center justify-around px-3 gap-2">
          <button
            onClick={() => {
              navigate("/configuraciones");
              setIsDropdownOpen(false);
            }}
            title="Configuración"
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Icon name="settings" size={22} />
            <span className="text-xs">Config</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Icon name={darkMode ? "light_mode" : "dark_mode"} size={22} />
            <span className="text-xs">{darkMode ? "Claro" : "Oscuro"}</span>
          </button>

          <button
            onClick={() => {
              logout();
              setIsDropdownOpen(false);
            }}
            title="Cerrar sesión"
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors text-red-500 ${darkMode ? "hover:bg-red-900/30" : "hover:bg-red-50"}`}
          >
            <Icon name="logout" size={22} />
            <span className="text-xs">Salir</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-full flex items-center p-3 rounded-lg ${theme.userProfileBg} ${theme.userProfileHover} transition-all duration-200 justify-between`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 overflow-hidden bg-emerald-600">
            <Icon name="shield_person" size={20} />
          </div>
          <div className="ml-3 text-left flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              Administrador
            </p>
            <p className="text-gray-300 text-xs truncate">Sesión activa</p>
          </div>
        </div>
        <span className="text-gray-300 ml-2 shrink-0">
          {isDropdownOpen ? (
            <Icon name="expand_less" size={20} />
          ) : (
            <Icon name="expand_more" size={20} />
          )}
        </span>
      </button>
    </div>
  );
};

const Sidebar = ({ children }) => {
  // Inicializar según el ancho real del viewport para evitar el flash en mobile
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isHidden, setIsHidden] = useState(() => window.innerWidth < 768);
  const { logout } = useSesionContext();
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useMemo(
    () => (darkMode ? sidebarThemeDark : sidebarTheme),
    [darkMode],
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Solo colapsar al pasar a mobile; al pasar a desktop, expandir
      if (mobile) setIsHidden(true);
      else setIsHidden(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cierra el menú al navegar en mobile (ajuste durante render, patrón React)
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (isMobile) setIsHidden(true);
  }

  return (
    <div>
      {isMobile && !isHidden && (
        <div
          className={`fixed inset-0 ${theme.overlayBg} bg-opacity-50 z-30 transition-opacity duration-300`}
          aria-hidden="true"
          onMouseDown={() => setIsHidden(true)}
        />
      )}

      {isMobile && isHidden && (
        <button
          onClick={() => setIsHidden(false)}
          className={`fixed top-1/2 -translate-y-1/2 left-0 z-40 w-12 h-12 ${theme.mobileButtonBg} text-white rounded-r-full shadow-lg ${theme.mobileButtonHover} transition-all hover:w-14 flex items-center justify-center`}
          aria-label="Abrir menú"
        >
          <Icon name="chevron_right" size={20} className="ml-1" />
        </button>
      )}

      <div
        className={`fixed left-0 top-0 h-[100dvh] font-google-flex flex flex-col transition-all duration-300 ${
          theme.background
        } shadow-2xl p-2 md:p-4 w-64 ${
          isHidden ? "-translate-x-full z-40" : "translate-x-0 z-40"
        }`}
        aria-label="Menú principal"
      >
        <div
          className={`shrink-0 pt-3 pb-3 border-b-2 ${theme.submenuLine} px-1`}
          style={{
            marginBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)",
          }}
        >
          <BrandHeader />
        </div>

        <div
          className={`flex-1 overflow-y-auto ${theme.userProfileBorder} rounded-xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1`}
        >
          {menuSections.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <CollapsibleSection
                key={section.key}
                section={section}
                activePath={location.pathname}
                theme={theme}
              />
            );
          })}
        </div>

        <div
          className={`shrink-0 pt-4 border-t-2 ${theme.submenuLine} px-1`}
          style={{
            marginBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)",
          }}
        >
          <UserProfile logout={handleLogout} theme={theme} />
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          isMobile || isHidden ? "ml-0" : "ml-64"
        } flex flex-col min-h-screen ${theme.contentBg}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
