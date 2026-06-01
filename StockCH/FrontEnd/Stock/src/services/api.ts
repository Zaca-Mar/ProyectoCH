import axios from 'axios';

// Configuramos la URL base de tu backend de NestJS
const API = axios.create({
  baseURL: 'http://localhost:3001',
});

// Funciones para interactuar con los endpoints que armamos
export const movimientosService = {
  // Traer todos los movimientos de stock
  getAll: async () => {
    const response = await API.get('/movimientos-stock');
    return response.data;
  },
  
  // Registrar un nuevo movimiento (Ingreso/Egreso)
  create: async (data: any) => {
    const response = await API.post('/movimientos-stock', data);
    return response.data;
  },
  
  // Filtrar movimientos por taller y estado
  filtrar: async (idTaller: number, idEstado: number) => {
    const response = await API.get(`/movimientos-stock/filtrar?id_taller=${idTaller}&id_estado=${idEstado}`);
    return response.data;
  }
};

// ... (Tus otros servicios como movimientosService se quedan igual)

export const auxiliaresService = {
  getArticulos: async () => (await API.get('/articulos')).data,
  getColores: async () => (await API.get('/color')).data,
  getTalleres: async () => (await API.get('/taller')).data,
  getEstados: async () => (await API.get('/estado')).data,
  getLocalidades: async () => (await API.get('/localidad')).data, 
  
  createArticulo: async (data: { nombre: string }) => {
    const response = await API.post('/articulos', data); // Asegúrate de que coincida con tu ruta de NestJS
    return response.data;
  },
  createColor: async (data: { nombre: string }) => {
    const response = await API.post('/color', data);
    return response.data;
  },
  createTaller: async (data: { nombre: string; calle: string; numero: number; id_localidad: number }) => {
    const response = await API.post('/taller', data);
    return response.data;
  },
};