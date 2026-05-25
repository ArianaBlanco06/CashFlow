import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRuta from './rutas/AppRuta';
import './estilos/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRuta />
  </React.StrictMode>
);