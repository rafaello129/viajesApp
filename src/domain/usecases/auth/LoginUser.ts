import type { IAuthRepository } from '../../repositories';
import type { LoginCredentials, AuthResponse } from '../../entities';

export class LoginUser {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validaciones de negocio
    if (!credentials.username || !credentials.password) {
      throw new Error('Username y password son requeridos');
    }

    if (credentials.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Ejecutar login
    const response = await this.authRepository.login(credentials);

    if (!response.accessToken) {
      throw new Error('Error al generar token de acceso');
    }

    return response;
  }
}