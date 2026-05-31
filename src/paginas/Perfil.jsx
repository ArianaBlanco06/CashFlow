import { useState } from 'react';
import '../estilos/perfil.css';

const Perfil = ({ usuario, setUsuarios, usuarios }) => {
  const [nombre, setNombre]   = useState(usuario.nombre);
  const [correo, setCorreo]   = useState(usuario.correo || '');
  const [clave, setClave]     = useState('');
  const [confirm, setConfirm] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError]     = useState('');

  const guardar = () => {
    setMensaje('');
    setError('');

    if (nombre.trim() === '') {
      setError('El nombre no puede estar vacío.');
      return;
    }
    if (clave !== '' && clave.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (clave !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

 
    const actualizados = usuarios.map(u => {
      if (u.id === usuario.id) {
        return {
          ...u,
          nombre: nombre.trim(),
          correo: correo.trim(),
          ...(clave !== '' && { clave }),
        };
      }
      return u;
    });

    setUsuarios(actualizados);
    setClave('');
    setConfirm('');
    setMensaje('✅ Cambios guardados correctamente.');
  };

  return (
    <div className="perfil-page">
      <h2>⚙️ Configuración de Perfil</h2>
      <p className="perfil-subtitulo">
        Administra tu información personal. Los cambios se reflejan de inmediato.
      </p>

      <div className="perfil-card">

        {/* Avatar */}
        <div className="perfil-avatar-grande">
          {nombre.charAt(0).toUpperCase()}
        </div>

        <p className="perfil-rol">
          {usuario.rol === 'admin' ? '🛡 Administrador' : '👤 Usuario'}
        </p>

        <div className="form-grupo">
          <label>Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-grupo">
          <label>Correo electrónico</label>
          <input
            type="text"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div className="perfil-separador">
          <span>Cambiar contraseña (opcional)</span>
        </div>

        <div className="form-grupo">
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={clave}
            onChange={e => setClave(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="form-grupo">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repite la nueva contraseña"
          />
        </div>

        {error   && <div className="perfil-error">{error}</div>}
        {mensaje && <div className="perfil-exito">{mensaje}</div>}

        <button className="perfil-btn" onClick={guardar}>
          Guardar cambios
        </button>

      </div>
    </div>
  );
};

export default Perfil;
