import { Link } from 'react-router-dom';
import '../estilos/reportes.css';

const Reportes = ({ expenses, metaMensual }) => {

  const totalGastos    = expenses.reduce((acc, e) => acc + e.monto, 0);
  const disponible     = metaMensual - totalGastos;
  const porcentajeMeta = metaMensual > 0
    ? Math.min(((totalGastos / metaMensual) * 100), 100).toFixed(1)
    : 0;

  let colorMeta = '#52b788';
  if (porcentajeMeta >= 60 && porcentajeMeta < 90) colorMeta = '#f4a261';
  if (porcentajeMeta >= 90) colorMeta = '#e05252';


  if (expenses.length === 0) {
    return (
      <div>
        <h2>📈 Reportes de Gastos</h2>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Resumen general de tus movimientos registrados.
        </p>

        {/* Meta en modo solo lectura */}
        <div className="meta-seccion">
          <h3>🎯 Meta de Ahorro Mensual</h3>
          <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem' }}>
            Configura tu presupuesto desde el <Link to="/dashboard" style={{ color: 'var(--color-principal)', fontWeight: '600' }}>Dashboard</Link>.
          </p>
          <div className="meta-resumen">
            <div className="meta-resumen-item">
              <span>Gastado</span>
              <strong>S/ 0.00</strong>
            </div>
            <div className="meta-resumen-item">
              <span>Meta</span>
              <strong>S/ {metaMensual}</strong>
            </div>
            <div className="meta-resumen-item">
              <span>Disponible</span>
              <strong style={{ color: '#52b788' }}>S/ {metaMensual}</strong>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#aaa', padding: '2rem', background: '#f9f9f9', borderRadius: '10px' }}>
          <p style={{ fontSize: '1.2rem' }}>📭</p>
          <p>Aún no tienes gastos registrados.</p>
          <p style={{ fontSize: '0.85rem' }}>
            Ve a <Link to="/expenses" style={{ color: 'var(--color-principal)', fontWeight: '600' }}>Gastos</Link> para agregar tu primer registro.
          </p>
        </div>
      </div>
    );
  }


  const cantidadGastos = expenses.length;
  const promedioGasto  = (totalGastos / cantidadGastos).toFixed(2);
  const gastoMaximo    = expenses.reduce((max, e) => e.monto > max.monto ? e : max, expenses[0]);
  const gastoMinimo    = expenses.reduce((min, e) => e.monto < min.monto ? e : min, expenses[0]);

 
  const porCategoria = expenses.reduce((acc, e) => {
    if (!acc[e.categoria]) acc[e.categoria] = { total: 0, cantidad: 0 };
    acc[e.categoria].total    += e.monto;
    acc[e.categoria].cantidad += 1;
    return acc;
  }, {});

  const categorias = Object.keys(porCategoria).map(nombre => ({
    nombre,
    total:      porCategoria[nombre].total,
    cantidad:   porCategoria[nombre].cantidad,
    promedio:   (porCategoria[nombre].total / porCategoria[nombre].cantidad).toFixed(2),
    porcentaje: ((porCategoria[nombre].total / totalGastos) * 100).toFixed(1),
  }));

  const categoriaMasCara = categorias.reduce(
    (max, c) => c.total > max.total ? c : max, categorias[0]
  );

  return (
    <div>
      <h2>📈 Reportes de Gastos</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Resumen general de tus movimientos registrados.
      </p>

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

      {/* ── Máximo, mínimo, categoría más cara ── */}
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

      {/* ── META — distribución por categoría ── */}
      <div className="meta-seccion">
        <h3>🎯 Distribución de tu Meta por Categoría</h3>
        <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.2rem' }}>
          Así se distribuye tu presupuesto de <strong>S/ {metaMensual}</strong> entre tus categorías.
          Configúralo desde el{' '}
          <Link to="/dashboard" style={{ color: 'var(--color-principal)', fontWeight: '600' }}>
            Dashboard
          </Link>.
        </p>

        <div className="meta-categorias-grid">
          {categorias.map(cat => {
            const porcentajeDeMeta = metaMensual > 0
              ? Math.min(((cat.total / metaMensual) * 100), 100).toFixed(1)
              : 0;
            let color = '#52b788';
            if (porcentajeDeMeta >= 40 && porcentajeDeMeta < 70) color = '#f4a261';
            if (porcentajeDeMeta >= 70) color = '#e05252';

            return (
              <div key={cat.nombre} className="meta-cat-card">
                <div className="meta-cat-header">
                  <span className="meta-cat-nombre">{cat.nombre}</span>
                  <span className="meta-cat-monto" style={{ color }}>
                    S/ {cat.total.toFixed(2)}
                  </span>
                </div>
                <div className="meta-barra-bg">
                  <div
                    className="meta-barra-fill"
                    style={{ width: `${porcentajeDeMeta}%`, backgroundColor: color }}
                  />
                </div>
                <div className="meta-cat-footer">
                  <span style={{ color, fontWeight: '600', fontSize: '0.82rem' }}>
                    {porcentajeDeMeta}% de tu meta
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
                    {cat.cantidad} gasto{cat.cantidad > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })}
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
                  <div className="barra-progreso" style={{ width: `${cat.porcentaje}%` }}></div>
                  <span className="barra-label">{cat.porcentaje}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Detalle completo ── */}
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
              <td>S/ {exp.monto.toFixed(2)}</td>
              <td>{exp.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reportes;
