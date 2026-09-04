import { useState, useContext, createContext, useEffect, useMemo, useCallback } from "react";
import { loginBotApi, logoutBotApi, getToken } from "../api/auth.api";

// Contexto de sesión basado en token (X-API-Key).
// El token se valida contra la API al iniciar sesión; cualquier 401
// posterior lo limpia automáticamente (interceptor en botAxiosConfig).

// eslint-disable-next-line react-refresh/only-export-components
export const SesionContext = createContext({
  token: null,
  isLoading: false,
  login: async () => false,
  logout: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useSesionContext() {
  return useContext(SesionContext);
}

export function SesionProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sincroniza por si el token fue eliminado por el interceptor en otra pestaña
    const syncToken = () => setToken(getToken());
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const login = useCallback(async (newToken) => {
    setIsLoading(true);
    try {
      const ok = await loginBotApi(newToken);
      if (ok) {
        localStorage.setItem("botapi_key", newToken);
        setToken(newToken);
      }
      return ok;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutBotApi();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, isLoading, login, logout }),
    [token, isLoading, login, logout],
  );

  return (
    <SesionContext.Provider value={value}>{children}</SesionContext.Provider>
  );
}
