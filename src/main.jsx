import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/authContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { EdicionProvider } from './context/EdicionContext.jsx';
import { ModalProvider } from './context/ModalContext.jsx';
import { FavoritosProvider } from './context/FavoritosContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <AuthProvider>
          <FavoritosProvider>
            <CarritoProvider>
              <EdicionProvider>
                <App />
              </EdicionProvider>
            </CarritoProvider>
          </FavoritosProvider>
        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
