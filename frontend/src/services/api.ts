import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  ResearchSchema,
  Study,
  Response as SurveyResponse,
  CreateResearchSchemaForm,
  UpdateResearchSchemaForm,
  CreateStudyForm,
  UpdateStudyForm,
  SubmitResponseForm,
  StudyStatistics,
  StudyStatus
} from '../types';

// Konfiguracja axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Research Schemas API
export const researchSchemasApi = {
  // Pobierz wszystkie schematy
  getAll: async (): Promise<ApiResponse<ResearchSchema[]>> => {
    const response = await api.get<ApiResponse<ResearchSchema[]>>('/research-schemas');
    return response.data;
  },

  // Pobierz schemat po ID
  getById: async (id: string): Promise<ApiResponse<ResearchSchema>> => {
    const response = await api.get<ApiResponse<ResearchSchema>>(`/research-schemas/${id}`);
    return response.data;
  },

  // Utwórz nowy schemat
  create: async (data: CreateResearchSchemaForm): Promise<ApiResponse<ResearchSchema>> => {
    const response = await api.post<ApiResponse<ResearchSchema>>('/research-schemas', data);
    return response.data;
  },

  // Aktualizuj schemat
  update: async (id: string, data: UpdateResearchSchemaForm): Promise<ApiResponse<ResearchSchema>> => {
    const response = await api.put<ApiResponse<ResearchSchema>>(`/research-schemas/${id}`, data);
    return response.data;
  },

  // Usuń schemat
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/research-schemas/${id}`);
    return response.data;
  },
};

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

// Responses API
export const responsesApi = {
  // Pobierz odpowiedzi dla badania
  getByStudy: async (studyId: string): Promise<ApiResponse<{ study: Study; responses: SurveyResponse[] }>> => {
    const response = await api.get<ApiResponse<{ study: Study; responses: SurveyResponse[] }>>(`/responses/study/${studyId}`);
    return response.data;
  },

  // Pobierz odpowiedź po ID
  getById: async (id: string): Promise<ApiResponse<SurveyResponse>> => {
    const response = await api.get<ApiResponse<SurveyResponse>>(`/responses/${id}`);
    return response.data;
  },

  // Prześlij nową odpowiedź
  submit: async (data: SubmitResponseForm): Promise<ApiResponse<SurveyResponse>> => {
    const response = await api.post<ApiResponse<SurveyResponse>>('/responses', data);
    return response.data;
  },

  // Usuń odpowiedź
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/responses/${id}`);
    return response.data;
  },

  // Pobierz statystyki dla badania
  getStatistics: async (studyId: string): Promise<ApiResponse<StudyStatistics>> => {
    const response = await api.get<ApiResponse<StudyStatistics>>(`/responses/study/${studyId}/statistics`);
    return response.data;
  },
};

// Predefined Schemas API
export const predefinedSchemasApi = {
  // Pobierz wszystkie predefiniowane schematy
  getAll: async (): Promise<ApiResponse<CreateResearchSchemaForm[]>> => {
    const response = await api.get<ApiResponse<CreateResearchSchemaForm[]>>('/predefined-schemas');
    return response.data;
  },

  // Pobierz predefiniowany schemat po indeksie
  getByIndex: async (index: number): Promise<ApiResponse<CreateResearchSchemaForm>> => {
    const response = await api.get<ApiResponse<CreateResearchSchemaForm>>(`/predefined-schemas/${index}`);
    return response.data;
  },

  // Importuj predefiniowany schemat do bazy danych
  importSchema: async (index: number): Promise<ApiResponse<ResearchSchema>> => {
    const response = await api.post<ApiResponse<ResearchSchema>>(`/predefined-schemas/import/${index}`);
    return response.data;
  },

  // Importuj wszystkie predefiniowane schematy
  importAll: async (): Promise<ApiResponse<{
    imported: ResearchSchema[];
    skipped: Array<{ title: string; reason: string }>;
    importedCount: number;
    skippedCount: number;
    totalProcessed: number;
  }>> => {
    const response = await api.post<ApiResponse<any>>('/predefined-schemas/import-all');
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
