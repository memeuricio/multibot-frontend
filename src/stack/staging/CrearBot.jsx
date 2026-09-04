// LIBRERIAS
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// CONTEXTOS
import { useTheme } from "../../contexts/ThemeProvider";
import { uiTokens } from "../../contexts/ConfigProvider";

// API
import { createBot } from "../../api/bots.api";

// UI
import Titulo from "../../UI/Titulo";
import Contenedor from "../../UI/Contenedor";
import Boton from "../../UI/Boton";
import Icon from "../../components/Icon";

const USERNAME_REGEX = /^[A-Za-z0-9_]{1,16}$/;

const INITIAL_FORM = {
  host: "",
  port: 25565,
  username: "",
  version: "26.2",
  viewDistance: 8,
};

const CrearBot = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const t = darkMode ? uiTokens.dark : uiTokens.light;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const next = {};

    if (!form.host.trim()) next.host = "El host es obligatorio";
    else if (/\s/.test(form.host)) next.host = "El host no debe contener espacios";

    if (!form.username.trim()) next.username = "El nombre es obligatorio";
    else if (!USERNAME_REGEX.test(form.username.trim()))
      next.username = "1-16 caracteres: letras, números y guión bajo";

    const port = Number(form.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
      next.port = "Puerto entre 1 y 65535";

    const vd = Number(form.viewDistance);
    if (!Number.isInteger(vd) || vd < 2 || vd > 32)
      next.viewDistance = "Distancia de vista entre 2 y 32";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setCreating(true);
    try {
      const bot = await createBot({
        host: form.host.trim(),
        port: Number(form.port),
        username: form.username.trim(),
        version: form.version,
        viewDistance: Number(form.viewDistance),
      });
      navigate(`/bots/${bot.id}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const inputClass = (name) => `
    w-full px-3 py-2 text-sm rounded-md border
    ${t.cardBg} ${t.textPrimary}
    ${errors[name] ? "border-red-500" : t.border}
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    placeholder:${t.textMuted}
    transition-colors
  `;

  const labelClass = `text-xs font-medium ${t.textSecondary}`;

  const hintBox = darkMode
    ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
    : "bg-emerald-50 border-emerald-200 text-emerald-800";

  const errorBox = darkMode
    ? "bg-red-950/60 border-red-800 text-red-300"
    : "bg-red-100 border-red-400 text-red-700";

  return (
    <div className="p-4 md:p-6 space-y-5">
      <Titulo
        titulo="Crear bot"
        subtitulo="Registra un nuevo bot y conéctalo al servidor"
        icon="person_add"
        actions={
          <Boton variant="secondary" icon="arrow_back" onClick={() => navigate("/bots")}>
            Volver
          </Boton>
        }
      />

      <Contenedor className="max-w-2xl mx-auto" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {serverError && (
            <div className={`border rounded-lg px-4 py-3 text-sm ${errorBox}`}>
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="host">
              Host del servidor *
            </label>
            <input
              id="host"
              name="host"
              type="text"
              value={form.host}
              onChange={handleChange}
              placeholder="Ej: 35.225.251.194 o mi-servidor.example.com"
              autoComplete="off"
              spellCheck="false"
              className={inputClass("host")}
            />
            {errors.host && <p className="text-xs text-red-500">{errors.host}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="port">
                Puerto
              </label>
              <input
                id="port"
                name="port"
                type="number"
                min={1}
                max={65535}
                value={form.port}
                onChange={handleChange}
                className={inputClass("port")}
              />
              {errors.port && <p className="text-xs text-red-500">{errors.port}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="version">
                Versión de Minecraft
              </label>
              <select
                id="version"
                name="version"
                value={form.version}
                onChange={handleChange}
                className={inputClass("version")}
              >
                <option value="26.2">26.2 (recomendada)</option>
                <option value="26.1">26.1</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="username">
                Nombre del bot *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                maxLength={16}
                value={form.username}
                onChange={handleChange}
                placeholder="Ej: MinerBot01"
                autoComplete="off"
                spellCheck="false"
                className={inputClass("username")}
              />
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="viewDistance">
                Distancia de vista
              </label>
              <input
                id="viewDistance"
                name="viewDistance"
                type="number"
                min={2}
                max={32}
                value={form.viewDistance}
                onChange={handleChange}
                className={inputClass("viewDistance")}
              />
              {errors.viewDistance && (
                <p className="text-xs text-red-500">{errors.viewDistance}</p>
              )}
              <p className={`text-[10px] ${t.textMuted}`}>
                Menor valor = menos RAM usada por el bot
              </p>
            </div>
          </div>

          {/* Ayudas */}
          <div className={`border rounded-lg px-4 py-3 text-xs space-y-1.5 ${hintBox}`}>
            <p className="flex items-start gap-2">
              <Icon name="info" size={16} className="shrink-0 mt-0.5" />
              El nombre debe ser único por servidor: el servidor rechaza
              duplicados o suplantación de jugadores.
            </p>
            <p className="flex items-start gap-2">
              <Icon name="dns" size={16} className="shrink-0 mt-0.5" />
              Si el servicio de bots corre en Docker en la misma PC que el
              servidor, usa <span className="font-mono">host.docker.internal</span> en
              lugar de <span className="font-mono">localhost</span>.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <Boton variant="secondary" fullWidth onClick={() => navigate("/bots")} disabled={creating}>
              Cancelar
            </Boton>
            <Boton type="submit" variant="success" fullWidth loading={creating} icon="person_add">
              {creating ? "Creando..." : "Crear bot"}
            </Boton>
          </div>
        </form>
      </Contenedor>
    </div>
  );
};

export default CrearBot;
