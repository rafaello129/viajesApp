import type { HttpRequest, HttpResponse } from './types';

export interface HttpClient {
  request<T = any>(config: HttpRequest): Promise<HttpResponse<T>>;
  get<T = any>(url: string, params?: Record<string, any>): Promise<HttpResponse<T>>;
  post<T = any>(url: string, body?: any): Promise<HttpResponse<T>>;
  put<T = any>(url: string, body?: any): Promise<HttpResponse<T>>;
  delete<T = any>(url: string): Promise<HttpResponse<T>>;
  patch<T = any>(url: string, body?: any): Promise<HttpResponse<T>>;
}