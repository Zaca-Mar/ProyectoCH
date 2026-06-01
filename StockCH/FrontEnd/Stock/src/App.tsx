import { useState } from 'react';
import { MovimientosStock } from './pages/MovimientosStock';
import { Inicio } from './pages/home'; 
import { Talleres } from './pages/Talleres'; 
import { Articulos } from './pages/Articulos'; 
import { Consultas } from './pages/Consultas'; 
import {Colores} from './pages/Colores'; 

function App() {
  const [pantallaActual, setPantallaActual] = useState<string>('inicio');

  const renderPantalla = () => {
    switch (pantallaActual) {
      case 'inicio':
        return <Inicio onNavigate={setPantallaActual} />;
      
      case 'movimientos':
        return <MovimientosStock />;
      
      case 'talleres':
        return <Talleres />; 
      
      case 'articulos':
        return <Articulos />; 
      
      case 'consultas':
        return <Consultas />;

      case 'colores':
        return <Colores />; 

      default:
        return <Inicio onNavigate={setPantallaActual} />;
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {pantallaActual !== 'inicio' && (
        <nav className="navbar navbar-dark bg-dark px-4 py-2 mb-4 shadow-sm">
          <span 
            className="navbar-brand fw-bold text-uppercase" 
            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
            onClick={() => setPantallaActual('inicio')}
          >
            ← Volver al Menú Principal
          </span>
        </nav>
      )}

      {renderPantalla()}
    </div>
  );
}

export default App;