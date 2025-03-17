import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetalleJuegos = () => {
  const { id } = useParams(); // Obtiene el ID del juego desde la URL
  const [juego, setJuego] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  useEffect(() => {
    const fetchJuego = async () => {
      try {
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();
        setJuego(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJuego();
  }, [id, API_KEY]);

  if (error) return <p className="text-red-500 text-center mt-5">Error: {error}</p>;
  if (!juego) return <p className="text-white text-center mt-5">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-5">
      {/* Título del juego */}
      <h1 className="text-3xl font-bold mb-4 text-center">{juego.name}</h1>

      {/* Imagen de fondo del juego */}
      <img 
        src={juego.background_image} 
        alt={juego.name} 
        className="w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg"
      />

      {/* Información del juego */}
      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl">
        <p className="text-lg"><strong>🎮 Géneros:</strong> {juego.genres.map(g => g.name).join(", ")}</p>
        <p className="text-lg"><strong>⭐ Puntuación:</strong> {juego.metacritic || "N/A"}</p>
        <p className="text-lg"><strong>🖥 Plataformas:</strong> {juego.platforms.map(p => p.platform.name).join(", ")}</p>
        <p className="text-lg"><strong>📅 Año de lanzamiento:</strong> {juego.released}</p>
        <p className="mt-3"><strong>📝 Descripción:</strong> {juego.description_raw || "Sin descripción"}</p>
      </div>

      {/* Tráiler del juego (si está disponible) */}
      {juego.clip && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-2 text-center">🎬 Tráiler</h2>
          <video controls className="w-full rounded-lg shadow-lg">
            <source src={juego.clip.clip} type="video/mp4" />
            Tu navegador no soporta videos.
          </video>
        </div>
      )}
    </div>
  );
};

export default DetalleJuegos;