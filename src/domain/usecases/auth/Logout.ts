import type { IAuthRepository } from '../../repositories';

export class Logout {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}