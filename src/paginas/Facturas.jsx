import { useState } from 'react';
import '../estilos/facturas.css';

const estadosDisponibles = ['Emitida', 'Pagada', 'Anulada'];

const generarNumero = (facturas) => {
  const siguiente = facturas.length + 1;
  return `F-${String(siguiente).padStart(3, '0')}`;
};

const Facturas = ({ facturas, crearFactura, actualizarFactura, eliminarFactura, categorias, clientes, crearCliente }) => {
  const [form, setForm] = useState({
    cliente: '', ruc: '', descripcion: '', subtotal: '', id_categoria: '', estado: 'Emitida', fecha: ''
  });
  const [errores, setErrores]   = useState({});
  const [editId, setEditId]     = useState(null);
  const [editForm, setEditForm] = useState({});

  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [errorCategoria, setErrorCategoria] = useState('');
  const [mostrarGestor, setMostrarGestor]   = useState(false);

  const nombreCategoria = (id_categoria) => {
    const cat = categorias.find(c => c.id_categoria === id_categoria);
    return cat ? cat.nombre_categoria : '—';
  };

  const agregarCategoria = async () => {
    const valor = nuevaCategoria.trim();
    if (valor === '') { setErrorCategoria('Ingresa un nombre.'); return; }
    if (categorias.find(c => c.nombre_categoria.toLowerCase() === valor.toLowerCase())) {
      setErrorCategoria('Esta categoría ya existe.'); return;
    }
    setNuevaCategoria('');
    setErrorCategoria('');
    // La creación real de categorías se hace desde Gastos; aquí solo evitamos error si el prop no viene
  };

  const subtotalNum     = parseFloat(form.subtotal) || 0;
  const igvCalc         = (subtotalNum * 0.18).toFixed(2);
  const totalCalc       = (subtotalNum * 1.18).toFixed(2);
  const subtotalEditNum = parseFloat(editForm.subtotal) || 0;
  const igvEdit         = (subtotalEditNum * 0.18).toFixed(2);
  const totalEdit       = (subtotalEditNum * 1.18).toFixed(2);

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

  const agregarFactura = async () => {
    const e = validar(form);
    if (Object.keys(e).length > 0) { setErrores(e); return; }
    try {
      // Busca si el cliente (por RUC) ya existe, si no lo crea
      let cliente = clientes.find(c => c.ruc === form.ruc.trim());
      if (!cliente) {
        cliente = await crearCliente(form.ruc.trim(), form.cliente.trim());
      }

      await crearFactura({
        numero: generarNumero(facturas),
        descripcion: form.descripcion.trim(),
        subtotal: subtotalNum,
        igv: parseFloat(igvCalc),
        total: parseFloat(totalCalc),
        estado: form.estado,
        fecha: form.fecha,
        id_categoria: form.id_categoria || null,
        id_cliente: cliente.id_cliente,
      });

      setForm({ cliente: '', ruc: '', descripcion: '', subtotal: '', id_categoria: '', estado: 'Emitida', fecha: '' });
      setErrores({});
    } catch (error) {
      setErrores({ general: 'Error al guardar la factura en el servidor.' });
    }
  };

  const iniciarEdicion = (f) => {
    setEditId(f.id_factura);
    setEditForm({
      ...f,
      subtotal: f.subtotal.toString(),
      cliente: f.nombre_cliente || '',
    });
  };
  const cancelarEdicion = () => { setEditId(null); setEditForm({}); };

  const guardarEdicion = async () => {
    try {
      await actualizarFactura(editId, {
        numero: editForm.numero,
        descripcion: editForm.descripcion.trim(),
        subtotal: subtotalEditNum,
        igv: parseFloat(igvEdit),
        total: parseFloat(totalEdit),
        estado: editForm.estado,
        fecha: editForm.fecha,
        id_categoria: editForm.id_categoria || null,
        id_cliente: editForm.id_cliente,
      });
      cancelarEdicion();
      setErrores({});
    } catch {
      setErrores({ general: 'Error al actualizar la factura.' });
    }
  };

  const handleEliminarFactura = async (id) => {
    try {
      await eliminarFactura(id);
    } catch {
      setErrores({ general: 'Error al eliminar la factura.' });
    }
  };

  const totalFacturado = facturas.reduce((acc, f) => acc + Number(f.total), 0);
  const totalCobrado   = facturas.filter(f => f.estado === 'Pagada').reduce((acc, f) => acc + Number(f.total), 0);
  const totalPendiente = facturas.filter(f => f.estado === 'Emitida').reduce((acc, f) => acc + Number(f.total), 0);

  return (
    <div className="facturas-page">
      <h2>🧾 Facturas</h2>
      <p className="facturas-subtitulo">Gestiona las facturas emitidas a tus clientes.</p>

      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stats-card"><h3>Total Facturado</h3><p>S/ {totalFacturado.toFixed(2)}</p></div>
        <div className="stats-card stats-card--min"><h3>✅ Cobrado</h3><p>S/ {totalCobrado.toFixed(2)}</p></div>
        <div className="stats-card stats-card--top"><h3>⏳ Por cobrar</h3><p>S/ {totalPendiente.toFixed(2)}</p></div>
        <div className="stats-card stats-card--max"><h3>📄 N° Facturas</h3><p>{facturas.length}</p></div>
      </div>

      <div className="facturas-grid">

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
            <select value={form.id_categoria} onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
              <option value="">Sin categoría</option>
              {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>)}
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

          {errores.general && <span className="facturas-error">{errores.general}</span>}

          <button onClick={agregarFactura} style={{ width: '100%', marginTop: '0.5rem' }}>
            + Emitir Factura
          </button>
        </div>

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
                  <tr key={f.id_factura} className={editId === f.id_factura ? 'fila-editando' : ''}>
                    <td><strong>{f.numero}</strong></td>
                    <td>{f.nombre_cliente || '—'}</td>
                    <td>{f.ruc || '—'}</td>
                    <td>{editId === f.id_factura ? <input type="text" value={editForm.descripcion} onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })} /> : f.descripcion}</td>
                    <td>
                      {editId === f.id_factura
                        ? <select value={editForm.id_categoria || ''} onChange={e => setEditForm({ ...editForm, id_categoria: e.target.value })}>
                            <option value="">Sin categoría</option>
                            {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>)}
                          </select>
                        : nombreCategoria(f.id_categoria)}
                    </td>
                    <td>{editId === f.id_factura ? <input type="text" value={editForm.subtotal} onChange={e => setEditForm({ ...editForm, subtotal: e.target.value.replace(/[^0-9.]/g, '') })} /> : `S/ ${Number(f.subtotal).toFixed(2)}`}</td>
                    <td>S/ {editId === f.id_factura ? igvEdit : Number(f.igv).toFixed(2)}</td>
                    <td><strong>S/ {editId === f.id_factura ? totalEdit : Number(f.total).toFixed(2)}</strong></td>
                    <td>{editId === f.id_factura ? <input type="date" value={editForm.fecha?.slice(0,10)} onChange={e => setEditForm({ ...editForm, fecha: e.target.value })} /> : String(f.fecha).slice(0,10)}</td>
                    <td>
                      {editId === f.id_factura
                        ? <select value={editForm.estado} onChange={e => setEditForm({ ...editForm, estado: e.target.value })}>
                            {estadosDisponibles.map(est => <option key={est} value={est}>{est}</option>)}
                          </select>
                        : <span className={`factura-badge factura-badge--${f.estado.toLowerCase()}`}>{f.estado}</span>}
                    </td>
                    <td>
                      <div className="acciones-col">
                        {editId === f.id_factura ? (
                          <><button className="btn-guardar" onClick={guardarEdicion}>Guardar</button>
                          <button className="btn-cancelar" onClick={cancelarEdicion}>Cancelar</button></>
                        ) : (
                          <><button className="btn-editar" onClick={() => iniciarEdicion(f)}>Editar</button>
                          <button className="btn-eliminar-gasto" onClick={() => handleEliminarFactura(f.id_factura)}>Eliminar</button></>
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
