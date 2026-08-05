import React, { useState } from 'react';
import { loginService } from '../services/auth-service';
// 🧵 Importamos la imagen desde la ruta que me pasaste
import fondoTelas from '../../img/muestras-tela.jpg'; 

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      await loginService(username, password);
      onLoginSuccess();
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('Hubo un problema de conexión con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', overflow: 'hidden' }}>
      
      {/* 📸 MITAD IZQUIERDA: Bloque de la Imagen de la IA (Se oculta en celulares para que no rompa) */}
      <div style={{
        flex: 1,
        backgroundImage: `url(${fondoTelas})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: window.innerWidth < 768 ? 'none' : 'flex', // Responsivo básico por JS
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: 'inset -15px 0px 30px rgba(0,0,0,0.05)'
      }}>
        {/* Capa sutil arriba de la foto para darle un toque premium y leer el texto */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#1a1a1a', padding: '20px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, letterSpacing: '8px', textTransform: 'uppercase' }}>
            STOCK 
          </h1>
          <p style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#141516', letterSpacing: '3px', marginTop: '10px', fontWeight: 600 }}>
            Control de Stock & Talleres
          </p>
          <div style={{ height: '2px', width: '50px', backgroundColor: '#1a1a1a', margin: '20px auto 0 auto' }}></div>
        </div>
      </div>

      {/* 🔒 MITAD DERECHA: Formulario de Login */}
      <div style={{
        flex: window.innerWidth < 768 ? '1' : '0 0 450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '320px' }}>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1.6rem', letterSpacing: '1px' }}>
              Iniciar Sesión
            </h2>
            <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
              Ingresá al panel de gestión física de la marca.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {error && <p style={{ color: '#dc3545', fontSize: '14px', margin: '0 0 16px 0', fontWeight: '600' }}>{error}</p>}

            <label style={{ marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Usuario
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Ej: admin"
              style={{ padding: '10px', marginBottom: '16px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }}
            />

            <label style={{ marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              style={{ padding: '10px', marginBottom: '24px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }}
            />

            <button 
              type="submit" 
              disabled={isLoading}
              style={{ padding: '12px', backgroundColor: '#1a1a1a', color: 'white', border: 'none', borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px', transition: 'background-color 0.2s', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#adb5bd', fontSize: '11px', marginTop: '50px', marginBottom: 0 }}>
            &copy; {new Date().getFullYear()} JJJACOBO E HIJOS SA. Todos los derechos reservados.
          </p>
        </div>
      </div>

    </div>
  );
};