import { useState } from 'react';
import { mockExpenses } from '../data/mock.Expenses';

const Reportes = () => {
  const [expenses] = useState(mockExpenses);

  const totalGastos = expenses.reduce((acc, e) => acc + e.monto, 0).toFixed(2);
  const cantidadGastos = expenses.length;
  const promedioGasto = cantidadGastos > 0
    ? (expenses.reduce((acc, e) => acc + e.monto, 0) / cantidadGastos).toFixed(2)
    : 0;

  return (
    <div>
      <h2>Reportes de Gastos</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div className="stats-card">
          <h3>Total Gastos</h3>
          <p>S/ {totalGastos}</p>
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