import { apiClient } from './api';

export interface UserProfile {
  user_id: number;
  user_email: string;
  user_name: string;
  user_role: string;
  user_dni?: string;
  user_phone?: string;
  company_id: number;
  company_name: string;
  company_status: number;
  company_phone: string;
  company_email: string;
  company_whatsapp: string;
  company_telegram: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  user_complete_name?: string;
  user_dni?: string;
  user_phone?: string;
  user_email?: string;
  user_password?: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    return apiClient.post('/publicApi/login', credentials);
  },

  async getProfile() {
    return apiClient.get<UserProfile>('/publicApi/profile');
  },

  async updateProfile(data: UpdateProfileData) {
    return apiClient.put('/customersApi/profile/manage', data);
  },

  async refresh() {
    return apiClient.get('/publicApi/refresh');
  },

  async logout() {
    return apiClient.get('/publicApi/logout');
  },
};

