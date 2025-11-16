import config from '../constants/config';

const API_URL = config.apiUrl;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value: boolean) => void;
  reject: (reason?: Error) => void;
}[] = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(true);
    }
  });
  failedQueue = [];
};

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/publicApi/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function makeRequest<T = any>(
  endpoint: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (
      response.status === 401 &&
      !endpoint.includes('/login') &&
      !endpoint.includes('/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return makeRequest<T>(endpoint, options);
        });
      }

      isRefreshing = true;
      const refreshSuccess = await refreshToken();

      if (refreshSuccess) {
        isRefreshing = false;
        processQueue();
        return makeRequest<T>(endpoint, options);
      } else {
        isRefreshing = false;
        processQueue(new Error('Sesión expirada'));
        return {
          success: false,
          error: 'Sesión expirada',
          statusCode: 401,
        };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || data.msg || 'Error en la petición',
        statusCode: response.status,
        data: data,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export const apiClient = {
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, {
      method: 'GET',
    });
  },

  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return makeRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};

