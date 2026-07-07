import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

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