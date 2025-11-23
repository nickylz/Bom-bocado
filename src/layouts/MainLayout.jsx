import { Outlet } from "react-router-dom";
import NavBar from "../componentes/NavBar";
import { CarritoFlotante } from "../componentes/CarritoFlotante";
import Footer from "../componentes/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CarritoFlotante />
      <Footer />
    </div>
  );
}
