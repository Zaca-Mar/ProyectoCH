import axios from 'axios';
// Configuramos la URL base de tu backend de NestJS
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const movimientosService = {
  // Traer todos los movimientos de stock
  getAll: async () => {
    const response = await API.get('/movimientos-stock');
    return response.data;
  },
  
  // 🔄 OPTIMIZADO: Ahora 'data' recibe el objeto individual que armamos en el bucle .map()
  // (incluyendo id_taller, tipo_movimiento, id_articulo, id_talle, id_color, cantidad, id_estado y observacion)
  create: async (data: {
    id_taller: number;
    tipo_movimiento: string;
    id_articulo: number;
    id_talle: number;
    id_color: number;
    cantidad: number;
    id_estado?: number;
    observacion: string | null;
    fecha: string; 
  }) => {
    const response = await API.post('/movimientos-stock', data);
    return response.data;
  },
  
  
  filtrar: async (idTaller: number, idEstado?: number) => {
    let url = `/movimientos-stock/filtrar?id_taller=${idTaller}`;
    
    // Si viene el estado y no es cero, lo agregamos a la consulta
    if (idEstado !== undefined && idEstado !== 0) {
      url += `&id_estado=${idEstado}`;
    }

    const response = await API.get(url);
    return response.data;
  }
};

export const auxiliaresService = {
  getArticulos: async () => (await API.get('/articulos')).data,
  getColores: async () => (await API.get('/color')).data,
  getTalleres: async () => (await API.get('/taller')).data,
  getEstados: async () => (await API.get('/estado')).data,
  getLocalidades: async () => (await API.get('/localidad')).data, 
  getProvincias: async () => (await API.get('/provincia')).data,
  
  // ➕ REVISIÓN: Aseguramos que esté el método de obtener talles que consume el formulario
  getTalles: async () => (await API.get('/talle')).data,

  createArticulo: async (data: { nombre: string }) => {
    const response = await API.post('/articulos', data);
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
  createLocalidad: async (data: { nombre: string; id_provincia: number }) => {
    const response = await API.post('/localidad', data);
    return response.data;
  },
  updateTaller: async (id: number, data: { nombre?: string; calle?: string; numero?: number; id_localidad?: number }) => {
  const response = await API.patch(`/taller/${id}`, data);
  return response.data;
  },
  updateArticulo: async (id: number, data: { nombre?: string }) => {
  const response = await API.patch(`/articulos/${id}`, data);
  return response.data;
  },
  updateColor: async (id: number, data: { nombre?: string }) => {
  const response = await API.patch(`/color/${id}`, data);
  return response.data;
  },
  updateLocalidad: async (id: number, data: { nombre?: string; cp?: string; id_provincia?: number }) => {
  const response = await API.patch(`/localidad/${id}`, data);
  return response.data;
  },
};