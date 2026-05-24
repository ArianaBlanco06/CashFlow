import { useState } from 'react';
import { mockUsuarios } from '../data/mock.Usuarios';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave]     = useState('');
  const [error, setError]     = useState('');

  const handleLogin = () => {
    if (usuario.trim() === '' || clave.trim() === '') {
      setError('Por favor completa todos los campos.');
      return;
    }

   
    const encontrado = mockUsuarios.find(
      u => u.usuario === usuario && u.clave === clave
    );

    if (encontrado) {
      setError('');
      onLogin(encontrado); // sube el usuario al estado de AppRuta
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-fondo">
      <div className="login-card">

        {/* Cabecera */}
        <div className="login-header">
          <span className="login-icono">💰</span>
          <h1 className="login-titulo">Gestor de Gastos</h1>
          <p className="login-subtitulo">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <div className="login-body">

          <div className="login-campo">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ej: admin"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
            />
          </div>

          <div className="login-campo">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={clave}
              onChange={e => setClave(e.target.value)}
            />
          </div>

          {/* Alerta de error */}
          {error && (
            <div className="login-error">
              ⚠ {error}
            </div>
          )}

          <button className="login-btn" onClick={handleLogin}>
            Ingresar →
          </button>

          {/* Hint de credenciales para desarrollo */}
          <div className="login-hint">
            <p><strong>Admin:</strong> admin / 1234</p>
            <p><strong>Usuario:</strong> juan / 1234</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
