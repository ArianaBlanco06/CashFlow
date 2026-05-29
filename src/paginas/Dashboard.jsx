import React, { useState } from "react";
import { Link } from "react-router-dom";


const Dashboard = ({ expenses }) => {
  const [metaMensual, setMetaMensual] = useState(500);

  // =========================
  // FECHA ACTUAL
  // =========================

  const hoy = new Date();

  const fechaActual = hoy.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const diaMes = hoy.getDate();

  // =========================
  // KPIS
  // =========================

  const totalGastado = expenses.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  const gastosPendientes = expenses.filter(
    (gasto) => gasto.estado === "Pendiente"
  );

  const categoriasActivas = [
    ...new Set(expenses.map((gasto) => gasto.categoria)),
  ];

  const promedioDiario = (totalGastado / diaMes).toFixed(2);

  // =========================
  // DÍA CON MAYOR GASTO
  // =========================

  const gastosPorDia = {};

  expenses.forEach((gasto) => {
    if (!gastosPorDia[gasto.fecha]) {
      gastosPorDia[gasto.fecha] = 0;
    }

    gastosPorDia[gasto.fecha] += gasto.monto;
  });

  let mayorGastoFecha = "Sin datos";
  let mayorGastoMonto = 0;

  for (let fecha in gastosPorDia) {
    if (gastosPorDia[fecha] > mayorGastoMonto) {
      mayorGastoMonto = gastosPorDia[fecha];
      mayorGastoFecha = fecha;
    }
  }

  // =========================
  // META MENSUAL
  // =========================

  const disponible = metaMensual - totalGastado;

  const porcentajeGastado = Math.min(
    ((totalGastado / metaMensual) * 100).toFixed(1),
    100
  );

  // =========================
  // MENSAJE DINÁMICO
  // =========================

  let mensaje = "";

  if (porcentajeGastado < 60) {
    mensaje = "Vas por buen camino este mes 💪";
  } else if (porcentajeGastado <= 100) {
    mensaje = "Tienes gastos sin resolver ⚠️";
  } else {
    mensaje = "Cuidado, superaste tu presupuesto 🚨";
  }

  // =========================
  // COLOR SEMÁFORO
  // =========================

  let colorSemaforo = "#22c55e";

  if (porcentajeGastado >= 60 && porcentajeGastado <= 90) {
    colorSemaforo = "#f59e0b";
  }

  if (porcentajeGastado > 90) {
    colorSemaforo = "#ef4444";
  }

  // =========================
  // ACTIVIDAD RECIENTE
  // =========================

  const recientes = [...expenses]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  // =========================
  // RESUMEN POR CATEGORÍA
  // =========================

  const categorias = {};

  expenses.forEach((gasto) => {
    if (!categorias[gasto.categoria]) {
      categorias[gasto.categoria] = {
        total: 0,
        cantidad: 0,
      };
    }

    categorias[gasto.categoria].total += gasto.monto;
    categorias[gasto.categoria].cantidad += 1;
  });

  // =========================
  // RECOMENDACIONES
  // =========================

  const recomendaciones = [];

  if (gastosPendientes.length > 2) {
    recomendaciones.push({
      icono: "⚠️",
      texto: `Tienes ${gastosPendientes.length} gastos pendientes por resolver`,
      color: "orange",
      link: "/gastos",
    });
  }

  for (let categoria in categorias) {
    if (categorias[categoria].total > totalGastado * 0.5) {
      recomendaciones.push({
        icono: "📊",
        texto: `${categoria} consume más de la mitad de tu presupuesto`,
        color: "red",
        link: "/reportes",
      });
    }
  }

  const proyeccionMensual = promedioDiario * 30;

  if (proyeccionMensual > metaMensual) {
    recomendaciones.push({
      icono: "🚨",
      texto: `Tu ritmo de gasto proyecta S/ ${proyeccionMensual.toFixed(
        2
      )} al final del mes`,
      color: "crimson",
      link: "/dashboard",
    });
  }

  // =========================
  // FUNCIÓN PARA TIEMPO
  // =========================

  const tiempoTranscurrido = (fecha) => {
    const fechaGasto = new Date(fecha);
    const diferencia = hoy - fechaGasto;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (dias === 0) return "Hoy";
    if (dias === 1) return "Ayer";

    return `Hace ${dias} días`;
  };

  return (
    <div className="dashboard-container">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard Financiero</h1>
          <p className="fecha-texto">{fechaActual}</p>
          <p className="dias-texto">Van {diaMes} días del mes</p>
        </div>

        <div className="mensaje-financiero">
          <h3>{mensaje}</h3>
        </div>
      </div>

      {/* ========================= */}
      {/* KPIS */}
      {/* ========================= */}

      <div className="kpis-grid">
        <div className="kpi-card">
          <span className="kpi-icon">💰</span>
          <h2>S/ {totalGastado.toFixed(2)}</h2>
          <p>Total gastado</p>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">⚠️</span>
          <h2>{gastosPendientes.length}</h2>
          <p>Gastos pendientes</p>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📂</span>
          <h2>{categoriasActivas.length}</h2>
          <p>Categorías activas</p>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📅</span>
          <h2>S/ {mayorGastoMonto.toFixed(2)}</h2>
          <p>Día con mayor gasto</p>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📈</span>
          <h2>S/ {promedioDiario}</h2>
          <p>Promedio diario</p>
        </div>
      </div>

      {/* ========================= */}
      {/* SEMÁFORO FINANCIERO */}
      {/* ========================= */}

      <div className="dashboard-card">
        <h2>Semáforo de Salud Financiera</h2>

        <div className="barra-container">
          <div
            className="barra-progreso"
            style={{
              width: `${porcentajeGastado}%`,
              backgroundColor: colorSemaforo,
            }}
          >
            {porcentajeGastado}%
          </div>
        </div>

        <p className="barra-descripcion">
          Has utilizado el {porcentajeGastado}% de tu presupuesto mensual.
        </p>
      </div>

      {/* ========================= */}
      {/* META + ACTIVIDAD */}
      {/* ========================= */}

      <div className="dashboard-grid-2">
        {/* META */}

        <div className="dashboard-card">
          <h2>Meta de Ahorro Mensual</h2>

          <label>¿Cuál es tu presupuesto máximo este mes?</label>

          <input
            type="number"
            className="meta-input"
            value={metaMensual}
            onChange={(e) => setMetaMensual(Number(e.target.value))}
          />

          <div className="meta-info">
            <p>
              <strong>Gastado:</strong> S/ {totalGastado.toFixed(2)}
            </p>

            <p>
              <strong>Meta:</strong> S/ {metaMensual}
            </p>

            <p
              style={{
                color: disponible < 0 ? "red" : "#22c55e",
                fontWeight: "bold",
              }}
            >
              Disponible: S/ {disponible.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}

        <div className="dashboard-card">
          <h2>Actividad Reciente</h2>

          <div className="actividad-lista">
            {recientes.map((gasto) => (
              <div
                className={`actividad-item ${
                  gasto.estado === "Pagado"
                    ? "actividad-pagado"
                    : "actividad-pendiente"
                }`}
                key={gasto.id}
              >
                <div>
                  <h4>{gasto.descripcion}</h4>
                  <p>{gasto.categoria}</p>
                  <span>{tiempoTranscurrido(gasto.fecha)}</span>
                </div>

                <div className="actividad-derecha">
                  <strong>S/ {gasto.monto}</strong>
                  <p>{gasto.estado}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* RECOMENDACIONES */}
      {/* ========================= */}

      <div className="dashboard-card">
        <h2>Recomendaciones Inteligentes</h2>

        <div className="recomendaciones-grid">
          {recomendaciones.length > 0 ? (
            recomendaciones.map((rec, index) => (
              <Link
                key={index}
                to={rec.link}
                className="recomendacion-card"
                style={{ borderLeft: `5px solid ${rec.color}` }}
              >
                <span className="recomendacion-icono">{rec.icono}</span>
                <p>{rec.texto}</p>
              </Link>
            ))
          ) : (
            <p>No hay recomendaciones por ahora 🎉</p>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* CATEGORÍAS */}
      {/* ========================= */}

      <div className="dashboard-card">
        <h2>Resumen por Categoría</h2>

        <div className="categorias-lista">
          {Object.entries(categorias).map(([categoria, data]) => {
            const porcentaje = (
              (data.total / totalGastado) *
              100
            ).toFixed(1);

            return (
              <div className="categoria-card" key={categoria}>
                <div className="categoria-top">
                  <h3>{categoria}</h3>
                  <span>{porcentaje}%</span>
                </div>

                <div className="barra-categoria-bg">
                  <div
                    className="barra-categoria"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                <div className="categoria-bottom">
                  <p>S/ {data.total.toFixed(2)}</p>
                  <p>{data.cantidad} gastos</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================= */}
      {/* ACCESOS DIRECTOS */}
      {/* ========================= */}

      <div className="dashboard-card">
        <h2>Accesos Directos</h2>

        <div className="acciones-grid">
          <Link to="/Expenses" className="accion-btn">
            ➕ Registrar nuevo gasto
          </Link>

          <Link to="/reportes" className="accion-btn">
            📊 Ver mis reportes
          </Link>

          <Link to="/reporteFiltros" className="accion-btn">
            ⏰ Configurar recordatorio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
