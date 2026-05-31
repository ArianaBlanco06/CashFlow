import { Link, useNavigate, useLocation } from 'react-router-dom';

const menuAdmin = [
  { ruta: '/dashboard',      icono: '📊', label: 'Dashboard' },
  { ruta: '/expenses',       icono: '💸', label: 'Gastos'    },
  { ruta: '/invoices',       icono: '🧾', label: 'Facturas'  },
  { ruta: '/reportes',       icono: '📈', label: 'Reportes'  },
  { ruta: '/reporteFiltros', icono: '🔍', label: 'Filtros'   },
  { ruta: '/admin/users',    icono: '👥', label: 'Usuarios'  },
];

const menuUsuario = [
  { ruta: '/dashboard',      icono: '📊', label: 'Dashboard' },
  { ruta: '/expenses',       icono: '💸', label: 'Gastos'    },
  { ruta: '/reportes',       icono: '📈', label: 'Reportes'  },
  { ruta: '/reporteFiltros', icono: '🔍', label: 'Filtros'   },
];

const MainLayout = ({ children, usuario = 'Usuario', rol = 'usuario', onLogout }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const menuItems = rol === 'admin' ? menuAdmin : menuUsuario;

  return (
    <div className="main-layout">

      <header>
        <div className="header-brand">
          <span className="header-logo">💰</span>
          <h1>CashFlow</h1>
        </div>
        <span className={`rol-badge ${rol === 'admin' ? 'rol-badge--admin' : 'rol-badge--usuario'}`}>
          {rol === 'admin' ? '🛡 Administrador' : '👤 Usuario'}
        </span>
      </header>

      <div className="layout-body">

        <aside className="sidebar">
          <nav>
            <p className="sidebar-titulo">MENÚ</p>
            <ul>
              {menuItems.map(item => (
                <li key={item.ruta}>
                  <Link
                    to={item.ruta}
                    className={location.pathname === item.ruta ? 'sidebar-link activo' : 'sidebar-link'}
                  >
                    <span className="sidebar-icono">{item.icono}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-bottom">
            <div
              className="usuario-card"
              onClick={() => navigate('/perfil')}
              title="Ver configuración de perfil"
            >
              <div className="usuario-avatar">
                {usuario.charAt(0).toUpperCase()}
              </div>
              <div className="usuario-info">
                <span className="usuario-nombre">{usuario}</span>
                <span className="usuario-rol">⚙️ Ver perfil</span>
              </div>
            </div>

            <button className="btn-cerrar-sesion" onClick={onLogout}>
              🚪 Cerrar sesión
            </button>
          </div>
        </aside>

        <main>
          <div className="content-container">
            {children}
          </div>
        </main>

      </div>

      <footer>
        © 2026 - Programación Web
      </footer>

    </div>
  );
};

export default MainLayout;
