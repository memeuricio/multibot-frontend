// LIBRERIAS
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// CONTEXTOS
import { SesionContext } from "../../contexts/SesionProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import { uiTokens } from "../../contexts/ConfigProvider";

// API
import { listBots, connectBot, disconnectBot, deleteBot } from "../../api/bots.api";

// UI
import Titulo from "../../UI/Titulo";
import Tabla from "../../UI/Tabla";
import Boton from "../../UI/Boton";
import Modal from "../../UI/Modal";
import EstadoBot from "../../UI/EstadoBot";
import { FiltroBar, FiltroInput, FiltroSelect } from "../../UI/FiltroBar";
import Icon from "../../components/Icon";

// UTILS
import { formatPosition, formatDateTime, formatPing } from "../../utils/botFormat";

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "online", label: "Online" },
  { value: "connecting", label: "Conectando" },
  { value: "disconnected", label: "Desconectado" },
  { value: "error", label: "Error" },
];

const Bots = () => {
  const navigate = useNavigate();
  const { token } = useContext(SesionContext);
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const [bots, setBots] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [action, setAction] = useState(null); // { id, type }
  const [actionError, setActionError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Carga + polling ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    let alive = true;
    let timer;

    const poll = async (isInitial = false) => {
      if (!alive) return;
      if (isInitial) setInitialLoading(true);
      try {
        const data = await listBots();
        if (alive) {
          setBots(Array.isArray(data) ? data : []);
          setListError(null);
        }
      } catch (err) {
        if (alive) setListError(err.message);
      } finally {
        if (alive) {
          if (isInitial) setInitialLoading(false);
          timer = setTimeout(() => poll(), 5000);
        }
      }
    };

    poll(true);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [token]);

  // Refresco manual (handlers) sin interferir con el polling
  const refresh = async () => {
    try {
      const data = await listBots();
      setBots(Array.isArray(data) ? data : []);
      setListError(null);
    } catch (err) {
      setListError(err.message);
    }
  };

  // ─── Filtros ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bots.filter((b) => {
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchSearch =
        !q ||
        b.config?.username?.toLowerCase().includes(q) ||
        `${b.config?.host}:${b.config?.port ?? 25565}`.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bots, search, statusFilter]);

  // ─── Acciones ──────────────────────────────────────────────────────────
  const handleAction = async (bot, type) => {
    setAction({ id: bot.id, type });
    setActionError(null);
    try {
      if (type === "connect") await connectBot(bot.id);
      else await disconnectBot(bot.id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setAction(null);
      refresh();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await deleteBot(deleteTarget.id);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      if (err.status === 404) {
        setDeleteTarget(null);
        setActionError("El bot ya no existe (el servicio se reinició).");
        refresh();
      } else {
        setActionError(err.message);
      }
    } finally {
      setDeleting(false);
    }
  };

  // ─── Columnas / render ─────────────────────────────────────────────────
  const columns = [
    { key: "bot", label: "Bot" },
    { key: "servidor", label: "Servidor", align: "left" },
    { key: "estado", label: "Estado" },
    { key: "posicion", label: "Posición" },
    { key: "creada", label: "Creado" },
    { key: "acciones", label: "Acciones", align: "right" },
  ];

  const renderCell = (row, key) => {
    switch (key) {
      case "bot":
        return (
          <div className="flex items-center gap-2">
            <Icon name="smart_toy" size={20} className={t.accent} />
            <div>
              <p className={`font-semibold ${t.textPrimary}`}>{row.config?.username}</p>
              <p className={`text-[10px] font-mono ${t.textMuted}`}>{row.id}</p>
            </div>
          </div>
        );
      case "servidor":
        return (
          <span className={`font-mono text-sm ${t.textSecondary}`}>
            {row.config?.host}:{row.config?.port ?? 25565}
          </span>
        );
      case "estado":
        return (
          <div
            className="flex items-center gap-2"
            title={row.error ?? undefined}
          >
            <EstadoBot status={row.status} />
            {row.status === "online" && (
              <span className={`text-xs ${t.textSecondary}`}>{formatPing(row.latency)}</span>
            )}
          </div>
        );
      case "posicion":
        return (
          <span className={`font-mono text-xs ${row.position ? t.textPrimary : t.textMuted}`}>
            {formatPosition(row.position)}
          </span>
        );
      case "creada":
        return (
          <span className={`text-xs ${t.textSecondary}`}>{formatDateTime(row.createdAt)}</span>
        );
      case "acciones":
        return (
          <div className="flex items-center justify-end gap-1.5">
            {(row.status === "disconnected" || row.status === "error") && (
              <Boton
                variant="success"
                size="xs"
                icon="play_arrow"
                loading={action?.id === row.id && action?.type === "connect"}
                disabled={action?.id === row.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(row, "connect");
                }}
              >
                Conectar
              </Boton>
            )}
            {(row.status === "online" || row.status === "connecting") && (
              <Boton
                variant="secondary"
                size="xs"
                icon="stop"
                loading={action?.id === row.id && action?.type === "disconnect"}
                disabled={action?.id === row.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(row, "disconnect");
                }}
              >
                Desconectar
              </Boton>
            )}
            <Boton
              variant="danger"
              size="xs"
              icon="delete"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(row);
              }}
            >
              Eliminar
            </Boton>
          </div>
        );
      default:
        return null;
    }
  };

  const emptyText =
    bots.length === 0
      ? "No hay bots todavía. Crea el primero."
      : "Sin resultados para el filtro actual.";
  const emptyIcon = bots.length === 0 ? "smart_toy" : "search_off";

  const errorBox = darkMode
    ? "bg-red-950/60 border-red-800 text-red-300"
    : "bg-red-100 border-red-400 text-red-700";

  return (
    <div className="p-4 md:p-6 space-y-5">
      <Titulo
        titulo="Bots"
        subtitulo="Flota de bots conectados al servidor de Minecraft"
        icon="smart_toy"
        actions={
          <Boton variant="success" icon="person_add" onClick={() => navigate("/bots/crear")}>
            Crear bot
          </Boton>
        }
      />

      {listError && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-center gap-3 ${errorBox}`}>
          <Icon name="cloud_off" size={20} />
          <span>{listError}</span>
          <Boton variant="secondary" size="sm" icon="refresh" className="ml-auto" onClick={() => refresh()}>
            Reintentar
          </Boton>
        </div>
      )}

      {actionError && (
        <div className={`border rounded-lg px-4 py-3 text-sm flex items-center gap-3 ${errorBox}`}>
          <Icon name="warning" size={20} />
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className={`ml-auto ${t.textMuted} hover:opacity-70 cursor-pointer`}>
            <Icon name="close" size={18} />
          </button>
        </div>
      )}

      <FiltroBar cols={3}>
        <FiltroInput
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Username o host:puerto"
        />
        <FiltroSelect
          label="Estado"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
        />
      </FiltroBar>

      <Tabla
        columns={columns}
        data={filtered}
        renderCell={renderCell}
        keyField="id"
        emptyText={emptyText}
        emptyIcon={emptyIcon}
        onRowClick={(row) => navigate(`/bots/${row.id}`)}
        className={initialLoading ? "opacity-50 pointer-events-none" : ""}
      />

      <p className={`text-xs ${t.textMuted} flex items-center gap-1.5`}>
        <Icon name="autorenew" size={14} />
        La lista se actualiza automáticamente cada 5 segundos.
      </p>

      {/* Modal: confirmar eliminación */}
      <Modal
        open={!!deleteTarget}
        onClose={() => (deleting ? null : setDeleteTarget(null))}
        title="Eliminar bot"
        size="sm"
        accent="red"
      >
        <p className={`text-sm ${t.textSecondary} mb-6`}>
          ¿Seguro que quieres eliminar el bot{" "}
          <span className={`font-semibold ${t.textPrimary}`}>
            {deleteTarget?.config?.username}
          </span>
          ? Esta acción desconecta el bot y lo borra del servicio. No se puede
          deshacer.
        </p>
        <div className="flex gap-3">
          <Boton variant="secondary" fullWidth disabled={deleting} onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Boton>
          <Boton variant="danger" fullWidth loading={deleting} icon="delete" onClick={handleDeleteConfirm}>
            Eliminar
          </Boton>
        </div>
      </Modal>
    </div>
  );
};

export default Bots;
