import axios from 'axios';

// Usamos la IP directa que nos funcionó en Thunder Client
const API_URL = 'http://127.0.0.1:3001/auth';

export const loginService = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  
  // Si la API nos devuelve el token, lo guardamos en el LocalStorage
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response.data;
};

// Función útil para cuando el usuario quiera cerrar sesión
export const logoutService = () => {
  localStorage.removeItem('token');
};