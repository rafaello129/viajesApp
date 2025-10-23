import type { IAuthRepository } from '../../repositories';
import type { RenewResponse } from '../../entities';

export class RenewToken {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<RenewResponse> {
    return await this.authRepository.renewToken();
  }
}