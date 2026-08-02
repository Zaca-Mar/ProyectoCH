import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'stock_token';

export const loginService = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  const { access_token } = response.data;
  localStorage.setItem(TOKEN_KEY, access_token);
  return response.data;
};

export const logoutService = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Chequea que exista un token y que no esté vencido (si el JWT tiene 'exp').
// Si tu backend firma el token sin expiración, esto simplemente confirma que exista.
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      logoutService(); // token vencido: lo limpiamos
      return false;
    }
    return true;
  } catch {
    // Si el token está corrupto o mal formado, lo tratamos como no logueado
    return false;
  }
};