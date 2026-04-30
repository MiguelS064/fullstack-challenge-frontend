import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

const STACK_ENDPOINTS = [
  { url: "/stack/answered", name: "answered", label: "Respuestas Contestadas vs no contestadas" },
  { url: "/stack/max-reputation", name: "mayor_rep", label: "Mayor reputación" },
  { url: "/stack/min-views", name: "menor_num_v", label: "Menor número de vistas" },
  { url: "/stack/oldest", name: "oldest", label: "Más antiguas" },
  { url: "/stack/newest", name: "newest", label: "Más recientes" },
];

const VUELOS_ENDPOINTS = [
  { url: "/vuelos/top-aeropuerto", name: "top_aeropuerto", label: "Top Aeropuerto" },
  { url: "/vuelos/top-aerolinea", name: "top_aerolineas", label: "Top Aerolíneas" },
  { url: "/vuelos/top-dia", name: "top_dias", label: "Días con más vuelos" },
  { url: "/vuelos/aerolineas-mas-2", name: "aerolineas_mas_2", label: "Aerolíneas > 2 vuelos" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("stack");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [endpoint, setEndpoint] = useState("");
  const [endpointLabel, setEndpointLabel] = useState("");

  const fetchData = async (url, name, label) => {
    setLoading(true);
    setError("");
    setEndpoint(name);
    setEndpointLabel(label);

    try {
      const res = await axios.get(`${API_BASE}${url}`);

      setData(res.data.data ?? res.data);
    } catch (err) {
      console.error("ERROR:", err);

      if (err.response) {
        setError(err.response.data.detail || "Error del servidor");
      } else {
        setError("No hay conexión con el backend");
      }

      setData(null);
    }

    setLoading(false);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setData(null);
    setEndpoint("");
    setEndpointLabel("");
    setError("");
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStackData = () => {
    if (!data) return null;

    if (endpoint === "answered" && data.answered !== undefined) {
      return (
        <>
          <p className="question-description">
            1. Obtener el número de respuestas contestadas y no contestadas
          </p>

          <div className="stats-grid">
            <div className="stat-card success">
              <div className="stat-value">{data.answered}</div>
              <div className="stat-label">Respondidas</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-value">{data.unanswered}</div>
              <div className="stat-label">Sin responder</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {data.answered + data.unanswered}
              </div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </>
      );
    }

    if (endpoint === "mayor_rep" && data.title) {
      return (
        <>
          <p className="question-description">
            2. Obtener la respuesta con mayor reputación
          </p>

          <div className="question-item">
            <div className="question-title">{data.title}</div>

            <div className="question-meta">
              <span className="question-meta-item">
                Reputación: <strong>{data.owner?.reputation}</strong>
              </span>
              <span className="question-meta-item">
                Respuestas: <strong>{data.answer_count}</strong>
              </span>
            </div>

            <br /><br />
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              Ver en StackOverflow
            </a>
          </div>
        </>
      );
    }

    if (endpoint === "menor_num_v" && data.title) {
      return (
        <>
          <p className="question-description">
            3. Obtener la respuesta con menor número de vistas
          </p>

          <div className="question-item">
            <div className="question-title">{data.title}</div>

            <div className="question-meta">
              <span className="question-meta-item">
                Vistas: <strong>{data.view_count}</strong>
              </span>
            </div>

            <br /><br />
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              Ver en StackOverflow
            </a>
          </div>
        </>
      );
    }

    if (endpoint === "oldest" && data.title) {
      return (
        <>
          <p className="question-description">
            4. Obtener la respuesta más vieja
          </p>

          <div className="question-item">
            <div className="question-title">{data.title}</div>

            <div className="question-meta">
              <span className="question-meta-item">
                Fecha: <strong>{formatDate(data.creation_date)}</strong>
              </span>
            </div>

            <br /><br />
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              Ver en StackOverflow
            </a>
          </div>
        </>
      );
    }

    if (endpoint === "newest" && data.title) {
      return (
        <>
          <p className="question-description">
            4. Obtener la respuesta más actual
          </p>

          <div className="question-item">
            <div className="question-title">{data.title}</div>

            <div className="question-meta">
              <span className="question-meta-item">
                Fecha: <strong>{formatDate(data.creation_date)}</strong>
              </span>
            </div>

            <br /><br />
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              Ver en StackOverflow
            </a>
          </div>
        </>
      );
    }

    return (
      <div className="empty-state">
        <div className="empty-state-icon">[ ]</div>
        <div className="empty-state-text">No hay información que coincida con el criterio de búsqueda</div>
      </div>
    );
  };

  const renderVuelosData = () => {
    let description = "";

    if (endpoint === "top_aeropuerto") {
      description = "1. ¿Cuál es el nombre aeropuerto que ha tenido mayor movimiento durante el año?";
    }

    if (endpoint === "top_aerolineas") {
      description = "2. ¿Cuál es el nombre aerolínea que ha realizado mayor número de vuelos durante el año?";
    }

    if (endpoint === "top_dias") {
      description = "3. ¿En qué día se han tenido mayor número de vuelos?";
    }

    if (endpoint === "aerolineas_mas_2") {
      description = "4. ¿Cuáles son las aerolíneas que tienen más de 2 vuelos por día?";
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <>
          <p className="question-description">{description}</p>
          <div className="empty-state">
            <div className="empty-state-icon">[ ]</div>
            <div className="empty-state-text">No hay información que coincida con el criterio de búsqueda</div>
          </div>
        </>
      );
    }

    const headers = Object.keys(data[0]);

    return (
      <>
        <p className="question-description">{description}</p>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((key) => (
                  <th key={key}>{key.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {headers.map((key) => (
                    <td key={key}>{String(row[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const currentEndpoints = activeTab === "stack" ? STACK_ENDPOINTS : VUELOS_ENDPOINTS;

  return (
    <div>
      <nav className="navbar-custom">
        <div className="container">
          <div className="navbar-brand">
            Data<span>Hub</span>
          </div>
        </div>
      </nav>

      <main className="main-container">
        <div className="container">
          <div className="section-tabs">
            <button
              className={`section-tab ${activeTab === "stack" ? "active" : ""}`}
              onClick={() => changeTab("stack")}
            >
              StackExchange
            </button>
            <button
              className={`section-tab ${activeTab === "vuelos" ? "active" : ""}`}
              onClick={() => changeTab("vuelos")}
            >
              Vuelos
            </button>
          </div>

          <div className="action-buttons">
            {currentEndpoints.map((ep) => (
              <button
                key={ep.name}
                className={`action-btn ${endpoint === ep.name ? "active" : ""}`}
                onClick={() => fetchData(ep.url, ep.name, ep.label)}
              >
                {ep.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="content-card">
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Cargando datos...</div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-icon">!</div>
              <div className="error-message">{error}</div>
            </div>
          )}

          {!loading && !error && data && (
            <div className="content-card">
              <div className="content-card-header">
                {endpointLabel}
              </div>
              <div className="content-card-body">
                {activeTab === "stack" ? renderStackData() : renderVuelosData()}
              </div>
            </div>
          )}

          {!loading && !error && !data && (
            <div className="content-card">
              <div className="empty-state">
                <div className="empty-state-icon">...</div>
                <div className="empty-state-text">
                  Selecciona una opcion para ver los datos
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
