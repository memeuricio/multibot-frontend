// LIBRERIAS
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// CONTEXTOS
import { SesionContext } from "../../contexts/SesionProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import { uiTokens } from "../../contexts/ConfigProvider";

// API
import {
  getBot,
  connectBot,
  disconnectBot,
  deleteBot,
  sendChat,
  getChat,
} from "../../api/bots.api";

// UI
import Titulo from "../../UI/Titulo";
import Contenedor from "../../UI/Contenedor";
import StatCard from "../../UI/StatCard";
import Boton from "../../UI/Boton";
import Modal from "../../UI/Modal";
import EstadoBot from "../../UI/EstadoBot";
import EstadoAuth from "../../UI/EstadoAuth";
import Badge from "../../UI/Badge";
import Icon from "../../components/Icon";

// UTILS
import {
  formatDateTime,
  formatTime,
  formatProtocol,
  formatPing,
  GAME_MODES,
} from "../../utils/botFormat";

// ─── Subcomponentes locales ────────────────────────────────────────────────

const BarraVital = ({ label, value, max, barColor, t }) => {
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${t.textSecondary}`}>{label}</span>
        <span className={`text-xs font-mono font-semibold ${t.textPrimary}`}>
          {value ?? 0}/{max}
        </span>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${t.subtleBg}`}>
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const ChatMessage = ({ msg }) => {
  if (msg.kind === "system") {
    return (
      <p className="text-center text-xs italic text-gray-500 dark:text-gray-400 py-0.5">
        {msg.text}
      </p>
    );
  }
  const disguised = msg.kind === "disguised";
  return (
    <p className="text-sm leading-snug break-words">
      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mr-1.5">
        {formatTime(msg.time)}
      </span>
      <span
        className={`font-semibold mr-1 ${
          disguised ? "text-purple-500 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {disguised ? `~${msg.from}` : `<${msg.from}>`}
      </span>
      <span className="text-gray-800 dark:text-gray-200">{msg.text}</span>
    </p>
  );
};

// ─── Componente principal ──────────────────────────────────────────────────

const DetalleBot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(SesionContext);
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const [bot, setBot] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [action, setAction] = useState(null); // "connect" | "disconnect"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Chat
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState(null);
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);

  const isOnline = bot?.status === "online";
  const isConnecting = bot?.status === "connecting";

  // ─── Polling del bot ───────────────────────────────────────────────────
  const pollBot = useCallback(async () => {
    try {
      const data = await getBot(id);
      setBot(data);
      setNotFound(false);
      setLoadError(null);
      return data;
    } catch (err) {
      if (err.status === 404) {
        setBot(null);
        setNotFound(true);
        return null; // detiene el polling
      }
      setLoadError(err.message);
      return { status: "unknown" }; // continúa el polling
    }
  }, [id]);

  useEffect(() => {
    if (!token || !id) return;
    let alive = true;
    let timer;

    const loop = async () => {
      if (!alive) return;
      const data = await pollBot();
      if (!alive || !data) return; // 404 → detener
      timer = setTimeout(loop, data.status === "connecting" ? 2500 : 5000);
    };

    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [token, id, pollBot]);

  // ─── Polling del chat ──────────────────────────────────────────────────
  useEffect(() => {
    if (!id || !isOnline) return;
    let alive = true;
    let timer;

    const poll = async () => {
      if (!alive) return;
      try {
        const chat = await getChat(id, 100);
        if (alive) {
          setMessages(chat);
          setChatError(null);
        }
      } catch (err) {
        if (alive) setChatError(err.message);
      } finally {
        if (alive) timer = setTimeout(poll, 2000);
      }
    };

    poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [id, isOnline]);

  // Auto-scroll al final si el usuario está abajo
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  // ─── Acciones ──────────────────────────────────────────────────────────
  const handleAction = async (type) => {
    setAction(type);
    setLoadError(null);
    try {
      if (type === "connect") await connectBot(id);
      else await disconnectBot(id);
      await pollBot();
    } catch (err) {
      // 409 → el bot ya está en ese estado; refrescar y continuar
      if (err.status !== 409) setLoadError(err.message);
      await pollBot();
    } finally {
      setAction(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBot(id);
      navigate("/dashboard");
    } catch (err) {
      if (err.status === 404) navigate("/dashboard");
      else setLoadError(err.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg || !isOnline) return;
    setSending(true);
    setChatError(null);
    try {
      await sendChat(id, msg);
      setChatInput("");
      stickToBottomRef.current = true;
      setMessages(await getChat(id, 100));
    } catch (err) {
      setChatError(err.message);
    } finally {
      setSending(false);
    }
  };

  // ─── Estados de carga / error ──────────────────────────────────────────
  if (notFound) {
    return (
      <div className="p-4 md:p-6">
        <Contenedor padding="lg" className="max-w-lg mx-auto text-center">
          <Icon name="cloud_off" size={48} className={`mx-auto mb-4 ${t.textMuted}`} />
          <h2 className={`text-xl font-bold ${t.textPrimary} mb-2`}>Bot no encontrado</h2>
          <p className={`text-sm ${t.textSecondary} mb-6`}>
            El bot ya no existe. El servicio de bots se reinició y los bots viven
            en memoria: vuelve a crearlos si los necesitas.
          </p>
          <Boton variant="primary" icon="arrow_back" onClick={() => navigate("/dashboard")}>
            Volver a la lista
          </Boton>
        </Contenedor>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="p-4 md:p-6">
        <div className="pt-40 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const errorBox = darkMode
    ? "bg-red-950/60 border-red-800 text-red-300"
    : "bg-red-100 border-red-400 text-red-700";
  const warnBox = darkMode
    ? "bg-yellow-950/40 border-yellow-800 text-yellow-300"
    : "bg-yellow-50 border-yellow-200 text-yellow-800";

  return (
    <div className="p-4 md:p-6 space-y-5">
      <Titulo
        titulo={bot.config?.username ?? "Bot"}
        subtitulo={`${bot.config?.host}:${bot.config?.port ?? 25565} · ${bot.id}`}
        icon="smart_toy"
        actions={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <EstadoBot status={bot.status} size="md" />
            {isOnline && (
              <Boton variant="secondary" size="sm" icon="logout" loading={action === "disconnect"} disabled={!!action} onClick={() => handleAction("disconnect")}>
                Desconectar
              </Boton>
            )}
            {(bot.status === "disconnected" || bot.status === "error") && (
              <Boton variant="success" size="sm" icon="play_arrow" loading={action === "connect"} disabled={!!action} onClick={() => handleAction("connect")}>
                Conectar
              </Boton>
            )}
            <Boton variant="danger" size="sm" icon="delete" onClick={() => setShowDeleteModal(true)}>
              Eliminar
            </Boton>
          </div>
        }
      />

      {/* Banner de error del bot */}
      {bot.error && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-start gap-3 ${errorBox}`}>
          <Icon name="error" size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Error de conexión</p>
            <p>{bot.error}</p>
          </div>
        </div>
      )}

      {loadError && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-center gap-3 ${errorBox}`}>
          <Icon name="cloud_off" size={20} />
          <span>{loadError}</span>
        </div>
      )}

      {/* Error de autenticación del bot */}
      {bot.auth === "error" && bot.authError && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-start gap-3 ${errorBox}`}>
          <Icon name="key" size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Error de autenticación</p>
            <p>{bot.authError}</p>
          </div>
        </div>
      )}

      {/* Login sin confirmación */}
      {bot.auth === "timeout" && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-start gap-3 ${warnBox}`}>
          <Icon name="key" size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">Login sin confirmación</p>
            <p>
              El servidor no confirmó la sesión del bot. Revisa el chat o la
              contraseña configurada.
            </p>
          </div>
        </div>
      )}

      {/* Conectando */}
      {isConnecting && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-center gap-3 ${warnBox}`}>
          <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Conectando al servidor… puede tardar hasta ~90 segundos.</span>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={formatPing(bot.latency)} label="Latencia" icon="network_check" color="blue" />
        <StatCard value={bot.playersOnline ?? 0} label="Jugadores online" icon="group" color="green" />
        <StatCard value={formatProtocol(bot.protocol)} label="Protocolo" icon="tag" color="purple" />
        <StatCard value={GAME_MODES[bot.gameMode] ?? "—"} label="Modo de juego" icon="sports_esports" color="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ─── Información + telemetría ─── */}
        <div className="lg:col-span-1 space-y-5">
          <Contenedor>
            <div className="flex items-center gap-3 mb-4">
              <Icon name="info" size={20} className={t.accent} />
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>Información</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className={t.textSecondary}>Nombre</span>
                <span className={`font-semibold ${t.textPrimary} truncate`}>{bot.config?.username}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className={t.textSecondary}>Servidor</span>
                <span className={`font-mono text-xs ${t.textPrimary} truncate`}>
                  {bot.config?.host}:{bot.config?.port ?? 25565}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className={t.textSecondary}>Versión</span>
                <span className={t.textPrimary}>{bot.config?.version ?? "—"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className={t.textSecondary}>Vista (chunks)</span>
                <span className={t.textPrimary}>{bot.config?.viewDistance ?? "—"}</span>
              </div>
              {(bot.hasPassword || (bot.auth && bot.auth !== "none")) && (
                <div className="flex justify-between gap-3 items-center">
                  <span className={t.textSecondary}>Autenticación</span>
                  <span title={bot.auth === "error" ? bot.authError : undefined}>
                    <EstadoAuth auth={bot.auth} />
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className={t.textSecondary}>Creado</span>
                <span className={`text-xs ${t.textPrimary}`}>{formatDateTime(bot.createdAt)}</span>
              </div>
              <div className="flex justify-between gap-3 items-start">
                <span className={t.textSecondary}>ID</span>
                <span className={`text-[10px] font-mono ${t.textMuted} break-all text-right`}>{bot.id}</span>
              </div>
            </div>
          </Contenedor>

          {isOnline && bot.position && (
            <Contenedor>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="my_location" size={20} className={t.accent} />
                <h2 className={`text-base font-semibold ${t.textPrimary}`}>Telemetría</h2>
              </div>

              <div className={`grid grid-cols-3 gap-2 mb-4 text-center`}>
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className={`rounded-lg px-2 py-3 ${t.subtleBg}`}>
                    <p className={`text-[10px] uppercase tracking-wider font-semibold ${t.textMuted}`}>{axis}</p>
                    <p className={`text-lg font-bold font-mono ${t.textPrimary}`}>{Math.floor(bot.position[axis])}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <BarraVital label="Vida" value={bot.health} max={20} barColor="bg-red-500" t={t} />
                <BarraVital label="Comida" value={bot.food} max={20} barColor="bg-amber-500" t={t} />
              </div>
            </Contenedor>
          )}
        </div>

        {/* ─── Chat ─── */}
        <Contenedor className="lg:col-span-2" padding="none" fullHeight>
          <div className={`px-5 py-4 border-b ${t.border} flex items-center gap-3`}>
            <Icon name="chat" size={20} className={t.accent} />
            <div className="flex-1 min-w-0">
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>Chat del servidor</h2>
              <p className={`text-xs ${t.textSecondary}`}>
                {isOnline ? "Mensajes en vivo del juego" : "Disponible cuando el bot esté online"}
              </p>
            </div>
            <Badge color={isOnline ? "green" : "gray"} dot>
              {isOnline ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          {/* Mensajes */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`h-80 lg:h-[420px] overflow-y-auto px-5 py-4 space-y-1.5 font-mono ${
              darkMode ? "bg-gray-950/40" : "bg-slate-50/60"
            }`}
          >
            {!isOnline ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                <Icon name="chat_off" size={40} className={`${t.textMuted} opacity-50`} />
                <p className={`text-sm ${t.textSecondary}`}>
                  El chat se habilita cuando el bot esté online.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-2">
                <Icon name="forum" size={40} className={`${t.textMuted} opacity-50`} />
                <p className={`text-sm ${t.textSecondary}`}>Sin mensajes todavía.</p>
              </div>
            ) : (
              messages.map((msg, i) => <ChatMessage key={`${msg.time}-${i}`} msg={msg} />)
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className={`p-4 border-t ${t.border} flex items-center gap-2`}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              maxLength={256}
              disabled={!isOnline || sending}
              placeholder={isOnline ? "Escribe un mensaje como el bot…" : "Esperando conexión…"}
              className={`flex-1 px-3 py-2 text-sm rounded-md border ${t.cardBg} ${t.textPrimary} ${t.border} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors`}
            />
            <Boton type="submit" variant="primary" icon="send" loading={sending} disabled={!isOnline || !chatInput.trim()}>
              Enviar
            </Boton>
          </form>

          {chatError && (
            <p className="px-4 pb-3 text-xs text-red-500">{chatError}</p>
          )}
        </Contenedor>
      </div>

      <p className={`text-xs ${t.textMuted} flex items-center gap-1.5`}>
        <Icon name="autorenew" size={14} />
        Estado actualizado {isConnecting ? "cada 2.5 s" : "cada 5 s"} · chat cada 2 s.
      </p>

      {/* Modal: confirmar eliminación */}
      <Modal open={showDeleteModal} onClose={() => !deleting && setShowDeleteModal(false)} title="Eliminar bot" size="sm" accent="red">
        <p className={`text-sm ${t.textSecondary} mb-6`}>
          ¿Seguro que quieres eliminar{" "}
          <span className={`font-semibold ${t.textPrimary}`}>{bot.config?.username}</span>?
          Esta acción desconecta el bot y lo borra del servicio. No se puede deshacer.
        </p>
        <div className="flex gap-3">
          <Boton variant="secondary" fullWidth disabled={deleting} onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Boton>
          <Boton variant="danger" fullWidth loading={deleting} icon="delete" onClick={handleDelete}>
            Eliminar
          </Boton>
        </div>
      </Modal>
    </div>
  );
};

export default DetalleBot;
