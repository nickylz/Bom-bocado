import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // tu componente principal
import "./index.css"; // opcional, si tienes estilos globales

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
