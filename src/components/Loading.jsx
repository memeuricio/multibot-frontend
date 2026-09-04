import { useTheme } from "../contexts/ThemeProvider";

const Loading = ({ mensaje, fullScreen = false }) => {
  const { darkMode } = useTheme();

  const bg = darkMode ? "bg-gray-950" : "bg-slate-50";
  const textColor = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-gray-800" : "border-gray-200";
  const barBg = darkMode ? "bg-gray-800" : "bg-gray-200";
  const barFill = darkMode ? "bg-gray-400" : "bg-blue-600";

  return (
    <div
      className={`fixed inset-0 ${fullScreen ? "" : "md:left-64"} z-[60] flex flex-col items-center justify-center ${bg}`}
    >
      {/* Logo */}
      <div className={`mb-10 p-6 rounded-full border ${divider}`}>
        <img
          src="/mc_logo.svg"
          alt="Logo"
          className="w-20 h-20 object-contain opacity-80"
        />
      </div>

      {/* Barra de progreso indeterminada */}
      <div className={`w-64 h-0.5 rounded-full overflow-hidden ${barBg}`}>
        <div
          className={`h-full w-1/3 rounded-full ${barFill} animate-loading-bar`}
        />
      </div>

      {/* Mensaje */}
      {mensaje && (
        <p
          className={`mt-8 text-sm font-medium tracking-widest uppercase ${textColor}`}
        >
          {mensaje}
        </p>
      )}

      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(500%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
