import { useState } from 'react';
import '../estilos/gastos.css';

const estadosDisponibles = ['Pagado', 'Pendiente'];

const Gastos = ({ expenses, crearGasto, actualizarGasto, eliminarGasto, categorias, crearCategoria, eliminarCategoria }) => {
  const [form, setForm] = useState({
    descripcion: '', monto: '', fecha: '', id_categoria: '', estado: 'Pagado'
  });
  const [editId, setEditId]     = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError]       = useState('');

  const [nuevaCategoria, setNuevaCategoria]   = useState('');
  const [errorCategoria, setErrorCategoria]   = useState('');
  const [mostrarGestor, setMostrarGestor]     = useState(false);

  const agregarCategoria = async () => {
    const valor = nuevaCategoria.trim();
    if (valor === '') { setErrorCategoria('Ingresa un nombre.'); return; }
    if (categorias.find(c => c.nombre_categoria.toLowerCase() === valor.toLowerCase())) {
      setErrorCategoria('Esta categoría ya existe.');
      return;
    }
    try {
      await crearCategoria(valor);
      setNuevaCategoria('');
      setErrorCategoria('');
    } catch {
      setErrorCategoria('Error al crear la categoría.');
    }
  };

  const eliminarCat = async (id_categoria) => {
    try {
      await eliminarCategoria(id_categoria);
      if (form.id_categoria === id_categoria) setForm({ ...form, id_categoria: '' });
    } catch {
      setErrorCategoria('Error al eliminar la categoría.');
    }
  };

  const validarGasto = (datos) => {
    const descripcion = datos.descripcion.trim();
    const montoTexto  = typeof datos.monto === 'string' ? datos.monto.trim() : String(datos.monto);
    const montoValido = Number(montoTexto.replace(/,/g, '.'));
    if (descripcion === '')                    return 'La descripción es obligatoria.';
    if (descripcion.length > 30)               return 'La descripción no puede tener más de 30 caracteres.';
    if (montoTexto === '')                      return 'El monto es obligatorio.';
    if (montoTexto.length > 9)                 return 'El monto no puede tener más de 9 caracteres.';
    if (isNaN(montoValido) || montoValido <= 0) return 'Ingresa un monto válido mayor a 0.';
    if (datos.fecha === '')                    return 'Selecciona la fecha del gasto.';
    if (!datos.id_categoria)                   return 'Selecciona una categoría.';
    if (datos.estado === '')                   return 'Selecciona un estado.';
    return '';
  };

  const actualizarCampo = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setError('');
  };

  const actualizarCampoEdicion = (campo, valor) => {
    setEditForm(prev => ({ ...prev, [campo]: valor }));
    setError('');
  };

  const agregarGasto = async () => {
    const msg = validarGasto(form);
    if (msg) { setError(msg); return; }
    try {
      await crearGasto({
        descripcion: form.descripcion.trim(),
        monto: parseFloat(form.monto.replace(',', '.')),
        fecha: form.fecha,
        estado: form.estado,
        id_categoria: form.id_categoria,
      });
      setForm({ descripcion: '', monto: '', fecha: '', id_categoria: '', estado: 'Pagado' });
    } catch {
      setError('Error al guardar el gasto en el servidor.');
    }
  };

  const iniciarEdicion = (expense) => {
    setEditId(expense.id_gasto);
    setEditForm({ ...expense, monto: expense.monto.toString() });
    setError('');
  };

  const cancelarEdicion = () => { setEditId(null); setEditForm({}); setError(''); };

  const guardarEdicion = async () => {
    const msg = validarGasto(editForm);
    if (msg) { setError(msg); return; }
    try {
      await actualizarGasto(editId, {
        descripcion: editForm.descripcion.trim(),
        monto: parseFloat(String(editForm.monto).replace(',', '.')),
        fecha: editForm.fecha,
        estado: editForm.estado,
        id_categoria: editForm.id_categoria,
      });
      cancelarEdicion();
    } catch {
      setError('Error al actualizar el gasto.');
    }
  };

  const handleEliminarGasto = async (id) => {
    try {
      await eliminarGasto(id);
      if (editId === id) cancelarEdicion();
    } catch {
      setError('Error al eliminar el gasto.');
    }
  };

  const nombreCategoria = (id_categoria) => {
    const cat = categorias.find(c => c.id_categoria === id_categoria);
    return cat ? cat.nombre_categoria : '—';
  };

  return (
    <div className="gastos-page">
      <h2>Agregar Gasto</h2>

      <div className="gastos-grid">

        {/* ── Formulario ── */}
        <div className="gastos-formulario">
          <label>
            <span>Descripción</span>
            <input type="text" value={form.descripcion} maxLength={30}
              placeholder="Máximo 30 caracteres"
              onChange={e => actualizarCampo('descripcion', e.target.value)}
            />
          </label>

          <div className="gastos-fila">
            <label>
              <span>Monto</span>
              <input type="text" value={form.monto} maxLength={9} placeholder="S/."
                onChange={e => actualizarCampo('monto', e.target.value.replace(/[^0-9.,]/g, ''))}
              />
            </label>
            <label>
              <span>Fecha</span>
              <input type="date" value={form.fecha}
                onChange={e => actualizarCampo('fecha', e.target.value)}
              />
            </label>
          </div>

          <div className="gastos-fila">
            <label>
              <span>Categoría</span>
              <select value={form.id_categoria} onChange={e => actualizarCampo('id_categoria', e.target.value)}>
                <option value="">Selecciona categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Estado</span>
              <select value={form.estado} onChange={e => actualizarCampo('estado', e.target.value)}>
                {estadosDisponibles.map(est => <option key={est} value={est}>{est}</option>)}
              </select>
            </label>
          </div>

          {error && <p className="gastos-error">{error}</p>}
          <button type="button" className="btn-agregar" onClick={agregarGasto}>AGREGAR</button>

          {/* ── Gestor de categorías ── */}
          <div className="gestor-categorias">
            <button
              type="button"
              className="btn-gestor-toggle"
              onClick={() => setMostrarGestor(!mostrarGestor)}
            >
              {mostrarGestor ? '▲ Ocultar' : '⚙️ Gestionar categorías'}
            </button>

            {mostrarGestor && (
              <div className="gestor-body">
                <div className="gestor-input-fila">
                  <input
                    type="text"
                    placeholder="Nueva categoría..."
                    value={nuevaCategoria}
                    onChange={e => { setNuevaCategoria(e.target.value); setErrorCategoria(''); }}
                  />
                  <button type="button" onClick={agregarCategoria}>+ Agregar</button>
                </div>
                {errorCategoria && <span className="gastos-error">{errorCategoria}</span>}

                <div className="gestor-lista">
                  {categorias.map(cat => (
                    <div key={cat.id_categoria} className="gestor-tag">
                      <span>{cat.nombre_categoria}</span>
                      <button
                        type="button"
                        className="gestor-tag-eliminar"
                        onClick={() => eliminarCat(cat.id_categoria)}
                        title="Eliminar categoría"
                      >✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabla ── */}
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
                  <tr key={exp.id_gasto} className={editId === exp.id_gasto ? 'fila-editando' : ''}>
                    <td>
                      {editId === exp.id_gasto
                        ? <input type="text" maxLength={100} value={editForm.descripcion}
                            onChange={e => actualizarCampoEdicion('descripcion', e.target.value)} />
                        : exp.descripcion}
                    </td>
                    <td>
                      {editId === exp.id_gasto
                        ? <select value={editForm.id_categoria || ''}
                            onChange={e => actualizarCampoEdicion('id_categoria', e.target.value)}>
                            <option value="">Selecciona</option>
                            {categorias.map(cat => (
                              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                            ))}
                          </select>
                        : nombreCategoria(exp.id_categoria)}
                    </td>
                    <td>
                      {editId === exp.id_gasto
                        ? <input type="text" maxLength={9} value={editForm.monto}
                            onChange={e => actualizarCampoEdicion('monto', e.target.value.replace(/[^0-9.,]/g, ''))} />
                        : `S/ ${Number(exp.monto).toFixed(2)}`}
                    </td>
                    <td>
                      {editId === exp.id_gasto
                        ? <input type="date" value={editForm.fecha?.slice(0, 10)}
                            onChange={e => actualizarCampoEdicion('fecha', e.target.value)} />
                        : String(exp.fecha).slice(0, 10)}
                    </td>
                    <td>
                      {editId === exp.id_gasto
                        ? <select value={editForm.estado}
                            onChange={e => actualizarCampoEdicion('estado', e.target.value)}>
                            {estadosDisponibles.map(est => <option key={est} value={est}>{est}</option>)}
                          </select>
                        : exp.estado || 'Pendiente'}
                    </td>
                    <td className="acciones-col">
                      {editId === exp.id_gasto ? (
                        <>
                          <button className="btn-guardar" onClick={guardarEdicion}>Guardar</button>
                          <button className="btn-cancelar" onClick={cancelarEdicion}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-editar" onClick={() => iniciarEdicion(exp)}>Editar</button>
                          <button className="btn-eliminar-gasto" onClick={() => handleEliminarGasto(exp.id_gasto)}>Eliminar</button>
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