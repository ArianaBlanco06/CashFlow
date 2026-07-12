import { useState } from 'react';
import '../estilos/filtros.css';

const ReporteFiltros = ({
  expenses,
  categorias,
  recordatorios,
  crearRecordatorio,
  actualizarRecordatorio,
  eliminarRecordatorio,
}) => {

  const [categoria, setCategoria] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [nuevoDesc, setNuevoDesc] = useState('');
  const [nuevaCat, setNuevaCat] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  const hoy = new Date().toISOString().split('T')[0];

  const nombreCategoria = (id_categoria) => {
    const cat = categorias.find(c => c.id_categoria === id_categoria);
    return cat ? cat.nombre_categoria : '';
  };

  const filtered = expenses.filter(exp => {
    const nombreCat = nombreCategoria(exp.id_categoria).toLowerCase();
    return (
      nombreCat.includes(categoria.toLowerCase()) &&
      (fechaInicio === '' || String(exp.fecha).slice(0, 10) >= fechaInicio) &&
      (fechaFin === '' || String(exp.fecha).slice(0, 10) <= fechaFin)
    );
  });

  const agregarRecordatorio = async () => {
    if (nuevoDesc.trim() === '' || nuevaFecha === '') return;
    await crearRecordatorio({
      descripcion: nuevoDesc.trim(),
      fecha_limite: nuevaFecha,
      completado: 0,
      id_categoria: nuevaCat === '' ? null : Number(nuevaCat),
    });
    setNuevoDesc('');
    setNuevaCat('');
    setNuevaFecha('');
  };

  const toggleCompletado = (r) => {
    actualizarRecordatorio({ ...r, completado: r.completado ? 0 : 1 });
  };

  return (
    <div>
      <h2>Filtros de Gastos</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <label style={{ fontWeight: '600' }}>Categoría:</label>
        <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ej: Alimentación" />
        <label style={{ fontWeight: '600' }}>Fecha inicio:</label>
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        <label style={{ fontWeight: '600' }}>Fecha fin:</label>
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
      </div>

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
          {filtered.map(exp => (
            <tr key={exp.id_gasto}>
              <td>{exp.descripcion}</td>
              <td>{nombreCategoria(exp.id_categoria)}</td>
              <td>S/ {Number(exp.monto).toFixed(2)}</td>
              <td>{String(exp.fecha).slice(0, 10)}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>🔔 Recordatorios</h3>

      <div className="recordatorio-form">
        <input type="text" value={nuevoDesc} onChange={e => setNuevoDesc(e.target.value)} placeholder="Descripción del recordatorio" style={{ flex: '2' }} />
        <select value={nuevaCat} onChange={e => setNuevaCat(e.target.value)} style={{ flex: '1' }}>
          <option value="">Categoría (opcional)</option>
          {categorias.map(c => (
            <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
          ))}
        </select>
        <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} />
        <button onClick={agregarRecordatorio}>+ Agregar</button>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {recordatorios.length === 0 && (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>No hay recordatorios configurados.</p>
        )}
        {recordatorios.map(r => {
          const fechaLimite = String(r.fecha_limite).slice(0, 10);
          const completado = Number(r.completado) === 1;
          const vencido = !completado && fechaLimite < hoy;
          return (
            <div key={r.id_recordatorio} className={'recordatorio-item' + (completado ? ' recordatorio-completado' : '') + (vencido ? ' recordatorio-vencido' : '')}>
              <input type="checkbox" checked={completado} onChange={() => toggleCompletado(r)} />
              <div className="recordatorio-texto">
                <span className="recordatorio-desc">{r.descripcion}</span>
                {r.id_categoria && <span className="recordatorio-cat">{nombreCategoria(r.id_categoria)}</span>}
              </div>
              <div className="recordatorio-fecha">
                {vencido && <span className="badge-vencido">⚠️ Vencido</span>}
                <span>{fechaLimite}</span>
              </div>
              <button className="btn-eliminar-recordatorio" onClick={() => eliminarRecordatorio(r.id_recordatorio)} title="Eliminar">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReporteFiltros;