import { useNavigate } from "react-router-dom";
import Boton from "../../UI/Boton";
import Contenedor from "../../UI/Contenedor";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen w-full p-6">
      <Contenedor
        padding="lg"
        rounded="xl"
        shadow="md"
        className="w-full max-w-lg text-center"
      >

        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Página no encontrada
        </h1>

        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          La ruta a la que intentas acceder no existe o ha sido movida.
        </p>

        <div className="mt-8 flex justify-center">
          <Boton
            variant="primary"
            size="lg"
            icon="home"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </Boton>
        </div>
      </Contenedor>
    </div>
  );
};

export default NotFound;
