// LIBRERIAS
import { lazy, Suspense } from "react";
import { Route, Routes, Outlet } from "react-router-dom";

// CONTEXTOS
import { SesionProvider } from "./contexts/SesionProvider";
import { ThemeProvider } from "./contexts/ThemeProvider.jsx";

// SIDEBAR
import Sidebar from "./components/SideBar";

// COMMON
import Inicio from "./stack/common/Inicio";
import Configuraciones from "./stack/common/Configuraciones";
import NotFound from "./stack/common/NotFound";
import ProtectedRoute from "./stack/common/ProtectedRoute";

// STAGING
import Bots from "./stack/staging/Bots";
import CrearBot from "./stack/staging/CrearBot";
import DetalleBot from "./stack/staging/DetalleBot";
import Mapa from "./stack/staging/Mapa";

// Login se carga diferido (three.js del fondo 3D queda en su propio chunk)
const Login = lazy(() => import("./stack/common/Login"));

const WithSidebar = () => (
  <ProtectedRoute>
    <Sidebar>
      <Outlet />
    </Sidebar>
  </ProtectedRoute>
);

//MAIN FUCTION

function App() {
  return (
    <ThemeProvider>
      <SesionProvider>
        <AppContent />
      </SesionProvider>
    </ThemeProvider>
  );
}


function AppContent() {
  return (
    <>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Suspense fallback={null}>
              <Login />
            </Suspense>
          }
        />

        {/* RUTAS ACCESIBLES POR TODO USUARIO AUTENTICADO */}
        <Route element={<WithSidebar />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/dashboard" element={<Bots />} />
          <Route path="/bots/crear" element={<CrearBot />} />
          <Route path="/bots/:id" element={<DetalleBot />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/configuraciones" element={<Configuraciones />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
