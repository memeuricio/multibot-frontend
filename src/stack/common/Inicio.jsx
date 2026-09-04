import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SesionContext } from "../../contexts/SesionProvider";
import { APP_NAME, MC_SERVER, uiTokens } from "../../contexts/ConfigProvider";
import { useTheme } from "../../contexts/ThemeProvider";

// API
import { getHealth } from "../../api/auth.api";
import { listBots } from "../../api/bots.api";
import { getMapPlayers } from "../../api/mapa.api";

// UI
import Titulo from "../../UI/Titulo";
import Contenedor from "../../UI/Contenedor";
import StatCard from "../../UI/StatCard";
import BotonNav from "../../UI/BotonNav";
import Icon from "../../components/Icon";

const Inicio = () => {
  const navigate = useNavigate();
  const { token } = useContext(SesionContext);
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const [bots, setBots] = useState([]);
  const [health, setHealth] = useState(null);
  const [players, setPlayers] = useState(null);
  const [playersError, setPlayersError] = useState(null);

  // ─── Salud del backend ─────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      const h = await getHealth();
      if (alive) setHealth(h);
    };
    poll();
    const timer = setInterval(poll, 10000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  // ─── Lista de bots (polling 5s) ────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    let alive = true;
    let timer;

    const poll = async () => {
      if (!alive) return;
      try {
        const data = await listBots();
        if (alive) setBots(Array.isArray(data) ? data : []);
      } catch {
        /* backend caído o 401 — el interceptor maneja la sesión */
      } finally {
        if (alive) timer = setTimeout(poll, 5000);
      }
    };

    poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [token]);

  // ─── Jugadores del servidor (squaremap) ────────────────────────────────
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const data = await getMapPlayers();
        if (alive) {
          setPlayers(data);
          setPlayersError(null);
        }
      } catch (err) {
        if (alive) setPlayersError(err.message);
      }
    };
    poll();
    const timer = setInterval(poll, 10000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const stats = useMemo(() => {
    const online = bots.filter((b) => b.status === "online").length;
    const connecting = bots.filter((b) => b.status === "connecting").length;
    const error = bots.filter((b) => b.status === "error").length;
    const disconnected = bots.filter((b) => b.status === "disconnected").length;
    return { online, connecting, error, disconnected, total: bots.length };
  }, [bots]);

  const playersOnline = players?.players?.length ?? 0;
  const playersMax = players?.max ?? "—";

  const healthOk = health?.status === "ok";

  const banner = healthOk
    ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950/60 dark:border-green-800 dark:text-green-300"
    : "bg-red-50 border-red-300 text-red-800 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300";

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Titulo
        titulo={`Bienvenido a ${APP_NAME}`}
        subtitulo="Panel de administración de bots para tu servidor de Minecraft"
        icon="sports_esports"
      />

      {/* Estado del servicio de bots */}
      <div className={`border rounded-lg px-4 py-3 flex items-center gap-3 text-sm ${banner}`}>
        <Icon name={healthOk ? "cloud_done" : "cloud_off"} size={22} />
        <span className="font-medium">
          {healthOk
            ? "Servicio de bots operativo"
            : "Sin conexión con el servicio de bots"}
        </span>
        <span className="ml-auto font-mono text-xs opacity-70 truncate hidden sm:block">
          {MC_SERVER.apiUrl}
        </span>
      </div>

      {/* Estadísticas de bots */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={stats.online} label="Bots online" icon="check_circle" color="green" />
        <StatCard value={stats.connecting} label="Conectando" icon="sync" color="blue" />
        <StatCard value={stats.error} label="Con error" icon="error" color="red" />
        <StatCard value={stats.total} label="Bots totales" icon="smart_toy" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jugadores del servidor */}
        <Contenedor className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`shrink-0 w-9 h-9 rounded-lg ${t.subtleBg} ${t.accent} flex items-center justify-center`}>
              <Icon name="group" size={20} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>
                Jugadores en el servidor
              </h2>
              <p className={`text-xs ${t.textSecondary}`}>
                Datos del mapa en vivo
              </p>
            </div>
          </div>

          <p className={`text-4xl font-bold ${t.accent}`}>
            {playersError ? "—" : playersOnline}
            <span className={`text-base font-medium ${t.textSecondary} ml-1`}>
              / {playersMax}
            </span>
          </p>

          {playersError ? (
            <p className={`mt-2 text-xs text-red-500`}>{playersError}</p>
          ) : playersOnline === 0 ? (
            <p className={`mt-3 text-sm ${t.textSecondary}`}>
              No hay jugadores conectados en este momento.
            </p>
          ) : (
            <ul className={`mt-3 space-y-1.5 max-h-44 overflow-y-auto`}>
              {players.players.map((p) => (
                <li
                  key={p.uuid}
                  className={`flex items-center justify-between text-sm px-2 py-1.5 rounded-md ${t.subtleBg}`}
                >
                  <span className={`font-medium ${t.textPrimary} truncate`}>
                    {p.name}
                  </span>
                  <span className={`text-xs font-mono ${t.textSecondary} shrink-0 ml-2`}>
                    {Math.floor(p.x)}, {Math.floor(p.y)}, {Math.floor(p.z)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Contenedor>

        {/* Accesos rápidos */}
        <Contenedor className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className={`shrink-0 w-9 h-9 rounded-lg ${t.subtleBg} ${t.accent} flex items-center justify-center`}>
              <Icon name="bolt" size={20} />
            </div>
            <div>
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>
                Accesos rápidos
              </h2>
              <p className={`text-xs ${t.textSecondary}`}>
                Gestiona tu flota de bots y observa el mundo
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-4 py-2">
            <BotonNav
              label="Ver bots"
              icon="smart_toy"
              color="blue"
              onClick={() => navigate("/dashboard")}
            />
            <BotonNav
              label="Crear bot"
              icon="person_add"
              color="green"
              onClick={() => navigate("/bots/crear")}
            />
            <BotonNav
              label="Mapa"
              icon="map"
              color="purple"
              onClick={() => navigate("/mapa")}
            />
          </div>
        </Contenedor>
      </div>
    </div>
  );
};

export default Inicio;
