import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reportes from '../paginas/Reportes';
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

export default AppRuta;
