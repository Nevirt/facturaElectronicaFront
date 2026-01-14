import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos TypeScript
export interface DetalleFactura {
  numeroLinea: number;
  codigoProducto: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  descuento: number;
  porcentajeIVA: number;
}

export interface FacturaDTO {
  empresaId: number;
  clienteId: number;
  clienteRUC?: string;
  clienteRazonSocial: string;
  clienteDireccion?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  fechaEmision: string;
  moneda: string;
  condicionVenta?: string;
  plazoCredito?: number;
  observaciones?: string;
  detalles: DetalleFactura[];
}

export interface FacturaResponse {
  id: number;
  numeroDocumento: string;
  empresaId: number;
  estado: string;
  fechaEmision: string;
  total: number;
  codigoAutorizacion?: string;
  qrCode?: string;
  clienteRazonSocial: string;
  detalles?: DetalleFactura[];
}

export interface Empresa {
  id: number;
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export interface Cliente {
  id: number;
  empresaId: number;
  ruc?: string;
  razonSocial: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

// API de Facturas
export const facturasApi = {
  crear: (data: FacturaDTO) => api.post<FacturaResponse>('/facturas', data),
  obtener: (id: number) => api.get<FacturaResponse>(`/facturas/${id}`),
  listar: (empresaId: number, fechaDesde?: string, fechaHasta?: string) => {
    const params = new URLSearchParams({ empresaId: empresaId.toString() });
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);
    return api.get<FacturaResponse[]>(`/facturas?${params.toString()}`).catch((error) => {
      console.error('Error en facturasApi.listar:', error);
      throw error;
    });
  },
  enviar: (id: number) => api.post<FacturaResponse>(`/facturas/${id}/enviar`),
  anular: (id: number, motivo: string) => 
    api.post(`/facturas/${id}/anular`, { motivo }),
  consultarEstado: (id: number) => 
    api.get<{ estado: string }>(`/facturas/${id}/estado`),
};

// API de Empresas (será necesario crear estos endpoints en el backend)
export const empresasApi = {
  listar: () => api.get<Empresa[]>('/empresas'),
  obtener: (id: number) => api.get<Empresa>(`/empresas/${id}`),
  crear: (data: Omit<Empresa, 'id'>) => api.post<Empresa>('/empresas', data),
  actualizar: (id: number, data: Partial<Empresa>) => 
    api.put<Empresa>(`/empresas/${id}`, data),
  eliminar: (id: number) => api.delete(`/empresas/${id}`),
};

// API de Clientes (será necesario crear estos endpoints en el backend)
export const clientesApi = {
  listar: (empresaId?: number) => {
    const params = empresaId ? `?empresaId=${empresaId}` : '';
    return api.get<Cliente[]>(`/clientes${params}`);
  },
  obtener: (id: number) => api.get<Cliente>(`/clientes/${id}`),
  crear: (data: Omit<Cliente, 'id'>) => api.post<Cliente>('/clientes', data),
  actualizar: (id: number, data: Partial<Cliente>) => 
    api.put<Cliente>(`/clientes/${id}`, data),
  eliminar: (id: number) => api.delete(`/clientes/${id}`),
};

export default api;
