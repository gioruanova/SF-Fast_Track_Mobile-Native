import { apiClient } from './api';

export interface CompanyInfo {
  company_id: number;
  company_unique_id: string;
  company_nombre: string;
  company_phone: string;
  company_email: string;
  company_whatsapp: string;
  company_telegram: string;
  company_estado: number;
  limite_operadores: number;
  limite_profesionales: number;
  limite_especialidades: number;
  reminder_manual: number;
  created_at: string;
  updated_at: string;
}

interface CompanyConfigResponse {
  company: CompanyInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function getCompanyInfo(): Promise<ApiResponse<CompanyInfo>> {
  try {
    const response = await apiClient.get<CompanyConfigResponse>('/customersApi/company/config');
    
    if (response.success && response.data?.company) {
      return {
        success: true,
        data: response.data.company,
      };
    }
    
    return {
      success: false,
      error: response.error || 'Error al obtener configuración de la compañía',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

