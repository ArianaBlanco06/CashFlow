import { useState } from 'react';
import axios from 'axios';
import '../estilos/login.css';

const API_URL = import.meta.env.VITE_API_URL;

const evaluarFortaleza = (clave) => {
  if (clave.length === 0) return null;
  if (clave.length < 6)   return { nivel: 'Débil',  clase: 'fuerza-debil'  };
  if (clave.length < 10 && !/[0-9]/.test(clave)) return { nivel: 'Media',  clase: 'fuerza-media'  };
  if (clave.length >= 10 || (/[0-9]/.test(clave) && /[A-Z]/.test(clave))) return { nivel: 'Fuerte', clase: 'fuerza-fuerte' };
  return { nivel: 'Media', clase: 'fuerza-media' };
};

const Login = ({ onLogin }) => {
  const [vista, setVista]           = useState('login');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [claveInput, setClaveInput]     = useState('');
  const [errorLogin, setErrorLogin]     = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando]         = useState(false);

  const [regNombre,  setRegNombre]  = useState('');
  const [regUsuario, setRegUsuario] = useState('');
  const [regClave,   setRegClave]   = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regNombreError,  setRegNombreError]  = useState('');
  const [regUsuarioError, setRegUsuarioError] = useState('');
  const [regClaveError,   setRegClaveError]   = useState('');
  const [regConfirmError, setRegConfirmError] = useState('');
  const [nombreRegistrado, setNombreRegistrado] = useState('');

  const fortaleza = evaluarFortaleza(regClave);

  const handleLogin = async () => {
    if (usuarioInput.trim() === '' || claveInput.trim() === '') {
      setErrorLogin('Por favor completa todos los campos.');
      return;
    }
    setCargando(true);
    setErrorLogin('');
    try {
      const { data } = await axios.post(`${API_URL}/usuarios/login`, {
        usuario: usuarioInput,
        clave: claveInput,
      });
      localStorage.setItem('token', data.token);
      onLogin(data.usuario);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorLogin('Usuario o contraseña incorrectos.');
      } else {
        setErrorLogin('Error al conectar con el servidor.');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async () => {
    let valido = true;
    if (regNombre.trim() === '')  { setRegNombreError('El nombre es obligatorio.'); valido = false; } else setRegNombreError('');
    if (regUsuario.trim() === '') { setRegUsuarioError('El usuario es obligatorio.'); valido = false; } else setRegUsuarioError('');
    if (regClave.length < 6)      { setRegClaveError('Mínimo 6 caracteres.'); valido = false; } else setRegClaveError('');
    if (regConfirm !== regClave)  { setRegConfirmError('Las contraseñas no coinciden.'); valido = false; } else setRegConfirmError('');
    if (!valido) return;

    setCargando(true);
    try {
      await axios.post(`${API_URL}/usuarios/registro`, {
        nombre: regNombre.trim(),
        usuario: regUsuario.trim(),
        clave: regClave,
      });
      setNombreRegistrado(regNombre.trim());
      setRegNombre(''); setRegUsuario(''); setRegClave(''); setRegConfirm('');
      setVista('bienvenida');
      setTimeout(() => setVista('login'), 2500);
    } catch (error) {
      if (error.response?.status === 409) {
        setRegUsuarioError('Este usuario ya existe.');
      } else {
        setRegUsuarioError('Error al conectar con el servidor.');
      }
    } finally {
      setCargando(false);
    }
  };

  if (vista === 'bienvenida') {
    return (
      <div className="login-fondo">
        <div className="login-izq">
          <div className="login-brand">
            <span className="login-logo">💰</span>
            <span className="login-app-nombre">CashFlow</span>
          </div>
        </div>
        <div className="login-der">
          <div className="login-card">
            <div className="login-card-header">
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <h2>¡Bienvenido, {nombreRegistrado}!</h2>
              <p>Tu cuenta fue creada exitosamente.</p>
            </div>
            <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem', marginTop: '1rem' }}>
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'registro') {
    return (
      <div className="login-fondo">
        <div className="login-izq">
          <div className="login-brand">
            <span className="login-logo">💰</span>
            <span className="login-app-nombre">CashFlow</span>
          </div>
          <h1 className="login-tagline">Gestiona tus finanzas<br />con inteligencia.</h1>
          <p className="login-desc">Registra gastos, emite facturas, visualiza reportes y toma
          decisiones basadas en datos reales.</p>
          <div className="login-features">
            <div className="login-feature"><span>📊</span><span>Dashboard financiero en tiempo real</span></div>
            <div className="login-feature"><span>🧾</span><span>Gestión de gastos y facturas</span></div>
            <div className="login-feature"><span>🎯</span><span>Control de metas y presupuesto</span></div>
            <div className="login-feature"><span>🔔</span><span>Recordatorios y alertas de vencimiento</span></div>
          </div>
        </div>

        <div className="login-der">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Crear cuenta</h2>
              <p>Completa los campos para registrarte</p>
            </div>

            <div className="login-campo">
              <label>Nombre completo</label>
              <input type="text" autoComplete="off" placeholder="Ej: Juan Pérez" value={regNombre}
                onChange={e => setRegNombre(e.target.value)} />
              {regNombreError && <span className="login-campo-error">{regNombreError}</span>}
            </div>

            <div className="login-campo">
              <label>Usuario</label>
              <input type="text" autoComplete="off"  placeholder="Ej: juan123" value={regUsuario}
                onChange={e => setRegUsuario(e.target.value)} />
              {regUsuarioError && <span className="login-campo-error">{regUsuarioError}</span>}
            </div>

            <div className="login-campo">
              <label>Contraseña</label>
              <input type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={regClave}
                onChange={e => setRegClave(e.target.value)} />
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
              <input type="password" autoComplete="new-password" placeholder="Repite tu contraseña" value={regConfirm}
                onChange={e => setRegConfirm(e.target.value)} />
              {regConfirmError && <span className="login-campo-error">{regConfirmError}</span>}
            </div>

            <button className="login-btn" onClick={handleRegistro} disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear cuenta'}
            </button>

            <p className="login-switch">
              ¿Ya tienes cuenta?{' '}
              <span className="login-link" onClick={() => setVista('login')}>Inicia sesión</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-fondo">
      <div className="login-izq">
        <div className="login-brand">
          <span className="login-logo">💰</span>
          <span className="login-app-nombre">CashFlow</span>
        </div>

        <h1 className="login-tagline">Gestiona tus finanzas<br />con inteligencia.</h1>
        <p className="login-desc">
          Registra gastos, emite facturas, visualiza reportes y toma
          decisiones basadas en datos reales.
        </p>

        <div className="login-features">
          <div className="login-feature"><span>📊</span><span>Dashboard financiero en tiempo real</span></div>
          <div className="login-feature"><span>🧾</span><span>Gestión de gastos y facturas</span></div>
          <div className="login-feature"><span>🎯</span><span>Control de metas y presupuesto</span></div>
          <div className="login-feature"><span>🔔</span><span>Recordatorios y alertas de vencimiento</span></div>
        </div>
      </div>

      <div className="login-der">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Bienvenido de vuelta</h2>
            <p>Inicia sesión para continuar</p>
          </div>

          <div className="login-campo">
            <label>Usuario</label>
            <input
              type="text"
              autoComplete="off"
              placeholder="Ej: admin"
              value={usuarioInput}
              onChange={e => { setUsuarioInput(e.target.value); setErrorLogin(''); }}
            />
          </div>

          <div className="login-campo">
            <label>Contraseña</label>
            <div className="login-input-wrapper">
              <input
                type={mostrarClave ? 'text' : 'password'}
                placeholder="••••••••"
                value={claveInput}
                onChange={e => { setClaveInput(e.target.value); setErrorLogin(''); }}
              />
              <button
                type="button"
                className="login-ojo"
                onClick={() => setMostrarClave(!mostrarClave)}
              >
                {mostrarClave ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {errorLogin && <div className="login-error">⚠ {errorLogin}</div>}

          <button className="login-btn" onClick={handleLogin} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar →'}
          </button>

          <p className="login-switch">
            ¿No tienes cuenta?{' '}
            <span className="login-link" onClick={() => setVista('registro')}>Regístrate</span>
          </p>

          <div className="login-hint">
            <p><strong>Admin:</strong> admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;