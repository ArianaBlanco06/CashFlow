import { useState } from 'react';
import '../estilos/usuarios.css';


const formatearAcceso = (fecha) => {
  if (!fecha) return <span className="acceso-nunca">Nunca</span>;

  const ahora   = new Date();
  const acceso  = new Date(fecha);
  const diffMs  = ahora - acceso;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDias= Math.floor(diffMs / 86400000);

  let texto = '';
  if (diffMin < 1)       texto = 'Ahora mismo';
  else if (diffMin < 60) texto = `Hace ${diffMin} min`;
  else if (diffHrs < 24) texto = `Hace ${diffHrs}h`;
  else if (diffDias < 7) texto = `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`;
  else texto = acceso.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <span className="acceso-fecha" title={acceso.toLocaleString('es-PE')}>
      {texto}
    </span>
  );
};

const Usuarios = ({ usuarios, setUsuarios }) => {
  const [busqueda, setBusqueda]   = useState('');
  const [form, setForm]           = useState({ nombre: '', usuario: '', clave: '', rol: 'usuario' });
  const [formError, setFormError] = useState({});


  const totalAdmins      = usuarios.filter(u => u.rol === 'admin').length;
  const totalUsuarios    = usuarios.filter(u => u.rol === 'usuario').length;
  const totalSuspendidos = usuarios.filter(u => u.estado === 'suspendido').length;


  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.usuario.toLowerCase().includes(busqueda.toLowerCase())
  );


  const toggleRol = (id) => {
    setUsuarios(usuarios.map(u =>
      u.id === id ? { ...u, rol: u.rol === 'admin' ? 'usuario' : 'admin' } : u
    ));
  };


  const toggleEstado = (id) => {
    setUsuarios(usuarios.map(u =>
      u.id === id ? { ...u, estado: u.estado === 'activo' ? 'suspendido' : 'activo' } : u
    ));
  };


  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };


  const agregarUsuario = () => {
    const errores = {};
    if (form.nombre.trim() === '')  errores.nombre  = 'El nombre es obligatorio.';
    if (form.usuario.trim() === '') errores.usuario = 'El usuario es obligatorio.';
    else if (usuarios.find(u => u.usuario === form.usuario.trim())) errores.usuario = 'Este usuario ya existe.';
    if (form.clave.length < 6)     errores.clave   = 'Mínimo 6 caracteres.';

    if (Object.keys(errores).length > 0) { setFormError(errores); return; }

    const nuevo = {
      id: usuarios.length + 1,
      nombre: form.nombre.trim(),
      usuario: form.usuario.trim(),
      clave: form.clave,
      rol: form.rol,
      estado: 'activo',
      ultimoAcceso: null,
    };

    setUsuarios([...usuarios, nuevo]);
    setForm({ nombre: '', usuario: '', clave: '', rol: 'usuario' });
    setFormError({});
  };

  return (
    <div>
      <h2>👥 Gestión de Usuarios</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Administra los usuarios registrados en el sistema.
      </p>

      {/* ── Contadores ── */}
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stats-card">
          <h3>Total Usuarios</h3>
          <p>{usuarios.length}</p>
        </div>
        <div className="stats-card stats-card--top">
          <h3>🛡 Administradores</h3>
          <p>{totalAdmins}</p>
        </div>
        <div className="stats-card stats-card--min">
          <h3>👤 Usuarios normales</h3>
          <p>{totalUsuarios}</p>
        </div>
        <div className="stats-card stats-card--max">
          <h3>🚫 Suspendidos</h3>
          <p>{totalSuspendidos}</p>
        </div>
      </div>

      <div className="usuarios-grid">

        {/* ── Formulario ── */}
        <div className="usuarios-formulario">
          <h3>Agregar usuario</h3>

          <div className="form-grupo">
            <label>Nombre completo</label>
            <input type="text" placeholder="Ej: María López" value={form.nombre}
              onChange={e => { setForm({ ...form, nombre: e.target.value }); setFormError({ ...formError, nombre: '' }); }} />
            {formError.nombre && <span className="usuarios-error">{formError.nombre}</span>}
          </div>

          <div className="form-grupo">
            <label>Usuario</label>
            <input type="text" placeholder="Ej: maria123" value={form.usuario}
              onChange={e => { setForm({ ...form, usuario: e.target.value }); setFormError({ ...formError, usuario: '' }); }} />
            {formError.usuario && <span className="usuarios-error">{formError.usuario}</span>}
          </div>

          <div className="form-grupo">
            <label>Contraseña</label>
            <input type="password" placeholder="Mínimo 6 caracteres" value={form.clave}
              onChange={e => { setForm({ ...form, clave: e.target.value }); setFormError({ ...formError, clave: '' }); }} />
            {formError.clave && <span className="usuarios-error">{formError.clave}</span>}
          </div>

          <div className="form-grupo">
            <label>Rol</label>
            <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button onClick={agregarUsuario} style={{ width: '100%', marginTop: '0.5rem' }}>
            + Agregar usuario
          </button>
        </div>

        {/* ── Tabla ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h3>Usuarios registrados</h3>
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o usuario..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map(u => (
                <tr key={u.id} className={u.estado === 'suspendido' ? 'fila-suspendida' : ''}>
                  <td><strong>{u.nombre}</strong></td>
                  <td style={{ color: '#888', fontSize: '0.85rem' }}>@{u.usuario}</td>
                  <td>
                    <span className={`rol-tag ${u.rol === 'admin' ? 'rol-tag--admin' : 'rol-tag--usuario'}`}>
                      {u.rol === 'admin' ? '🛡 Admin' : '👤 Usuario'}
                    </span>
                  </td>
                  <td>
                    <span className={`estado-tag ${u.estado === 'activo' ? 'estado-tag--activo' : 'estado-tag--suspendido'}`}>
                      {u.estado === 'activo' ? '✅ Activo' : '🚫 Suspendido'}
                    </span>
                  </td>
                  <td>{formatearAcceso(u.ultimoAcceso)}</td>
                  <td>
                    <div className="acciones-col">
                      <button className="btn-editar" onClick={() => toggleRol(u.id)}
                        title={`Cambiar a ${u.rol === 'admin' ? 'Usuario' : 'Admin'}`}>
                        {u.rol === 'admin' ? '→ Usuario' : '→ Admin'}
                      </button>
                      <button
                        className={u.estado === 'activo' ? 'btn-suspender' : 'btn-activar'}
                        onClick={() => toggleEstado(u.id)}>
                        {u.estado === 'activo' ? 'Suspender' : 'Activar'}
                      </button>
                      <button className="btn-eliminar-gasto" onClick={() => eliminarUsuario(u.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;