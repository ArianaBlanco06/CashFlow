import { Link, useNavigate } from 'react-router-dom';

const MainLayout = ({ children, usuario = "Juan Pérez" }) => {
  const navigate = useNavigate();

  return (
    <div className="main-layout">

      <header>
        <h1>💰 Gestor de Gastos</h1>
      </header>

      <div className="layout-body">

        <aside className="sidebar">
          <nav>
            <p className="sidebar-titulo">MENÚ</p>
            <ul>
              <li><Link to="/dashboard">📊 Dashboard</Link></li>
              <li><Link to="/expenses">💸 Gastos</Link></li>
              <li><Link to="/invoices">🧾 Facturas</Link></li>
              <li><Link to="/reportes">📈 Reportes</Link></li>
              <li><Link to="/reporteFiltros">🔍 Filtros</Link></li>
            </ul>
          </nav>

          {/* Tarjeta de usuario clickeable → navega a /perfil */}
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