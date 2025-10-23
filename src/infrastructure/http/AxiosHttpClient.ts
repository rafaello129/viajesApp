import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { HttpClient } from './HttpClient';
import  type { HttpRequest, HttpResponse, } from './types';
import { HttpError } from './types';

import { TokenStorage } from '../storage';
import axios from 'axios';


export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = '') {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 📤 Request interceptor - Agregar token automáticamente
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = TokenStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 📥 Response interceptor - Manejar errores de autenticación
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`❌ ${error.response.status} ${error.config?.url}`);

          // Si es 401, limpiar tokens y redirigir al login
          if (error.response.status === 401) {
            TokenStorage.clear();
            window.location.href = '/auth/login';
          }

          throw new HttpError(
            error.response.status,
            error.response.statusText,
            error.response.data
          );
        }
        throw error;
      }
    );
  }

  async request<T = any>(config: HttpRequest): Promise<HttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method,
      data: config.body,
      params: config.params,
      headers: config.headers,
    };

    const response = await this.axiosInstance.request<T>(axiosConfig);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T = any>(url: string, params?: Record<string, any>): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'GET', params });
  }

  async post<T = any>(url: string, body?: any): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'POST', body });
  }

  async put<T = any>(url: string, body?: any): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'PUT', body });
  }

  async delete<T = any>(url: string): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'DELETE' });
  }

  async patch<T = any>(url: string, body?: any): Promise<HttpResponse<T>> {
    return this.request<T>({ url, method: 'PATCH', body });
  }
}