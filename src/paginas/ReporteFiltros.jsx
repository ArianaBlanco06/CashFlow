import { useState } from 'react';
import { mockExpenses } from '../data/mock.Expenses';

const ReporteFiltros = () => {
  const [categoria, setCategoria] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const filtered = mockExpenses.filter(exp => {
    return (
      exp.categoria.toLowerCase().includes(categoria.toLowerCase()) &&
      (fechaInicio === '' || exp.fecha >= fechaInicio) &&
      (fechaFin === '' || exp.fecha <= fechaFin)
    );
  });

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
              <td>{exp.monto}</td>
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
    </div>
  );
};

export default ReporteFiltros;