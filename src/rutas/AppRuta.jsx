import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { mockExpenses } from '../data/mock.Expenses';
import { mockUsuarios } from '../data/mock.Usuarios';

import Login          from '../paginas/Login';
import Gastos         from '../paginas/Gastos';
import Reportes       from '../paginas/Reportes';
import ReporteFiltros from '../paginas/ReporteFiltros';
import Perfil from '../paginas/Perfil';
import MainLayout from '../componentes/MainLayout';

const AppRuta = () => (
  <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/reporteFiltros" element={<ReporteFiltros />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);
import Perfil         from '../paginas/Perfil';
import Usuarios       from '../paginas/Usuarios';
import MainLayout     from '../componentes/MainLayout';
import Dashboard      from '../paginas/Dashboard';

const AppRuta = () => {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [expenses, setExpenses]           = useState(mockExpenses);
  const [usuarios, setUsuarios]           = useState(mockUsuarios);

  // Sin sesión → Login
  if (!usuarioActivo) {
    return (
      <Login
        onLogin={(u) => setUsuarioActivo(u)}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
      />
    );
  }

  return (
    <BrowserRouter>
      <MainLayout
        usuario={usuarioActivo.nombre}
        rol={usuarioActivo.rol}
        onLogout={() => setUsuarioActivo(null)}
      >
        <Routes>
          <Route path="/"               element={<Navigate to="/expenses" />} />
          <Route path="/dashboard"      element={<Dashboard expenses={expenses} />} />
          <Route path="/expenses"       element={<Gastos expenses={expenses} setExpenses={setExpenses} />} />
          <Route path="/reportes"       element={<Reportes expenses={expenses} />} />
          <Route path="/reporteFiltros" element={<ReporteFiltros expenses={expenses} />} />
          <Route path="/perfil"         element={<Perfil usuario={usuarioActivo} />} />

import Perfil         from '../paginas/Perfil';
import Usuarios       from '../paginas/Usuarios';
import MainLayout     from '../componentes/MainLayout';

const AppRuta = () => {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [expenses, setExpenses]           = useState(mockExpenses);
  const [usuarios, setUsuarios]           = useState(mockUsuarios);

  // Sin sesión → Login
  if (!usuarioActivo) {
    return (
      <Login
        onLogin={(u) => setUsuarioActivo(u)}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
      />
    );
  }

  return (
    <BrowserRouter>
      <MainLayout
        usuario={usuarioActivo.nombre}
        rol={usuarioActivo.rol}
        onLogout={() => setUsuarioActivo(null)}
      >
        <Routes>
          <Route path="/"               element={<Navigate to="/expenses" />} />
          <Route path="/expenses"       element={<Gastos expenses={expenses} setExpenses={setExpenses} />} />
          <Route path="/reportes"       element={<Reportes expenses={expenses} />} />
          <Route path="/reporteFiltros" element={<ReporteFiltros expenses={expenses} />} />
          <Route path="/perfil"         element={<Perfil usuario={usuarioActivo} />} />

          {/* Rutas exclusivas del admin */}
          <Route path="/invoices" element={
            usuarioActivo.rol === 'admin'
              ? <div><h2>🧾 Facturas</h2><p>En construcción.</p></div>
              : <Navigate to="/expenses" />
          } />
          <Route path="/admin/users" element={
            usuarioActivo.rol === 'admin'
              ? <Usuarios usuarios={usuarios} setUsuarios={setUsuarios} />
              : <Navigate to="/expenses" />
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};


export default AppRuta;
