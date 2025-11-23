import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/authContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { EdicionProvider } from './context/EdicionContext.jsx';
import { ModalProvider } from './context/ModalContext.jsx'; // 1. Importamos el nuevo provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Envolvemos todo con ModalProvider */}
      <ModalProvider>
        <AuthProvider>
          <CarritoProvider>
            <EdicionProvider>
              <App />
            </EdicionProvider>
          </CarritoProvider>
        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
