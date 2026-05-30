import { useState } from 'react';
import '../estilos/facturas.css';

const estadosDisponibles = ['Emitida', 'Pagada', 'Anulada'];

const generarNumero = (facturas) => {
  const siguiente = facturas.length + 1;
  return `F-${String(siguiente).padStart(3, '0')}`;
};

const Facturas = ({ facturas, setFacturas, categorias, setCategorias }) => {
  const [form, setForm] = useState({
    cliente: '', ruc: '', descripcion: '', subtotal: '', categoria: '', estado: 'Emitida', fecha: ''
  });
  const [errores, setErrores]   = useState({});
  const [editId, setEditId]     = useState(null);
  const [editForm, setEditForm] = useState({});

  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [errorCategoria, setErrorCategoria] = useState('');
  const [mostrarGestor, setMostrarGestor]   = useState(false);

  // ── Gestor de categorías ──
  const agregarCategoria = () => {
    const valor = nuevaCategoria.trim();
    if (valor === '') { setErrorCategoria('Ingresa un nombre.'); return; }
    if (categorias.find(c => c.toLowerCase() === valor.toLowerCase())) {
      setErrorCategoria('Esta categoría ya existe.'); return;
    }
    setCategorias([...categorias, valor]);
    setNuevaCategoria('');
    setErrorCategoria('');
  };

  const eliminarCategoria = (cat) => {
    setCategorias(categorias.filter(c => c !== cat));
    if (form.categoria === cat) setForm({ ...form, categoria: '' });
  };

  // ── IGV en tiempo real ──
  const subtotalNum     = parseFloat(form.subtotal) || 0;
  const igvCalc         = (subtotalNum * 0.18).toFixed(2);
  const totalCalc       = (subtotalNum * 1.18).toFixed(2);
  const subtotalEditNum = parseFloat(editForm.subtotal) || 0;
  const igvEdit         = (subtotalEditNum * 0.18).toFixed(2);
  const totalEdit       = (subtotalEditNum * 1.18).toFixed(2);

  // ── Validar ──
  const validar = (datos) => {
    const e = {};
    if (!datos.cliente.trim())     e.cliente     = 'El cliente es obligatorio.';
    if (!datos.ruc.trim())         e.ruc         = 'El RUC es obligatorio.';
    else if (!/^\d{11}$/.test(datos.ruc.trim())) e.ruc = 'El RUC debe tener 11 dígitos.';
    if (!datos.descripcion.trim()) e.descripcion = 'La descripción es obligatoria.';
    if (!datos.subtotal || parseFloat(datos.subtotal) <= 0) e.subtotal = 'Ingresa un subtotal válido.';
    if (!datos.fecha)              e.fecha       = 'La fecha es obligatoria.';
    return e;
  };

  // ── Agregar ──
  const agregarFactura = () => {
    const e = validar(form);
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    const nueva = {
      id: Date.now(),
      numero: generarNumero(facturas),
      cliente: form.cliente.trim(),
      ruc: form.ruc.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria,
      subtotal: subtotalNum,
      igv: parseFloat(igvCalc),
      total: parseFloat(totalCalc),
      estado: form.estado,
      fecha: form.fecha,
    };
    setFacturas([nueva, ...facturas]);
    setForm({ cliente: '', ruc: '', descripcion: '', subtotal: '', categoria: '', estado: 'Emitida', fecha: '' });
    setErrores({});
  };

  // ── Edición ──
  const iniciarEdicion  = (f) => { setEditId(f.id); setEditForm({ ...f, subtotal: f.subtotal.toString() }); };
  const cancelarEdicion = () => { setEditId(null); setEditForm({}); };

  const guardarEdicion = () => {
    const e = validar(editForm);
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    setFacturas(facturas.map(f =>
      f.id === editId
        ? { ...f, cliente: editForm.cliente.trim(), ruc: editForm.ruc.trim(),
            descripcion: editForm.descripcion.trim(), categoria: editForm.categoria,
            subtotal: subtotalEditNum, igv: parseFloat(igvEdit),
            total: parseFloat(totalEdit), estado: editForm.estado, fecha: editForm.fecha }
        : f
    ));
    cancelarEdicion();
    setErrores({});
  };

  const eliminarFactura = (id) => setFacturas(facturas.filter(f => f.id !== id));

  // ── Resumen ──
  const totalFacturado = facturas.reduce((acc, f) => acc + f.total, 0);
  const totalCobrado   = facturas.filter(f => f.estado === 'Pagada').reduce((acc, f) => acc + f.total, 0);
  const totalPendiente = facturas.filter(f => f.estado === 'Emitida').reduce((acc, f) => acc + f.total, 0);

  return (
    <div className="facturas-page">
      <h2>🧾 Facturas</h2>
      <p className="facturas-subtitulo">Gestiona las facturas emitidas a tus clientes.</p>

      {/* ── Resumen ── */}
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stats-card"><h3>Total Facturado</h3><p>S/ {totalFacturado.toFixed(2)}</p></div>
        <div className="stats-card stats-card--min"><h3>✅ Cobrado</h3><p>S/ {totalCobrado.toFixed(2)}</p></div>
        <div className="stats-card stats-card--top"><h3>⏳ Por cobrar</h3><p>S/ {totalPendiente.toFixed(2)}</p></div>
        <div className="stats-card stats-card--max"><h3>📄 N° Facturas</h3><p>{facturas.length}</p></div>
      </div>

      <div className="facturas-grid">

        {/* ── Formulario ── */}
        <div className="facturas-formulario">
          <h3>Nueva Factura</h3>
          <p className="numero-preview">Número: <strong>{generarNumero(facturas)}</strong></p>

          <div className="form-grupo">
            <label>Cliente</label>
            <input type="text" placeholder="Nombre del cliente" value={form.cliente}
              onChange={e => { setForm({ ...form, cliente: e.target.value }); setErrores({ ...errores, cliente: '' }); }} />
            {errores.cliente && <span className="facturas-error">{errores.cliente}</span>}
          </div>

          <div className="form-grupo">
            <label>RUC</label>
            <input type="text" placeholder="11 dígitos" maxLength={11} value={form.ruc}
              onChange={e => { setForm({ ...form, ruc: e.target.value.replace(/\D/g, '') }); setErrores({ ...errores, ruc: '' }); }} />
            {errores.ruc && <span className="facturas-error">{errores.ruc}</span>}
          </div>

          <div className="form-grupo">
            <label>Descripción del servicio</label>
            <input type="text" placeholder="Ej: Consultoría web" value={form.descripcion}
              onChange={e => { setForm({ ...form, descripcion: e.target.value }); setErrores({ ...errores, descripcion: '' }); }} />
            {errores.descripcion && <span className="facturas-error">{errores.descripcion}</span>}
          </div>

          <div className="form-grupo">
            <label>Categoría</label>
            <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
              <option value="">Sin categoría</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-grupo">
            <label>Subtotal (S/.)</label>
            <input type="text" placeholder="0.00" value={form.subtotal}
              onChange={e => { setForm({ ...form, subtotal: e.target.value.replace(/[^0-9.]/g, '') }); setErrores({ ...errores, subtotal: '' }); }} />
            {errores.subtotal && <span className="facturas-error">{errores.subtotal}</span>}
          </div>

          {subtotalNum > 0 && (
            <div className="igv-preview">
              <div className="igv-fila"><span>Subtotal</span><span>S/ {subtotalNum.toFixed(2)}</span></div>
              <div className="igv-fila"><span>IGV (18%)</span><span>S/ {igvCalc}</span></div>
              <div className="igv-fila igv-total"><span>TOTAL</span><span>S/ {totalCalc}</span></div>
            </div>
          )}

          <div className="form-grupo">
            <label>Fecha</label>
            <input type="date" value={form.fecha}
              onChange={e => { setForm({ ...form, fecha: e.target.value }); setErrores({ ...errores, fecha: '' }); }} />
            {errores.fecha && <span className="facturas-error">{errores.fecha}</span>}
          </div>

          <div className="form-grupo">
            <label>Estado</label>
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
              {estadosDisponibles.map(est => <option key={est} value={est}>{est}</option>)}
            </select>
          </div>

          <button onClick={agregarFactura} style={{ width: '100%', marginTop: '0.5rem' }}>
            + Emitir Factura
          </button>

          {/* ── Gestor de categorías ── */}
          <div className="gestor-categorias">
            <button type="button" className="btn-gestor-toggle"
              onClick={() => setMostrarGestor(!mostrarGestor)}>
              {mostrarGestor ? '▲ Ocultar' : '⚙️ Gestionar categorías'}
            </button>
            {mostrarGestor && (
              <div className="gestor-body">
                <div className="gestor-input-fila">
                  <input type="text" placeholder="Nueva categoría..."
                    value={nuevaCategoria}
                    onChange={e => { setNuevaCategoria(e.target.value); setErrorCategoria(''); }} />
                  <button type="button" onClick={agregarCategoria}>+ Agregar</button>
                </div>
                {errorCategoria && <span className="facturas-error">{errorCategoria}</span>}
                <div className="gestor-lista">
                  {categorias.map(cat => (
                    <div key={cat} className="gestor-tag">
                      <span>{cat}</span>
                      <button type="button" className="gestor-tag-eliminar"
                        onClick={() => eliminarCategoria(cat)} title="Eliminar">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className="facturas-tabla-contenedor">
          <h3>Facturas emitidas</h3>
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>N°</th><th>Cliente</th><th>RUC</th><th>Descripción</th>
                  <th>Categoría</th><th>Subtotal</th><th>IGV</th><th>Total</th>
                  <th>Fecha</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map(f => (
                  <tr key={f.id} className={editId === f.id ? 'fila-editando' : ''}>
                    <td><strong>{f.numero}</strong></td>
                    <td>{editId === f.id ? <input type="text" value={editForm.cliente} onChange={e => setEditForm({ ...editForm, cliente: e.target.value })} /> : f.cliente}</td>
                    <td>{editId === f.id ? <input type="text" maxLength={11} value={editForm.ruc} onChange={e => setEditForm({ ...editForm, ruc: e.target.value.replace(/\D/g, '') })} /> : f.ruc}</td>
                    <td>{editId === f.id ? <input type="text" value={editForm.descripcion} onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })} /> : f.descripcion}</td>
                    <td>
                      {editId === f.id
                        ? <select value={editForm.categoria} onChange={e => setEditForm({ ...editForm, categoria: e.target.value })}>
                            <option value="">Sin categoría</option>
                            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        : f.categoria || '—'}
                    </td>
                    <td>{editId === f.id ? <input type="text" value={editForm.subtotal} onChange={e => setEditForm({ ...editForm, subtotal: e.target.value.replace(/[^0-9.]/g, '') })} /> : `S/ ${f.subtotal.toFixed(2)}`}</td>
                    <td>S/ {editId === f.id ? igvEdit : f.igv.toFixed(2)}</td>
                    <td><strong>S/ {editId === f.id ? totalEdit : f.total.toFixed(2)}</strong></td>
                    <td>{editId === f.id ? <input type="date" value={editForm.fecha} onChange={e => setEditForm({ ...editForm, fecha: e.target.value })} /> : f.fecha}</td>
                    <td>
                      {editId === f.id
                        ? <select value={editForm.estado} onChange={e => setEditForm({ ...editForm, estado: e.target.value })}>
                            {estadosDisponibles.map(est => <option key={est} value={est}>{est}</option>)}
                          </select>
                        : <span className={`factura-badge factura-badge--${f.estado.toLowerCase()}`}>{f.estado}</span>}
                    </td>
                    <td>
                      <div className="acciones-col">
                        {editId === f.id ? (
                          <><button className="btn-guardar" onClick={guardarEdicion}>Guardar</button>
                          <button className="btn-cancelar" onClick={cancelarEdicion}>Cancelar</button></>
                        ) : (
                          <><button className="btn-editar" onClick={() => iniciarEdicion(f)}>Editar</button>
                          <button className="btn-eliminar-gasto" onClick={() => eliminarFactura(f.id)}>Eliminar</button></>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {facturas.length === 0 && (
                  <tr><td colSpan="11" style={{ textAlign: 'center', color: '#999' }}>No hay facturas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facturas;

