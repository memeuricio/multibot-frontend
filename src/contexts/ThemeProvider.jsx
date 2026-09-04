import { useState, useContext, createContext, useEffect } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
