import { Navigate, useLocation } from "react-router-dom";
import { useSesionContext } from "../../contexts/SesionProvider";
import Loading from "../../components/Loading";

// Protege rutas que requieren sesión activa (token X-API-Key válido)
export default function ProtectedRoute({ children }) {
  const { token, isLoading } = useSesionContext();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullScreen mensaje="Validando sesión" />;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
