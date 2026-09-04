import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SesionContext } from "../../contexts/SesionProvider";
import { APP_NAME, APP_SUBTITLE, MC_SERVER } from "../../contexts/ConfigProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import Icon from "../../components/Icon";
import SistemaPlanetario from "../../components/SistemaPlanetario";

function LoginForm({
  subtle,
  title,
  input,
  token,
  error,
  isLoading,
  showToken,
  handleChange,
  toggleVisibility,
  handleSubmit,
}) {
  return (
    <div className="px-7 py-8">
      <div className="mb-8 flex flex-col items-center">
        <img
          src="/mc_logo.svg"
          alt="MineGo"
          className="h-16 w-16 object-contain mb-4"
        />
        <p
          className={`text-xs text-center uppercase tracking-widest font-medium mb-1 ${subtle}`}
        >
          {APP_SUBTITLE}
        </p>
        <h1 className={`text-2xl text-center font-semibold ${title}`}>
          Acceso al panel
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="border border-red-200 bg-red-50 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="text-center">
          <label
            htmlFor="token"
            className={`block text-xs uppercase tracking-widest font-medium mb-2 ${subtle}`}
          >
            Token de acceso
          </label>
          <div className="relative w-2xs mx-auto">
            <input
              autoFocus
              type={showToken ? "text" : "password"}
              id="token"
              name="token"
              value={token}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Pega tu token de API"
              required
              autoComplete="off"
              spellCheck="false"
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition ${input}`}
            />
            <button
              type="button"
              onClick={toggleVisibility}
              tabIndex={-1}
              aria-label={showToken ? "Ocultar token" : "Mostrar token"}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${subtle} hover:opacity-80 cursor-pointer`}
            >
              <Icon name={showToken ? "visibility_off" : "visibility"} size={18} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-1/2 mx-auto flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 mt-2 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Validando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>
      </form>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(SesionContext);
  const { darkMode, setDarkMode } = useTheme();

  // Fija la altura real del viewport como variable CSS (evita scroll en mobile)
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--real-vh",
        `${window.innerHeight}px`,
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  const handleChange = (e) => {
    setToken(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const ok = await login(token.trim());
      if (ok) {
        navigate("/");
      } else {
        setError("Token incorrecto o servicio no disponible");
      }
    } catch {
      setError("No se pudo conectar con el servicio de bots");
    } finally {
      setIsLoading(false);
    }
  };

  const card = darkMode
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";
  const title = darkMode ? "text-white" : "text-gray-900";
  const subtle = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-800" : "border-gray-200";
  const input = darkMode
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-gray-600"
    : "bg-slate-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-300";
  const btnToggle = darkMode
    ? "text-gray-400 hover:text-white hover:bg-gray-800"
    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100";

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        height: "var(--real-vh, 100dvh)",
        backgroundColor: darkMode ? "#030712" : "#f1f5f9",
      }}
    >
      {/* Header */}
      <div
        className={`border-b ${divider} px-8 py-5 flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <img src="/mc_logo.svg" alt="Logo" className="h-7 w-7 object-contain" />
          <span
            className={`text-xs font-semibold tracking-wide uppercase ${subtle}`}
          >
            {APP_NAME} · {MC_SERVER.apiUrl}
          </span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Modo claro" : "Modo oscuro"}
          className={`p-2 rounded-lg transition-colors duration-150 ${btnToggle}`}
        >
          <Icon name={darkMode ? "light_mode" : "dark_mode"} size={20} />
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Fondo 3D — estrellas */}
        <div className="absolute inset-0 z-0">
          <SistemaPlanetario />
        </div>

        {/* Overlay sutil */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: darkMode
              ? "rgba(3,7,18,0.45)"
              : "rgba(241,245,249,0.35)",
          }}
        />

        {/* Card de login — centrada */}
        <div
          className={`relative z-20 w-full max-w-sm border rounded-2xl shadow-lg ${card}`}
        >
          <LoginForm
            subtle={subtle}
            title={title}
            input={input}
            token={token}
            error={error}
            isLoading={isLoading}
            showToken={showToken}
            handleChange={handleChange}
            toggleVisibility={() => setShowToken((v) => !v)}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t ${divider} px-8 py-4`}>
        <p className={`text-xs ${subtle}`}>
          © {new Date().getFullYear()} {APP_NAME} · Administración de servidor
          de Minecraft
        </p>
      </div>
    </div>
  );
}

export default Login;
