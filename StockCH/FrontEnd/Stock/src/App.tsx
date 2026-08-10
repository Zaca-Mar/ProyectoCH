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
import { HistorialMovimientos } from './pages/HistorialMovimientos'; // 👈 NUEVO
import { isAuthenticated, logoutService } from './services/auth-service';

function App() {
  const [pantallaActual, setPantallaActual] = useState<string>(
    isAuthenticated() ? 'inicio' : 'login'
  );

  const handleLogout = () => {
    logoutService();
    setPantallaActual('login');
  };

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
      case 'egresos': 
        return <EgresosTaller />;
      case 'historial':
        return <HistorialMovimientos />; // 
      case 'login':
        return <Login onLoginSuccess={() => setPantallaActual('inicio')} />;
      default:
        return <Login onLoginSuccess={() => setPantallaActual('inicio')} />;
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {pantallaActual !== 'inicio' && pantallaActual !== 'login' && (
        <nav className="navbar navbar-dark bg-dark px-4 py-2 mb-4 shadow-sm d-flex justify-content-between align-items-center sticky-top">
          <span
            className="navbar-brand fw-bold text-uppercase mb-0"
            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
            onClick={() => setPantallaActual('inicio')}
          >
            ← Volver al Menú Principal
          </span>
          <span
            className="text-white-50 fw-bold text-uppercase"
            style={{ cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </span>
        </nav>
      )}

      {renderPantalla()}
    </div>
  );
}

export default App;
