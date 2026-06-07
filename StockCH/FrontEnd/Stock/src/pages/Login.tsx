import React, { useState } from 'react';
import { loginService } from '../services/auth-service';

// Definimos los tipos de los props que recibe este componente
interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await loginService(username, password);
      
      // En vez de recargar la página, le avisamos a App.tsx 
      // que cambie el estado a 'inicio'
      onLoginSuccess();
      
    } catch (err: any) {
      // Capturamos el error del BackEnd
      if (err.response && err.response.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else {
        setError('Hubo un problema de conexión con el servidor.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '30px', borderRadius: '8px', display: 'flex', flexDirection: 'column', width: '300px', backgroundColor: '#fff' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Iniciar Sesión</h2>
        
        {error && <p style={{ color: 'red', fontSize: '14px', margin: '0 0 16px 0', textAlign: 'center' }}>{error}</p>}

        <label style={{ marginBottom: '8px', fontWeight: 'bold' }}>Usuario</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '8px', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <label style={{ marginBottom: '8px', fontWeight: 'bold' }}>Contraseña</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px', marginBottom: '24px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#212529', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
};