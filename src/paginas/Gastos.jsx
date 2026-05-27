import { useState, useEffect } from 'react';
import { mockExpenses } from '../data/mock.Expenses';
import '../estilos/gastos.css';

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formulario, setFormulario] = useState({
    descripcion: '',
    monto: '',
    fecha: '',
    categoria: 'Alimentacion',
    estado: 'Pendiente'
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (mockExpenses.length > 0) {
      const gastosConEstado = mockExpenses.map(gasto => ({
        ...gasto,
        estado: gasto.estado || 'Pendiente'
      }));
      setGastos(gastosConEstado);
    }
  }, []);

  // Categorías y Estados disponibles
  const categorias = ['Alimentacion', 'Transporte', 'Servicios', 'Educacion', 'Salud', 'Entretenimiento', 'Viajes', 'Ropa y Accesorios'];
  const estados = ['Pagado', 'Pendiente'];

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Validaciones
    if (name === 'descripcion' && value.length > 100) {
      finalValue = value.slice(0, 100);
    }
    if (name === 'monto') {
      if (value.length > 8) {
        finalValue = value.slice(0, 8);
      }
      // Solo permitir números y punto decimal
      finalValue = finalValue.replace(/[^\d.]/g, '');
    }

    setFormulario({
      ...formulario,
      [name]: finalValue
    });
  };

  // Agregar o actualizar gasto
  const handleAgregar = (e) => {
    e.preventDefault();

    if (!formulario.descripcion.trim() || !formulario.monto || !formulario.fecha) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (editingId) {
      // Editar gasto existente
      setGastos(gastos.map(gasto =>
        gasto.id === editingId
          ? {
            ...gasto,
            descripcion: formulario.descripcion,
            monto: parseFloat(formulario.monto),
            fecha: formulario.fecha,
            categoria: formulario.categoria,
            estado: formulario.estado
          }
          : gasto
      ));
      setEditingId(null);
    } else {
      // Agregar nuevo gasto
      const nuevoGasto = {
        id: Date.now(),
        descripcion: formulario.descripcion,
        monto: parseFloat(formulario.monto),
        fecha: formulario.fecha,
        categoria: formulario.categoria,
        estado: formulario.estado
      };
      setGastos([...gastos, nuevoGasto]);
    }

    // Limpiar formulario
    setFormulario({
      descripcion: '',
      monto: '',
      fecha: '',
      categoria: 'Alimentacion',
      estado: 'Pendiente'
    });
  };

  // Manejar edición
  const handleEditar = (gasto) => {
    setFormulario({
      descripcion: gasto.descripcion,
      monto: gasto.monto.toString(),
      fecha: gasto.fecha,
      categoria: gasto.categoria,
      estado: gasto.estado
    });
    setEditingId(gasto.id);
  };

  // Manejar eliminación
  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      setGastos(gastos.filter(gasto => gasto.id !== id));
    }
  };

  // Cancelar edición
  const handleCancelar = () => {
    setEditingId(null);
    setFormulario({
      descripcion: '',
      monto: '',
      fecha: '',
      categoria: 'Alimentacion',
      estado: 'Pendiente'
    });
  };

  // Ordenar gastos por fecha descendente
  const gastosOrdenados = [...gastos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="gastos-container">
      <h2>Agregar Gasto</h2>

      <div className="gastos-layout">
        {/* Formulario */}
        <div className="formulario-section">
          <form onSubmit={handleAgregar} className="gastos-form">
            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input
                id="descripcion"
                type="text"
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleInputChange}
                placeholder="caracteres máximos: 100"
                maxLength="100"
                required
              />
              <small>{formulario.descripcion.length}/100 caracteres</small>
            </div>

            {/* Monto */}
            <div className="form-group">
              <label htmlFor="monto">Monto (S/.)</label>
              <input
                id="monto"
                type="text"
                name="monto"
                value={formulario.monto}
                onChange={handleInputChange}
                placeholder="máximo: 99999.99"
                required
              />
              <small>{formulario.monto.length}/8 caracteres</small>
            </div>

            {/* Fecha */}
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={handleInputChange}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formulario.estado}
                onChange={handleInputChange}
              >
                {estados.map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="btn-agregar">
                {editingId ? 'ACTUALIZAR' : 'AGREGAR'}
              </button>
              {editingId && (
                <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                  CANCELAR
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de Gastos */}
        <div className="tabla-section">
          <h3>Mis Gastos</h3>
          {gastosOrdenados.length === 0 ? (
            <p className="sin-gastos">No hay gastos registrados aún</p>
          ) : (
            <div className="tabla-wrapper">
              <table className="gastos-tabla">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Monto (S/.)</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosOrdenados.map(gasto => (
                    <tr key={gasto.id} className={`estado-${gasto.estado.toLowerCase()}`}>
                      <td><strong>{gasto.descripcion}</strong></td>
                      <td>{gasto.categoria}</td>
                      <td className="monto">{gasto.monto.toFixed(2)}</td>
                      <td>{new Date(gasto.fecha).toLocaleDateString('es-PE')}</td>
                      <td>
                        <span className={`estado-badge ${gasto.estado.toLowerCase()}`}>
                          {gasto.estado}
                        </span>
                      </td>
                      <td className="acciones">
                        <button
                          className="btn-editar"
                          onClick={() => handleEditar(gasto)}
                          title="Editar gasto"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleEliminar(gasto.id)}
                          title="Eliminar gasto"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="stats-resumen">
            <p><strong>Total Gastos:</strong> {gastosOrdenados.length}</p>
            <p><strong>Monto Total:</strong> S/. {gastosOrdenados.reduce((sum, g) => sum + g.monto, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gastos;
