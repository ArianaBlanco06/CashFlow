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

// ── Helpers localStorage ──
const cargar = (clave, valorDefecto) => {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorDefecto;
  } catch {
    return valorDefecto;
  }
};

const guardar = (clave, valor) => {
  localStorage.setItem(clave, JSON.stringify(valor));
};

const AppRuta = () => {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // ── Estados con localStorage ──
  const [usuarios, setUsuariosState] = useState(() => cargar('usuarios', mockUsuarios));
  const [categorias, setCategoriasState] = useState(() => cargar('categorias', mockCategorias));
  const [facturas, setFacturasState] = useState(() => cargar('facturas', mockFacturas));
  const [expenses, setExpensesState] = useState(() =>
    cargar('expenses', mockExpenses.map(e => ({ ...e, usuarioId: 1 })))
  );

  // ── Wrappers que guardan en localStorage al actualizar ──
  const setUsuarios = (valor) => {
    const nuevo = typeof valor === 'function' ? valor(usuarios) : valor;
    setUsuariosState(nuevo);
    guardar('usuarios', nuevo);
  };

  const setCategorias = (valor) => {
    const nuevo = typeof valor === 'function' ? valor(categorias) : valor;
    setCategoriasState(nuevo);
    guardar('categorias', nuevo);
  };

  const setFacturas = (valor) => {
    const nuevo = typeof valor === 'function' ? valor(facturas) : valor;
    setFacturasState(nuevo);
    guardar('facturas', nuevo);
  };

  const setExpenses = (valor) => {
    const nuevo = typeof valor === 'function' ? valor(expenses) : valor;
    setExpensesState(nuevo);
    guardar('expenses', nuevo);
  };

  // ── Gastos filtrados por usuario activo ──
  const misGastos = usuarioActivo
    ? expenses.filter(e => e.usuarioId === usuarioActivo.id)
    : [];

  const setMisGastos = (fn) => {
    setExpenses(prev => {
      const otrosGastos      = prev.filter(e => e.usuarioId !== usuarioActivo.id);
      const gastosActuales   = prev.filter(e => e.usuarioId === usuarioActivo.id);
      const gastosActualizados = typeof fn === 'function' ? fn(gastosActuales) : fn;
      const gastosConId      = gastosActualizados.map(e => ({ ...e, usuarioId: usuarioActivo.id }));
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
          <Route path="/perfil"         element={
            <Perfil
              usuario={usuarioActivo}
              usuarios={usuarios}
              setUsuarios={setUsuarios}
            />
          } />

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