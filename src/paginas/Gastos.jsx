import { useState } from 'react';

const categoriasDisponibles = [
  'Alimentación',
  'Transporte',
  'Servicios',
  'Educación'
];

const estadosDisponibles = ['Pagado', 'Pendiente'];

const Gastos = ({ expenses, setExpenses }) => {
  const [form, setForm] = useState({
    descripcion: '',
    monto: '',
    fecha: '',
    categoria: '',
    estado: 'Pagado'
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState('');

  const actualizarCampo = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setError('');
  };

  const actualizarCampoEdicion = (campo, valor) => {
    setEditForm(prev => ({ ...prev, [campo]: valor }));
    setError('');
  };

  const validarGasto = (datos) => {
    const descripcion = datos.descripcion.trim();
    const montoTexto = typeof datos.monto === 'string' ? datos.monto.trim() : String(datos.monto);
    const montoValido = Number(montoTexto.replace(/,/g, '.'));

    if (descripcion === '') {
      return 'La descripción es obligatoria.';
    }
    if (descripcion.length > 30) {
      return 'La descripción no puede tener más de 30 caracteres.';
    }
    if (montoTexto === '') {
      return 'El monto es obligatorio.';
    }
    if (montoTexto.length > 9) {
      return 'El monto no puede tener más de 9 caracteres.';
    }
    if (isNaN(montoValido) || montoValido <= 0) {
      return 'Ingresa un monto válido mayor a 0.';
    }
    if (datos.fecha === '') {
      return 'Selecciona la fecha del gasto.';
    }
    if (datos.categoria === '') {
      return 'Selecciona una categoría.';
    }
    if (datos.estado === '') {
      return 'Selecciona un estado.';
    }
    return '';
  };

  const agregarGasto = () => {
    const nuevoGasto = {
      id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
      descripcion: form.descripcion.trim(),
      monto: parseFloat(form.monto),
      fecha: form.fecha,
      categoria: form.categoria,
      estado: form.estado
    };

    const mensajeError = validarGasto(nuevoGasto);
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setExpenses(prev => [nuevoGasto, ...prev]);
    setForm({ descripcion: '', monto: '', fecha: '', categoria: '', estado: 'Pagado' });
  };

  const iniciarEdicion = (expense) => {
    setEditId(expense.id);
    setEditForm({ ...expense, monto: expense.monto.toString() });
    setError('');
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditForm({});
    setError('');
  };

  const guardarEdicion = () => {
    const mensajeError = validarGasto(editForm);
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    const actualizados = expenses.map(exp =>
      exp.id === editId
        ? { ...exp, descripcion: editForm.descripcion.trim(), monto: parseFloat(editForm.monto), fecha: editForm.fecha, categoria: editForm.categoria, estado: editForm.estado }
        : exp
    );

    setExpenses(() => actualizados);
    cancelarEdicion();
  };

  const eliminarGasto = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    if (editId === id) {
      cancelarEdicion();
    }
  };

  return (
    <div className="gastos-page">
      <h2>Agregar Gasto</h2>
      <div className="gastos-grid">
        <div className="gastos-formulario">
          <label>
            <span>Descripción</span>
            <input
              type="text"
              value={form.descripcion}
              maxLength={30}
              placeholder="Caracteres máximos: 30"
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
            />
          </label>

          <div className="gastos-fila">
            <label>
              <span>Monto</span>
              <input
                type="text"
                value={form.monto}
                maxLength={9}
                placeholder="S/."
                onChange={(e) => actualizarCampo('monto', e.target.value.replace(/[^0-9.,]/g, ''))}
              />
            </label>
            <label>
              <span>Fecha</span>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => actualizarCampo('fecha', e.target.value)}
              />
            </label>
          </div>

          <div className="gastos-fila">
            <label>
              <span>Categoría</span>
              <select
                value={form.categoria}
                onChange={(e) => actualizarCampo('categoria', e.target.value)}
              >
                <option value="">Selecciona categoría</option>
                {categoriasDisponibles.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Estado</span>
              <select
                value={form.estado}
                onChange={(e) => actualizarCampo('estado', e.target.value)}
              >
                {estadosDisponibles.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="gastos-error">{error}</p>}
          <button type="button" className="btn-agregar" onClick={agregarGasto}>AGREGAR</button>
        </div>

        <div className="gastos-tabla-contenedor">
          <h3>Gastos registrados</h3>
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} className={editId === exp.id ? 'fila-editando' : ''}>
                    <td>
                      {editId === exp.id ? (
                        <input
                          type="text"
                          maxLength={100}
                          value={editForm.descripcion}
                          onChange={(e) => actualizarCampoEdicion('descripcion', e.target.value)}
                        />
                      ) : (
                        exp.descripcion
                      )}
                    </td>
                    <td>
                      {editId === exp.id ? (
                        <select
                          value={editForm.categoria}
                          onChange={(e) => actualizarCampoEdicion('categoria', e.target.value)}
                        >
                          <option value="">Selecciona categoría</option>
                          {categoriasDisponibles.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        exp.categoria
                      )}
                    </td>
                    <td>
                      {editId === exp.id ? (
                        <input
                          type="text"
                          maxLength={9}
                          value={editForm.monto}
                          onChange={(e) => actualizarCampoEdicion('monto', e.target.value.replace(/[^0-9.,]/g, ''))}
                        />
                      ) : (
                        `S/ ${exp.monto.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editId === exp.id ? (
                        <input
                          type="date"
                          value={editForm.fecha}
                          onChange={(e) => actualizarCampoEdicion('fecha', e.target.value)}
                        />
                      ) : (
                        exp.fecha
                      )}
                    </td>
                    <td>
                      {editId === exp.id ? (
                        <select
                          value={editForm.estado}
                          onChange={(e) => actualizarCampoEdicion('estado', e.target.value)}
                        >
                          {estadosDisponibles.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      ) : (
                        exp.estado || 'Pendiente'
                      )}
                    </td>
                    <td className="acciones-col">
                      {editId === exp.id ? (
                        <>
                          <button className="btn-guardar" onClick={guardarEdicion}>Guardar</button>
                          <button className="btn-cancelar" onClick={cancelarEdicion}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-editar" onClick={() => iniciarEdicion(exp)}>Editar</button>
                          <button className="btn-eliminar-gasto" onClick={() => eliminarGasto(exp.id)}>Eliminar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#7a7a7a' }}>
                      No hay gastos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gastos;
