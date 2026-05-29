import { useState } from 'react';
import { mockUsuarios } from '../data/mock.Usuarios';

// ── Evalúa la fortaleza de la contraseña ──
const evaluarFortaleza = (clave) => {
  if (clave.length === 0) return null;
  if (clave.length < 6)   return { nivel: 'Débil',   clase: 'fuerza-debil'  };
  if (clave.length < 10 && !/[0-9]/.test(clave))  return { nivel: 'Media',   clase: 'fuerza-media'  };
  if (clave.length >= 10 || (/[0-9]/.test(clave) && /[A-Z]/.test(clave))) return { nivel: 'Fuerte', clase: 'fuerza-fuerte' };
  return { nivel: 'Media', clase: 'fuerza-media' };
};

const Login = ({ onLogin, usuarios, setUsuarios }) => {
  const [vista, setVista]           = useState('login'); // 'login' | 'registro' | 'bienvenida'
  const [usuarioInput, setUsuarioInput] = useState('');
  const [claveInput, setClaveInput]     = useState('');
  const [errorLogin, setErrorLogin]     = useState('');

  // Campos de registro
  const [regNombre,   setRegNombre]   = useState('');
  const [regUsuario,  setRegUsuario]  = useState('');
  const [regClave,    setRegClave]    = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');
  const [regNombreError,  setRegNombreError]  = useState('');
  const [regUsuarioError, setRegUsuarioError] = useState('');
  const [regClaveError,   setRegClaveError]   = useState('');
  const [regConfirmError, setRegConfirmError] = useState('');
  const [nombreRegistrado, setNombreRegistrado] = useState('');

  const fortaleza = evaluarFortaleza(regClave);

  // ── LOGIN ──
  const handleLogin = () => {
    if (usuarioInput.trim() === '' || claveInput.trim() === '') {
      setErrorLogin('Por favor completa todos los campos.');
      return;
    }
    const encontrado = usuarios.find(
      u => u.usuario === usuarioInput && u.clave === claveInput
    );
    if (!encontrado) {
      setErrorLogin('Usuario o contraseña incorrectos.');
      return;
    }
    if (encontrado.estado === 'suspendido') {
      setErrorLogin('Tu cuenta está suspendida. Contacta al administrador.');
      return;
    }
    setErrorLogin('');
    onLogin(encontrado);
  };

  // ── REGISTRO ──
  const handleRegistro = () => {
    let valido = true;

    if (regNombre.trim() === '') {
      setRegNombreError('El nombre es obligatorio.');
      valido = false;
    } else {
      setRegNombreError('');
    }

    if (regUsuario.trim() === '') {
      setRegUsuarioError('El usuario es obligatorio.');
      valido = false;
    } else if (usuarios.find(u => u.usuario === regUsuario.trim())) {
      setRegUsuarioError('Este usuario ya existe.');
      valido = false;
    } else {
      setRegUsuarioError('');
    }

    if (regClave.length < 6) {
      setRegClaveError('La contraseña debe tener al menos 6 caracteres.');
      valido = false;
    } else {
      setRegClaveError('');
    }

    if (regConfirm !== regClave) {
      setRegConfirmError('Las contraseñas no coinciden.');
      valido = false;
    } else {
      setRegConfirmError('');
    }

    if (!valido) return;

    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: regNombre.trim(),
      usuario: regUsuario.trim(),
      clave: regClave,
      rol: 'usuario',
      estado: 'activo'
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setNombreRegistrado(regNombre.trim());

    // Limpiar campos
    setRegNombre(''); setRegUsuario(''); setRegClave(''); setRegConfirm('');
    setVista('bienvenida');

    // Redirigir al login tras 2.5 segundos
    setTimeout(() => setVista('login'), 2500);
  };

  // ── VISTA: BIENVENIDA ──
  if (vista === 'bienvenida') {
    return (
      <div className="login-fondo">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icono">🎉</span>
            <h1 className="login-titulo">¡Bienvenido!</h1>
            <p className="login-subtitulo">Tu cuenta fue creada exitosamente, {nombreRegistrado}.</p>
          </div>
          <div className="login-body">
            <p style={{ textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── VISTA: REGISTRO ──
  if (vista === 'registro') {
    return (
      <div className="login-fondo">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icono">📝</span>
            <h1 className="login-titulo">Crear cuenta</h1>
            <p className="login-subtitulo">Completa los campos para registrarte</p>
          </div>
          <div className="login-body">

            <div className="login-campo">
              <label>Nombre completo</label>
              <input type="text" placeholder="Ej: Juan Pérez" value={regNombre} onChange={e => setRegNombre(e.target.value)} />
              {regNombreError && <span className="login-campo-error">{regNombreError}</span>}
            </div>

            <div className="login-campo">
              <label>Usuario</label>
              <input type="text" placeholder="Ej: juan123" value={regUsuario} onChange={e => setRegUsuario(e.target.value)} />
              {regUsuarioError && <span className="login-campo-error">{regUsuarioError}</span>}
            </div>

            <div className="login-campo">
              <label>Contraseña</label>
              <input type="password" placeholder="Mínimo 6 caracteres" value={regClave} onChange={e => setRegClave(e.target.value)} />
              {regClave.length > 0 && fortaleza && (
                <div className="fuerza-contenedor">
                  <div className={`fuerza-barra ${fortaleza.clase}`}></div>
                  <span className={`fuerza-texto ${fortaleza.clase}`}>{fortaleza.nivel}</span>
                </div>
              )}
              {regClaveError && <span className="login-campo-error">{regClaveError}</span>}
            </div>

            <div className="login-campo">
              <label>Confirmar contraseña</label>
              <input type="password" placeholder="Repite tu contraseña" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
              {regConfirmError && <span className="login-campo-error">{regConfirmError}</span>}
            </div>

            <button className="login-btn" onClick={handleRegistro}>
              Crear cuenta
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
              ¿Ya tienes cuenta?{' '}
              <span className="login-link" onClick={() => setVista('login')}>
                Inicia sesión
              </span>
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ── VISTA: LOGIN ──
  return (
    <div className="login-fondo">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icono">💰</span>
          <h1 className="login-titulo">Gestor de Gastos</h1>
          <p className="login-subtitulo">Inicia sesión para continuar</p>
        </div>
        <div className="login-body">

          <div className="login-campo">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ej: admin"
              value={usuarioInput}
              onChange={e => { setUsuarioInput(e.target.value); setErrorLogin(''); }}
            />
          </div>

          <div className="login-campo">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={claveInput}
              onChange={e => { setClaveInput(e.target.value); setErrorLogin(''); }}
            />
          </div>

          {errorLogin && <div className="login-error">⚠ {errorLogin}</div>}

          <button className="login-btn" onClick={handleLogin}>
            Ingresar →
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
            ¿No tienes cuenta?{' '}
            <span className="login-link" onClick={() => setVista('registro')}>
              Regístrate
            </span>
          </p>

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
