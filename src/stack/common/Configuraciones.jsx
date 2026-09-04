// LIBRERIAS
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// CONTEXTOS
import { SesionContext } from "../../contexts/SesionProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import { uiTokens, APP_NAME, MC_SERVER } from "../../contexts/ConfigProvider";

// UI
import Titulo from "../../UI/Titulo";
import Contenedor from "../../UI/Contenedor";
import Boton from "../../UI/Boton";
import Modal from "../../UI/Modal";
import Badge from "../../UI/Badge";
import Icon from "../../components/Icon";

// API
import { getHealth } from "../../api/auth.api";

// ─── Subcomponentes locales ────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, mono = false, t }) => (
  <div className="flex items-start gap-3">
    <div
      className={`shrink-0 w-9 h-9 rounded-lg ${t.subtleBg} ${t.textSecondary} flex items-center justify-center`}
    >
      <Icon name={icon} size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-[10px] font-semibold uppercase tracking-wider ${t.textMuted}`}>
        {label}
      </p>
      <p
        className={`text-sm font-medium ${t.textPrimary} truncate mt-0.5 ${mono ? "font-mono" : ""}`}
      >
        {value || "No especificado"}
      </p>
    </div>
  </div>
);

const SettingRow = ({ icon, iconBg, iconColor, title, description, action }) => (
  <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
    <div
      className={`shrink-0 w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}
    >
      <Icon name={icon} size={20} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);

// ─── Componente principal ──────────────────────────────────────────────────

const Configuraciones = () => {
  const { logout } = useContext(SesionContext);
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const [health, setHealth] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      const h = await getHealth();
      if (alive) setHealth(h);
    };
    poll();
    const timer = setInterval(poll, 15000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const healthOk = health?.status === "ok";
  const divider = darkMode ? "border-gray-800" : "border-gray-100";

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Titulo
        titulo="Configuraciones"
        subtitulo="Preferencias del panel e información del servicio"
        icon="settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ────────── Conexión ────────── */}
        <Contenedor padding="lg" shadow="md">
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`shrink-0 w-9 h-9 rounded-lg ${
                darkMode ? "bg-emerald-950 text-emerald-400" : "bg-emerald-50 text-emerald-600"
              } flex items-center justify-center`}
            >
              <Icon name="dns" size={20} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>
                Conexión
              </h2>
              <p className={`text-xs ${t.textSecondary} mt-0.5`}>
                Servicios que utiliza {APP_NAME}
              </p>
            </div>
            <div className="ml-auto">
              <Badge color={healthOk ? "green" : "red"} dot>
                {healthOk ? "Operativo" : "Sin conexión"}
              </Badge>
            </div>
          </div>

          <div className={`space-y-4 border-t ${divider} pt-4`}>
            <InfoRow icon="api" label="API de bots" value={MC_SERVER.apiUrl} mono t={t} />
            <InfoRow icon="map" label="Mapa interactivo (ruta proxy)" value={MC_SERVER.mapBase} mono t={t} />
            {health?.time && (
              <InfoRow icon="schedule" label="Última respuesta del servicio" value={new Date(health.time).toLocaleString("es-CL")} t={t} />
            )}
          </div>
        </Contenedor>

        {/* ────────── Preferencias ────────── */}
        <Contenedor padding="lg" shadow="md">
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`shrink-0 w-9 h-9 rounded-lg ${
                darkMode ? "bg-blue-950 text-blue-400" : "bg-blue-50 text-blue-600"
              } flex items-center justify-center`}
            >
              <Icon name="tune" size={20} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>
                Preferencias
              </h2>
              <p className={`text-xs ${t.textSecondary} mt-0.5`}>
                Ajustes de apariencia y sesión.
              </p>
            </div>
          </div>

          <div className={`mt-4 border-t ${divider} divide-y ${divider}`}>
            <SettingRow
              icon={darkMode ? "light_mode" : "dark_mode"}
              iconBg={darkMode ? "bg-yellow-950/40" : "bg-yellow-50"}
              iconColor={darkMode ? "text-yellow-400" : "text-yellow-600"}
              title="Tema"
              description={darkMode ? "Actualmente en modo oscuro" : "Actualmente en modo claro"}
              action={
                <Boton variant="secondary" size="sm" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? "Modo claro" : "Modo oscuro"}
                </Boton>
              }
            />
            <SettingRow
              icon="logout"
              iconBg={darkMode ? "bg-red-950/40" : "bg-red-50"}
              iconColor={darkMode ? "text-red-400" : "text-red-600"}
              title="Cerrar sesión"
              description="Se elimina el token de acceso de este navegador."
              action={
                <Boton variant="danger" size="sm" icon="logout" onClick={() => setShowLogoutModal(true)}>
                  Salir
                </Boton>
              }
            />
          </div>
        </Contenedor>
      </div>

      {/* ────────── Modal: Cerrar sesión ────────── */}
      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar sesión"
        size="sm"
      >
        <p className={`text-sm ${t.textSecondary} mb-6`}>
          ¿Seguro que quieres cerrar la sesión? El token de acceso se eliminará
          de este navegador y tendrás que ingresarlo nuevamente.
        </p>
        <div className="flex gap-3">
          <Boton variant="secondary" fullWidth onClick={() => setShowLogoutModal(false)}>
            Cancelar
          </Boton>
          <Boton variant="danger" fullWidth icon="logout" onClick={handleLogout}>
            Cerrar sesión
          </Boton>
        </div>
      </Modal>
    </div>
  );
};

export default Configuraciones;
