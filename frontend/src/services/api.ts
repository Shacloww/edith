import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  Study,
  StudyStatus,
  CreateStudyForm,
  UpdateStudyForm
} from '../types';

// Konfiguracja axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API BASE URL:', api.defaults.baseURL);

// Interceptory dla obsługi błędów
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Możesz dodać tutaj globalne obsługiwanie błędów
    if (error.response?.status === 401) {
      // Redirect to login if needed
    }
    
    return Promise.reject(error);
  }
);

// Studies API
export const studiesApi = {
  // Pobierz wszystkie badania
  getAll: async (): Promise<ApiResponse<Study[]>> => {
    const response = await api.get<ApiResponse<Study[]>>('/studies');
    return response.data;
  },

  // Pobierz badanie po ID
  getById: async (id: string): Promise<ApiResponse<Study>> => {
    const response = await api.get<ApiResponse<Study>>(`/studies/${id}`);
    return response.data;
  },

  // Utwórz nowe badanie
  create: async (data: CreateStudyForm): Promise<ApiResponse<Study>> => {
    const response = await api.post<ApiResponse<Study>>('/studies', data);
    return response.data;
  },

  // Aktualizuj badanie
  update: async (id: string, data: UpdateStudyForm): Promise<ApiResponse<Study>> => {
    const response = await api.put<ApiResponse<Study>>(`/studies/${id}`, data);
    return response.data;
  },

  // Zmień status badania
  updateStatus: async (id: string, status: StudyStatus): Promise<ApiResponse<Study>> => {
    const response = await api.patch<ApiResponse<Study>>(`/studies/${id}/status`, { status });
    return response.data;
  },

  // Usuń badanie
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/studies/${id}`);
    return response.data;
  },
};

// Predefined Protocols API
export const predefinedProtocolsApi = {
  // Pobierz wszystkie predefiniowane protokoły
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/predefined-protocols');
    return response.data;
  },

  // Pobierz protokół po ID
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/predefined-protocols/${id}`);
    return response.data;
  },

  // Pobierz protokoły według kategorii
  getByCategory: async (category: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/predefined-protocols/category/${category}`);
    return response.data;
  },
};

// Protocols API
export const protocolsApi = {
  // Pobierz wszystkie protokoły
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/protocols');
    return response.data;
  },

  // Pobierz protokół po ID
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/protocols/${id}`);
    return response.data;
  },

  // Utwórz nowy protokół
  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/protocols', data);
    return response.data;
  },

  // Aktualizuj protokół
  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put<ApiResponse<any>>(`/protocols/${id}`, data);
    return response.data;
  },

  // Usuń protokół
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/protocols/${id}`);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; service: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Export default API instance
export default api;
