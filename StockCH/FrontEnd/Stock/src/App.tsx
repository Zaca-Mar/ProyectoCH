import { useState } from 'react';
import { MovimientosStock } from './pages/MovimientosStock';
import { Inicio } from './pages/home'; 
import { Talleres } from './pages/Talleres'; 
import { Articulos } from './pages/Articulos'; 
import { Consultas } from './pages/Consultas'; 
import { Colores } from './pages/Colores'; 
import { Localidades } from './pages/Localidades';
import { EgresosTaller } from './pages/EgresosTaller';
import { Login } from './pages/Login';

function App() {
  // Arranca en 'login' de forma predeterminada
  const [pantallaActual, setPantallaActual] = useState<string>('login');

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

      case 'localidades':
        return <Localidades />;

      case 'egresos-taller':
        return <EgresosTaller />;

      case 'login':
        // 1. Le pasamos la función de navegación al Login
        return <Login onLoginSuccess={() => setPantallaActual('inicio')} />;

      default:
        return <Login onLoginSuccess={() => setPantallaActual('inicio')} />;
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* 2. Modificamos la condición para que NO muestre la barra ni en 'inicio' ni en 'login' */}
      {pantallaActual !== 'inicio' && pantallaActual !== 'login' && (
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