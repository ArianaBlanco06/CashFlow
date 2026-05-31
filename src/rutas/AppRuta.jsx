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

  const [usuarios, setUsuariosState]       = useState(() => cargar('usuarios', mockUsuarios));
  const [categorias, setCategoriasState]   = useState(() => cargar('categorias', mockCategorias));
  const [facturas, setFacturasState]       = useState(() => cargar('facturas', mockFacturas));
  const [metaMensual, setMetaMensualState] = useState(() => cargar('metaMensual', 500));
  const [expenses, setExpensesState]       = useState(() =>
    cargar('expenses', mockExpenses.map(e => ({ ...e, usuarioId: 1 })))
  );


  const setUsuarios   = (v) => { const n = typeof v === 'function' ? v(usuarios)    : v; setUsuariosState(n);   guardar('usuarios', n);   };
  const setCategorias = (v) => { const n = typeof v === 'function' ? v(categorias)  : v; setCategoriasState(n); guardar('categorias', n); };
  const setFacturas   = (v) => { const n = typeof v === 'function' ? v(facturas)    : v; setFacturasState(n);   guardar('facturas', n);   };
  const setMetaMensual= (v) => { const n = typeof v === 'function' ? v(metaMensual) : v; setMetaMensualState(n);guardar('metaMensual', n);};
  const setExpenses   = (v) => { const n = typeof v === 'function' ? v(expenses)    : v; setExpensesState(n);   guardar('expenses', n);   };


  const misGastos = usuarioActivo
    ? expenses.filter(e => e.usuarioId === usuarioActivo.id)
    : [];

  const setMisGastos = (fn) => {
    setExpenses(prev => {
      const otrosGastos        = prev.filter(e => e.usuarioId !== usuarioActivo.id);
      const gastosActuales     = prev.filter(e => e.usuarioId === usuarioActivo.id);
      const gastosActualizados = typeof fn === 'function' ? fn(gastosActuales) : fn;
      const gastosConId        = gastosActualizados.map(e => ({ ...e, usuarioId: usuarioActivo.id }));
      return [...otrosGastos, ...gastosConId];
    });
  };


  const handleLogin = (u) => {
    const ahora = new Date().toISOString();
    const actualizados = usuarios.map(usr =>
      usr.id === u.id ? { ...usr, ultimoAcceso: ahora } : usr
    );
    setUsuarios(actualizados);
    setUsuarioActivo({ ...u, ultimoAcceso: ahora });
  };

  if (!usuarioActivo) {
    return (
      <Login
        onLogin={handleLogin}
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <Dashboard
              expenses={misGastos}
              metaMensual={metaMensual}
              setMetaMensual={setMetaMensual}
            />
          } />
          <Route path="/expenses" element={
            <Gastos
              expenses={misGastos}
              setExpenses={setMisGastos}
              categorias={categorias}
              setCategorias={setCategorias}
            />
          } />
          <Route path="/reportes" element={
            <Reportes
              expenses={misGastos}
              metaMensual={metaMensual}
            />
          } />
          <Route path="/reporteFiltros" element={<ReporteFiltros expenses={misGastos} />} />
          <Route path="/perfil" element={
            <Perfil
              usuario={usuarioActivo}
              usuarios={usuarios}
              setUsuarios={setUsuarios}
            />
          } />
          <Route path="/invoices" element={
            usuarioActivo.rol === 'admin'
              ? <Facturas facturas={facturas} setFacturas={setFacturas} categorias={categorias} setCategorias={setCategorias} />
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
