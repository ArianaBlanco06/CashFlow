import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login          from '../paginas/Login';
import Reportes       from '../paginas/Reportes';
import ReporteFiltros from '../paginas/ReporteFiltros';
import Perfil         from '../paginas/Perfil';
import Gastos         from '../paginas/Gastos';
import MainLayout     from '../componentes/MainLayout';

const AppRuta = () => {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // Sin sesión → mostrar Login
  if (!usuarioActivo) {
    return <Login onLogin={(u) => setUsuarioActivo(u)} />;
  }

  return (
    <BrowserRouter>
      <MainLayout
        usuario={usuarioActivo.nombre}
        rol={usuarioActivo.rol}
        onLogout={() => setUsuarioActivo(null)}
      >
        <Routes>
          <Route path="/"               element={<Navigate to="/reportes" />} />
          <Route path="/expenses"       element={<Gastos />} />
          <Route path="/reportes"       element={<Reportes />} />
          <Route path="/reporteFiltros" element={<ReporteFiltros />} />
          <Route path="/perfil"         element={<Perfil usuario={usuarioActivo} />} />

          {/* Rutas exclusivas del admin */}
          <Route path="/invoices" element={
            usuarioActivo.rol === 'admin'
              ? <div><h2>🧾 Facturas</h2><p>Sección exclusiva del administrador.</p></div>
              : <Navigate to="/reportes" />
          } />
          <Route path="/admin/users" element={
            usuarioActivo.rol === 'admin'
              ? <div><h2>👥 Gestión de Usuarios</h2><p>Sección exclusiva del administrador.</p></div>
              : <Navigate to="/reportes" />
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRuta;