import { useState } from 'react';
import { mockExpenses } from '../data/mock.Expenses';

const Reportes = () => {
  const [expenses] = useState(mockExpenses);

  // --- Cálculos generales ---
  const totalGastos = expenses.reduce((acc, e) => acc + e.monto, 0);
  const cantidadGastos = expenses.length;
  const promedioGasto = cantidadGastos > 0
    ? (totalGastos / cantidadGastos).toFixed(2)
    : 0;

  // --- Gasto máximo y mínimo ---
  const gastoMaximo = expenses.reduce((max, e) => e.monto > max.monto ? e : max, expenses[0]);
  const gastoMinimo = expenses.reduce((min, e) => e.monto < min.monto ? e : min, expenses[0]);

  // --- Agrupación por categoría usando reduce ---
  const porCategoria = expenses.reduce((acc, e) => {
    if (!acc[e.categoria]) {
      acc[e.categoria] = { total: 0, cantidad: 0 };
    }
    acc[e.categoria].total += e.monto;
    acc[e.categoria].cantidad += 1;
    return acc;
  }, {});

  // Convertir el objeto a array para poder usar .map()
  const categorias = Object.keys(porCategoria).map(nombre => ({
    nombre,
    total: porCategoria[nombre].total,
    cantidad: porCategoria[nombre].cantidad,
    promedio: (porCategoria[nombre].total / porCategoria[nombre].cantidad).toFixed(2),
    porcentaje: ((porCategoria[nombre].total / totalGastos) * 100).toFixed(1)
  }));

  // --- Categoría más cara ---
  const categoriaMasCara = categorias.reduce(
    (max, c) => c.total > max.total ? c : max,
    categorias[0]
  );

  return (
    <div>
      <h2>Reportes de Gastos</h2>

      {/* ── Tarjetas generales ── */}
      <div className="stats-row">
        <div className="stats-card">
          <h3>Total Gastos</h3>
          <p>S/ {totalGastos.toFixed(2)}</p>
        </div>
        <div className="stats-card">
          <h3>Cantidad de Gastos</h3>
          <p>{cantidadGastos}</p>
        </div>
        <div className="stats-card">
          <h3>Promedio por Gasto</h3>
          <p>S/ {promedioGasto}</p>
        </div>
      </div>

      {/* ── Tarjetas de máximo y mínimo ── */}
      <div className="stats-row" style={{ marginTop: '1rem' }}>
        <div className="stats-card stats-card--max">
          <h3>💸 Gasto más alto</h3>
          <p>S/ {gastoMaximo.monto.toFixed(2)}</p>
          <span className="stats-detalle">{gastoMaximo.descripcion} — {gastoMaximo.categoria}</span>
        </div>
        <div className="stats-card stats-card--min">
          <h3>✅ Gasto más bajo</h3>
          <p>S/ {gastoMinimo.monto.toFixed(2)}</p>
          <span className="stats-detalle">{gastoMinimo.descripcion} — {gastoMinimo.categoria}</span>
        </div>
        <div className="stats-card stats-card--top">
          <h3>🏆 Categoría más cara</h3>
          <p>{categoriaMasCara.nombre}</p>
          <span className="stats-detalle">S/ {categoriaMasCara.total.toFixed(2)} en total</span>
        </div>
      </div>

      {/* ── Tabla por categorías ── */}
      <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Resumen por Categoría</h3>
      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>N° Gastos</th>
            <th>Total</th>
            <th>Promedio</th>
            <th>% del Total</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.nombre} className={cat.nombre === categoriaMasCara.nombre ? 'fila-destacada' : ''}>
              <td><strong>{cat.nombre}</strong></td>
              <td>{cat.cantidad}</td>
              <td>S/ {cat.total.toFixed(2)}</td>
              <td>S/ {cat.promedio}</td>
              <td>
                <div className="barra-contenedor">
                  <div
                    className="barra-progreso"
                    style={{ width: `${cat.porcentaje}%` }}
                  ></div>
                  <span className="barra-label">{cat.porcentaje}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Tabla detalle completo ── */}
      <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Detalle de Gastos</h3>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.descripcion}</td>
              <td>{exp.categoria}</td>
              <td>S/ {exp.monto}</td>
              <td>{exp.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reportes;