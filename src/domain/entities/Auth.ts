import type { User } from './User';

export interface LoginCredentials {
  username: string;
  password: string;
  role: string; // 'admin' | 'user' | etc.
}

export interface RegisterData {
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  status: boolean;
  accessToken: string;
  user: {
    uid: string;
    username: string;
    is_online: boolean;
    picture?: string;
    profile?: any;
  };
}

export interface RenewResponse {
  status: boolean;
  accessToken: string;
  user: User;
}