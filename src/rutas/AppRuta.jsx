import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { mockExpenses }   from '../data/mock.Expenses';
import { mockUsuarios }   from '../data/mock.Usuarios';
import { mockCategorias } from '../data/mock.Categorias';
import { mockFacturas }   from '../data/mock.Facturas';

import Login          from '../paginas/Login';
import Dashboard      from '../paginas/Dashboard';
import Gastos         from '../paginas/Gastos';
import Facturas       from '../paginas/Facturas';
import Reportes       from '../paginas/Reportes';
import ReporteFiltros from '../paginas/ReporteFiltros';
import Perfil         from '../paginas/Perfil';
import Usuarios       from '../paginas/Usuarios';
import MainLayout     from '../componentes/MainLayout';

const AppRuta = () => {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [usuarios, setUsuarios]           = useState(mockUsuarios);
  const [categorias, setCategorias]       = useState(mockCategorias);
  const [facturas, setFacturas]           = useState(mockFacturas);

  // Cada gasto tiene un campo "usuarioId" para saber a quién pertenece
  const [expenses, setExpenses] = useState(
    mockExpenses.map(e => ({ ...e, usuarioId: 1 })) // los mock pertenecen al admin
  );

  // ── Filtrar gastos del usuario activo ──
  const misGastos = usuarioActivo
    ? expenses.filter(e => e.usuarioId === usuarioActivo.id)
    : [];

  // ── setMisGastos: actualiza solo los gastos del usuario activo ──
  const setMisGastos = (fn) => {
    setExpenses(prev => {
      // Separar los gastos de otros usuarios
      const otrosGastos = prev.filter(e => e.usuarioId !== usuarioActivo.id);
      // Obtener los gastos actuales del usuario
      const gastosActuales = prev.filter(e => e.usuarioId === usuarioActivo.id);
      // Aplicar la función de actualización solo a los del usuario
      const gastosActualizados = typeof fn === 'function' ? fn(gastosActuales) : fn;
      // Asegurarse que todos tengan el usuarioId correcto
      const gastosConId = gastosActualizados.map(e => ({ ...e, usuarioId: usuarioActivo.id }));
      return [...otrosGastos, ...gastosConId];
    });
  };

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
          <Route path="/"               element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard"      element={<Dashboard expenses={misGastos} />} />
          <Route path="/expenses"       element={
            <Gastos
              expenses={misGastos}
              setExpenses={setMisGastos}
              categorias={categorias}
              setCategorias={setCategorias}
            />
          } />
          <Route path="/reportes"       element={<Reportes expenses={misGastos} />} />
          <Route path="/reporteFiltros" element={<ReporteFiltros expenses={misGastos} />} />
          <Route path="/perfil"         element={<Perfil usuario={usuarioActivo} />} />

          <Route path="/invoices" element={
            usuarioActivo.rol === 'admin'
              ? <Facturas
                  facturas={facturas}
                  setFacturas={setFacturas}
                  categorias={categorias}
                  setCategorias={setCategorias}
                />
              : <Navigate to="/dashboard" />
          } />
          <Route path="/admin/users" element={
            usuarioActivo.rol === 'admin'
              ? <Usuarios usuarios={usuarios} setUsuarios={setUsuarios} />
              : <Navigate to="/dashboard" />
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRuta;
