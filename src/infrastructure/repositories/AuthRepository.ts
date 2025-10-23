import type { IAuthRepository } from '../../domain/repositories';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RenewResponse,
} from '../../domain/entities';
import type { HttpClient } from '../http';
import { TokenStorage } from '../storage';

export class AuthRepository implements IAuthRepository {
  private readonly basePath = '/api/auth';

  constructor(private httpClient: HttpClient) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { username, password, role } = credentials;
    
    const response = await this.httpClient.post<AuthResponse>(
      `${this.basePath}/login/${role}`,
      { username, password }
    );

    // Guardar token automáticamente
    if (response.data.accessToken) {
      TokenStorage.saveToken(response.data.accessToken);
      TokenStorage.saveUser(response.data.user);
    }

    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const { name, username, password, role } = data;
    
    const response = await this.httpClient.post<AuthResponse>(
      `${this.basePath}/register/${role}`,
      { name, username, password }
    );

    // Guardar token automáticamente
    if (response.data.accessToken) {
      TokenStorage.saveToken(response.data.accessToken);
      TokenStorage.saveUser(response.data.user);
    }

    return response.data;
  }

  async renewToken(): Promise<RenewResponse> {

    const response = await this.httpClient.post<RenewResponse>(
      `${this.basePath}/renew`,
      { user : TokenStorage.getUser() } 
    );
    // Actualizar token si viene uno nuevo
    if (response.data.accessToken) {
      TokenStorage.saveToken(response.data.accessToken);
      TokenStorage.saveUser(response.data.user);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    // Limpiar tokens localmente
    TokenStorage.clear();
    
    // Si tienes endpoint de logout en el backend, descoméntalo:
    // await this.httpClient.post(`${this.basePath}/logout`);
  }
}