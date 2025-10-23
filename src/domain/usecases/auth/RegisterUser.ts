import type { IAuthRepository } from '../../repositories';
import type { RegisterData, AuthResponse } from '../../entities';

export class RegisterUser {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthResponse> {
    // Validaciones de negocio
    if (!data.name || !data.username || !data.password) {
      throw new Error('Todos los campos son requeridos');
    }

    if (data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (data.username.length < 3) {
      throw new Error('El username debe tener al menos 3 caracteres');
    }

    // Ejecutar registro
    const response = await this.authRepository.register(data);

    if (!response.accessToken) {
      throw new Error('Error al generar token de acceso');
    }

    return response;
  }
}