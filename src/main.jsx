import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/authContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { EdicionProvider } from './context/EdicionContext.jsx'; // Importar EdicionProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <EdicionProvider> {/* Envolver la app con EdicionProvider */}
            <App />
          </EdicionProvider>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
