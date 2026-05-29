import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { mockExpenses } from '../data/mock.Expenses';
import Gastos from '../paginas/Gastos';
import Reportes from '../paginas/Reportes';
import ReporteFiltros from '../paginas/ReporteFiltros';
import Perfil from '../paginas/Perfil';
import MainLayout from '../componentes/MainLayout';

const AppRuta = () => {
  const [expenses, setExpenses] = useState(mockExpenses);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/expenses" element={<Gastos expenses={expenses} setExpenses={setExpenses} />} />
          <Route path="/reportes" element={<Reportes expenses={expenses} />} />
          <Route path="/reporteFiltros" element={<ReporteFiltros expenses={expenses} />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRuta;
