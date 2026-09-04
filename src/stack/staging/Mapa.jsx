// LIBRERIAS
import { useContext, useEffect, useRef, useState } from "react";

// CONTEXTOS
import { SesionContext } from "../../contexts/SesionProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import { uiTokens } from "../../contexts/ConfigProvider";

// API
import { MAP_URL, getMapSettings, getMapPlayers } from "../../api/mapa.api";

// UI
import Titulo from "../../UI/Titulo";
import Contenedor from "../../UI/Contenedor";
import Boton from "../../UI/Boton";
import Badge from "../../UI/Badge";
import Icon from "../../components/Icon";

const WORLD_ICONS = {
  normal: "grass",
  nether: "local_fire_department",
  the_end: "dark_mode",
};

const Mapa = () => {
  const { token } = useContext(SesionContext);
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const [worlds, setWorlds] = useState([]);
  const [world, setWorld] = useState(null);
  const [settingsError, setSettingsError] = useState(null);

  const [players, setPlayers] = useState(null);
  const [playersError, setPlayersError] = useState(null);

  const containerRef = useRef(null);

  // ─── Cargar mundos (una vez) ───────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    let alive = true;
    (async () => {
      try {
        const data = await getMapSettings();
        if (!alive) return;
        const list = (data.worlds ?? []).sort((a, b) => a.order - b.order);
        setWorlds(list);
        if (list.length > 0) setWorld(list[0].name);
      } catch (err) {
        if (alive) setSettingsError(err.message);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  // ─── Polling de jugadores ──────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
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
    const timer = setInterval(poll, 5000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [token]);

  const playersOnline = players?.players?.length ?? 0;
  const playersMax = players?.max ?? "—";

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const mixedContent =
    window.location.protocol === "https:" && MAP_URL.startsWith("http:");

  const worldBtn = (w) => {
    const active = world === w.name;
    return (
      <button
        key={w.name}
        onClick={() => setWorld(w.name)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          active
            ? "bg-emerald-600 text-white shadow-sm"
            : `${t.subtleBg} ${t.textSecondary} hover:${darkMode ? "bg-gray-700" : "bg-gray-200"}`
        }`}
      >
        <Icon name={WORLD_ICONS[w.type] ?? "public"} size={18} />
        <span className="truncate">{w.display_name ?? w.name}</span>
      </button>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <Titulo
        titulo="Mapa del servidor"
        subtitulo="Vista interactiva del mundo en tiempo real"
        icon="map"
        actions={
          <div className="flex items-center gap-2">
            <Boton variant="secondary" size="sm" icon="open_in_new" onClick={() => window.open(MAP_URL, "_blank", "noopener")}>
              Abrir pestaña
            </Boton>
            <Boton variant="primary" size="sm" icon="fullscreen" onClick={handleFullscreen}>
              Pantalla completa
            </Boton>
          </div>
        }
      />

      {mixedContent && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-950/40 dark:border-yellow-800 dark:text-yellow-300 border rounded-lg px-4 py-3 text-sm flex items-center gap-3">
          <Icon name="warning" size={20} />
          <span>
            El mapa se sirve por HTTP. Si el panel está en HTTPS, el navegador
            puede bloquear el visor; usa "Abrir pestaña" en ese caso.
          </span>
        </div>
      )}

      {settingsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-950/60 dark:border-red-800 dark:text-red-300 border rounded-lg px-4 py-3 text-sm flex items-center gap-3">
          <Icon name="cloud_off" size={20} />
          <span>{settingsError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* ─── Visor del mapa ─── */}
        <div className="lg:col-span-3 order-1">
          <div
            ref={containerRef}
            className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-[#0b0d10] h-[55vh] lg:h-[calc(100vh-230px)] lg:min-h-[420px]"
          >
            {world ? (
              <iframe
                key={world}
                src={`${MAP_URL}/?world=${encodeURIComponent(world)}`}
                title="Mapa del servidor"
                className="w-full h-full border-0"
                allow="fullscreen"
                loading="lazy"
              />
            ) : (
              !settingsError && (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                  <p className="text-sm">Cargando mapa…</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* ─── Panel lateral ─── */}
        <div className="lg:col-span-1 order-2 space-y-5">
          {/* Mundos */}
          <Contenedor>
            <div className="flex items-center gap-3 mb-4">
              <Icon name="public" size={20} className={t.accent} />
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>Mundos</h2>
            </div>
            <div className="space-y-2">{worlds.map(worldBtn)}</div>
          </Contenedor>

          {/* Jugadores */}
          <Contenedor>
            <div className="flex items-center gap-3 mb-4">
              <Icon name="group" size={20} className={t.accent} />
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>
                Jugadores
              </h2>
              <div className="ml-auto">
                <Badge color="green" dot>
                  {playersError ? "—" : `${playersOnline}/${playersMax}`}
                </Badge>
              </div>
            </div>

            {playersError ? (
              <p className="text-xs text-red-500">{playersError}</p>
            ) : playersOnline === 0 ? (
              <p className={`text-sm ${t.textSecondary}`}>
                No hay jugadores conectados en este momento.
              </p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {players.players.map((p) => (
                  <li key={p.uuid} className={`rounded-lg px-3 py-2.5 ${t.subtleBg}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${t.textPrimary} truncate`}>
                        {p.name}
                      </span>
                      <span className={`text-[10px] font-mono ${t.textSecondary} shrink-0`}>
                        {Math.floor(p.x)}, {Math.floor(p.y)}, {Math.floor(p.z)}
                      </span>
                    </div>
                    {p.health != null && (
                      <div className="mt-2 space-y-1">
                        <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (p.health / 20) * 100)}%` }} />
                        </div>
                        {p.armor != null && (
                          <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min(100, (p.armor / 20) * 100)}%` }} />
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Contenedor>

          <p className={`text-xs ${t.textMuted} flex items-center gap-1.5`}>
            <Icon name="autorenew" size={14} />
            Jugadores actualizados cada 5 segundos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
