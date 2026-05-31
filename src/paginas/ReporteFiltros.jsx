import { useState } from 'react';
import '../estilos/filtros.css';

const ReporteFiltros = ({ expenses }) => {

  const [categoria, setCategoria] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

const [recordatorios, setRecordatorios] = useState(() => {
  try {
    const guardado = localStorage.getItem('recordatorios');
    return guardado ? JSON.parse(guardado) : [
      { id: 1, descripcion: 'Pagar internet', categoria: 'Servicios', fechaLimite: '2026-05-20', completado: false },
      { id: 2, descripcion: 'Revisar gastos del mes', categoria: 'Educación', fechaLimite: '2026-06-01', completado: false }
    ];
  } catch {
    return [];
  }
});

const guardarRecordatorios = (nuevos) => {
  const lista = typeof nuevos === 'function' ? nuevos(recordatorios) : nuevos;
  setRecordatorios(lista);
  localStorage.setItem('recordatorios', JSON.stringify(lista));
};

  const [nuevoDesc, setNuevoDesc] = useState('');
  const [nuevaCat, setNuevaCat] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  const hoy = new Date().toISOString().split('T')[0];


  const filtered = expenses.filter(exp => {
    return (
      exp.categoria.toLowerCase().includes(categoria.toLowerCase()) &&
      (fechaInicio === '' || exp.fecha >= fechaInicio) &&
      (fechaFin === '' || exp.fecha <= fechaFin)
    );
  });


  const agregarRecordatorio = () => {
    if (nuevoDesc.trim() === '' || nuevaFecha === '') return;
    const nuevo = {
      id: recordatorios.length + 1,
      descripcion: nuevoDesc,
      categoria: nuevaCat,
      fechaLimite: nuevaFecha,
      completado: false
    };
    guardarRecordatorios([...recordatorios, nuevo]);
    setNuevoDesc('');
    setNuevaCat('');
    setNuevaFecha('');
  };


  const toggleCompletado = (id) => {
    const actualizados = recordatorios.map(r => {
      if (r.id === id) {
        return { ...r, completado: !r.completado };
      }
      return r;
    });
    guardarRecordatorios(actualizados);
  };


  const eliminarRecordatorio = (id) => {
    const filtrados = recordatorios.filter(r => r.id !== id);
    guardarRecordatorios(filtrados);
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
            <tr key={exp.id}>
              <td>{exp.descripcion}</td>
              <td>{exp.categoria}</td>
              <td>S/ {exp.monto}</td>
              <td>{exp.fecha}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ════ RECORDATORIOS ════ */}
      <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>🔔 Recordatorios</h3>

      <div className="recordatorio-form">
        <input type="text" value={nuevoDesc} onChange={e => setNuevoDesc(e.target.value)} placeholder="Descripción del recordatorio" style={{ flex: '2' }} />
        <input type="text" value={nuevaCat} onChange={e => setNuevaCat(e.target.value)} placeholder="Categoría (opcional)" style={{ flex: '1' }} />
        <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} />
        <button onClick={agregarRecordatorio}>+ Agregar</button>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {recordatorios.length === 0 && (
          <p style={{ color: '#999', fontSize: '0.9rem' }}>No hay recordatorios configurados.</p>
        )}
        {recordatorios.map(r => {
          const vencido = !r.completado && r.fechaLimite < hoy;
          return (
            <div key={r.id} className={'recordatorio-item' + (r.completado ? ' recordatorio-completado' : '') + (vencido ? ' recordatorio-vencido' : '')}>
              <input type="checkbox" checked={r.completado} onChange={() => toggleCompletado(r.id)} />
              <div className="recordatorio-texto">
                <span className="recordatorio-desc">{r.descripcion}</span>
                {r.categoria !== '' && <span className="recordatorio-cat">{r.categoria}</span>}
              </div>
              <div className="recordatorio-fecha">
                {vencido && <span className="badge-vencido">⚠️ Vencido</span>}
                <span>{r.fechaLimite}</span>
              </div>
              <button className="btn-eliminar-recordatorio" onClick={() => eliminarRecordatorio(r.id)} title="Eliminar">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReporteFiltros;