import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login          from '../paginas/Login';
import Dashboard      from '../paginas/Dashboard';
import Gastos         from '../paginas/Gastos';
import Facturas       from '../paginas/Facturas';
import Reportes       from '../paginas/Reportes';
import ReporteFiltros from '../paginas/ReporteFiltros';
import Perfil         from '../paginas/Perfil';
import Usuarios       from '../paginas/Usuarios';
import MainLayout     from '../componentes/MainLayout';

const API_URL = import.meta.env.VITE_API_URL;

// Configura axios para mandar el token en cada petición
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AppRuta = () => {
  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const guardado = localStorage.getItem('usuarioActivo');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [usuarios, setUsuarios]     = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [facturas, setFacturas]     = useState([]);
  const [expenses, setExpenses]     = useState([]);
  const [metaMensual, setMetaMensual] = useState(500);

  // Cargar datos desde la API cuando hay un usuario logueado
  useEffect(() => {
    if (!usuarioActivo) return;

    axios.get(`${API_URL}/categorias`)
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Error al cargar categorias:', err));

    axios.get(`${API_URL}/gastos?id_usuario=${usuarioActivo.id}`)
      .then(res => setExpenses(res.data))
      .catch(err => console.error('Error al cargar gastos:', err));

    axios.get(`${API_URL}/facturas?id_usuario=${usuarioActivo.id}`)
      .then(res => setFacturas(res.data))
      .catch(err => console.error('Error al cargar facturas:', err));

    if (usuarioActivo.rol === 'admin') {
      axios.get(`${API_URL}/usuarios`)
        .then(res => setUsuarios(res.data))
        .catch(err => console.error('Error al cargar usuarios:', err));
    }
  }, [usuarioActivo]);

  const handleLogin = (u) => {
    localStorage.setItem('usuarioActivo', JSON.stringify(u));
    setUsuarioActivo(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioActivo');
    setUsuarioActivo(null);
  };

  // --- Gastos ---
  const crearGasto = async (nuevoGasto) => {
    const { data } = await axios.post(`${API_URL}/gastos`, {
      ...nuevoGasto,
      id_usuario: usuarioActivo.id,
    });
    setExpenses(prev => [data, ...prev]);
  };

  const actualizarGasto = async (id, cambios) => {
    const { data } = await axios.put(`${API_URL}/gastos/${id}`, cambios);
    setExpenses(prev => prev.map(g => (g.id_gasto === id ? data : g)));
  };

  const eliminarGasto = async (id) => {
    await axios.delete(`${API_URL}/gastos/${id}`);
    setExpenses(prev => prev.filter(g => g.id_gasto !== id));
  };

  // --- Categorías ---
  const crearCategoria = async (nombre_categoria) => {
    const { data } = await axios.post(`${API_URL}/categorias`, { nombre_categoria });
    setCategorias(prev => [...prev, data]);
  };

  const eliminarCategoria = async (id_categoria) => {
    await axios.delete(`${API_URL}/categorias/${id_categoria}`);
    setCategorias(prev => prev.filter(c => c.id_categoria !== id_categoria));
  };

  // --- Facturas ---
  const crearFactura = async (nuevaFactura) => {
    const { data } = await axios.post(`${API_URL}/facturas`, {
      ...nuevaFactura,
      id_usuario: usuarioActivo.id,
    });
    setFacturas(prev => [data, ...prev]);
  };

  if (!usuarioActivo) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <MainLayout
        usuario={usuarioActivo.nombre}
        rol={usuarioActivo.rol}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <Dashboard
              expenses={expenses}
              metaMensual={metaMensual}
              setMetaMensual={setMetaMensual}
              categorias={categorias}
            />
          } />
          <Route path="/expenses" element={
            <Gastos
              expenses={expenses}
              crearGasto={crearGasto}
              actualizarGasto={actualizarGasto}
              eliminarGasto={eliminarGasto}
              categorias={categorias}
              crearCategoria={crearCategoria}
              eliminarCategoria={eliminarCategoria}
            />
          } />
          <Route path="/reportes" element={
            <Reportes expenses={expenses} metaMensual={metaMensual} categorias={categorias} />
          } />
          <Route path="/reporteFiltros" element={<ReporteFiltros expenses={expenses} categorias={categorias} />} />
          <Route path="/perfil" element={
            <Perfil usuario={usuarioActivo} />
          } />
          <Route path="/invoices" element={
            usuarioActivo.rol === 'admin'
              ? <Facturas facturas={facturas} crearFactura={crearFactura} categorias={categorias} />
              : <Navigate to="/dashboard" />
          } />
          <Route path="/admin/users" element={
            usuarioActivo.rol === 'admin'
              ? <Usuarios usuarios={usuarios} />
              : <Navigate to="/dashboard" />
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRuta;