import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css"; 

const Inicio = () => {
  // Estados para los datos y filtros
  const [juegos, setJuegos] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    year: "",
    genre: "",
    platform: "",
    tag: "",
    developer: "",
  });

  const [opcionesFiltros, setOpcionesFiltros] = useState({
    genres: [],
    platforms: [],
    tags: [],
    developers: [],
  });

  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

  // Obtener opciones para los filtros
  const fetchOpcionesFiltros = useCallback(async () => {
    try {
      const endpoints = [
        "genres",
        "platforms",
        "tags",
        "developers",
      ].map(endpoint => fetch(`https://api.rawg.io/api/${endpoint}?key=${API_KEY}`).then(res => res.json()));
      
      const [genresRes, platformsRes, tagsRes, developersRes] = await Promise.all(endpoints);

      setOpcionesFiltros({
        genres: genresRes.results || [],
        platforms: platformsRes.results || [],
        tags: tagsRes.results || [],
        developers: developersRes.results || [],
      });
    } catch (error) {
      console.error("Error al obtener opciones de filtros:", error);
    }
  }, [API_KEY]);

  // Obtener juegos con filtros aplicados
  const fetchJuegos = useCallback(async () => {
    try {
      let API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic`;

      if (busqueda) API_URL += `&search=${busqueda}`;
      if (filtros.year) API_URL += `&dates=${filtros.year}-01-01,${filtros.year}-12-31`;
      if (filtros.genre) API_URL += `&genres=${filtros.genre}`;
      if (filtros.platform) API_URL += `&platforms=${filtros.platform}`;
      if (filtros.tag) API_URL += `&tags=${filtros.tag}`;
      if (filtros.developer) API_URL += `&developers=${filtros.developer}`;

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los datos");
      
      const data = await response.json();
      setJuegos(data.results);
    } catch (error) {
      setError(error.message);
    }
  }, [API_KEY, busqueda, filtros]);

  useEffect(() => {
    fetchJuegos();
  }, [fetchJuegos]);

  useEffect(() => {
    fetchOpcionesFiltros();
  }, [fetchOpcionesFiltros]);

  // Manejadores de eventos
  const handleChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
  const handleBusqueda = (e) => setBusqueda(e.target.value);

  return (
    <div className="inicio-container">
      {/* Sidebar de filtros */}
      <aside className="sidebar">
        <h3>Filtrar por:</h3>
        <label>
          Año:
          <input type="number" name="year" value={filtros.year} onChange={handleChange} />
        </label>
        <label>
          Género:
          <select name="genre" value={filtros.genre} onChange={handleChange}>
            <option value="">Todos</option>
            {opcionesFiltros.genres.map(g => <option key={g.id} value={g.slug}>{g.name}</option>)}
          </select>
        </label>
        <label>
          Plataforma:
          <select name="platform" value={filtros.platform} onChange={handleChange}>
            <option value="">Todas</option>
            {opcionesFiltros.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>
          Tag:
          <select name="tag" value={filtros.tag} onChange={handleChange}>
            <option value="">Todos</option>
            {opcionesFiltros.tags.map(t => <option key={t.id} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
        <label>
          Desarrolladora:
          <select name="developer" value={filtros.developer} onChange={handleChange}>
            <option value="">Todas</option>
            {opcionesFiltros.developers.map(d => <option key={d.id} value={d.slug}>{d.name}</option>)}
          </select>
        </label>
      </aside>

      {/* Contenido principal */}
      <main className="contenido">
        <h1>Juegos Más Puntuados</h1>
        {error && <p className="error">Error: {error}</p>}
        <div className="busqueda">
          <input type="text" value={busqueda} onChange={handleBusqueda} placeholder="Buscar juego..." />
        </div>
        <div className="lista-juegos">
          {juegos.map(juego => (
            <div key={juego.id} className="juego-card" onClick={() => navigate(`/juego/${juego.id}`)}>
              <img src={juego.background_image} alt={juego.name} />
              <h2>{juego.name}</h2>
              <p>Puntuación: {juego.metacritic}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Inicio;