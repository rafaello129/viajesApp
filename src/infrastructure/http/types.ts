export interface HttpRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, any>;
  }
  
  export interface HttpResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }
  
  export class HttpError extends Error {
    constructor(
      public status: number,
      public statusText: string,
      public data?: any
    ) {
      super(`HTTP Error ${status}: ${statusText}`);
      this.name = 'HttpError';
    }
  }