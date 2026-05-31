import { useState } from 'react';
import '../estilos/login.css';

const evaluarFortaleza = (clave) => {
  if (clave.length === 0) return null;
  if (clave.length < 6)   return { nivel: 'Débil',  clase: 'fuerza-debil'  };
  if (clave.length < 10 && !/[0-9]/.test(clave)) return { nivel: 'Media',  clase: 'fuerza-media'  };
  if (clave.length >= 10 || (/[0-9]/.test(clave) && /[A-Z]/.test(clave))) return { nivel: 'Fuerte', clase: 'fuerza-fuerte' };
  return { nivel: 'Media', clase: 'fuerza-media' };
};

const Login = ({ onLogin, usuarios, setUsuarios }) => {
  const [vista, setVista]           = useState('login');
  const [usuarioInput, setUsuarioInput] = useState('');
  const [claveInput, setClaveInput]     = useState('');
  const [errorLogin, setErrorLogin]     = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);

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

  const handleLogin = () => {
    if (usuarioInput.trim() === '' || claveInput.trim() === '') {
      setErrorLogin('Por favor completa todos los campos.');
      return;
    }
    const encontrado = usuarios.find(
      u => u.usuario === usuarioInput && u.clave === claveInput
    );
    if (!encontrado) { setErrorLogin('Usuario o contraseña incorrectos.'); return; }
    if (encontrado.estado === 'suspendido') {
      setErrorLogin('Tu cuenta está suspendida. Contacta al administrador.'); return;
    }
    setErrorLogin('');
    onLogin(encontrado);
  };

  const handleRegistro = () => {
    let valido = true;
    if (regNombre.trim() === '')  { setRegNombreError('El nombre es obligatorio.');             valido = false; } else setRegNombreError('');
    if (regUsuario.trim() === '') { setRegUsuarioError('El usuario es obligatorio.');            valido = false; }
    else if (usuarios.find(u => u.usuario === regUsuario.trim())) { setRegUsuarioError('Este usuario ya existe.'); valido = false; }
    else setRegUsuarioError('');
    if (regClave.length < 6)      { setRegClaveError('Mínimo 6 caracteres.');                   valido = false; } else setRegClaveError('');
    if (regConfirm !== regClave)  { setRegConfirmError('Las contraseñas no coinciden.');         valido = false; } else setRegConfirmError('');
    if (!valido) return;

    const nuevoUsuario = {
      id: usuarios.length + 1,
      nombre: regNombre.trim(),
      usuario: regUsuario.trim(),
      clave: regClave,
      rol: 'usuario',
      estado: 'activo',
      ultimoAcceso: null,
    };
    setUsuarios([...usuarios, nuevoUsuario]);
    setNombreRegistrado(regNombre.trim());
    setRegNombre(''); setRegUsuario(''); setRegClave(''); setRegConfirm('');
    setVista('bienvenida');
    setTimeout(() => setVista('login'), 2500);
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

            <button className="login-btn" onClick={handleRegistro}>Crear cuenta</button>

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
      {/* Lado izquierdo — branding */}
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

      {/* Lado derecho — formulario */}
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

          <button className="login-btn" onClick={handleLogin}>Ingresar →</button>

          <p className="login-switch">
            ¿No tienes cuenta?{' '}
            <span className="login-link" onClick={() => setVista('registro')}>Regístrate</span>
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
