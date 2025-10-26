import type { IMapRepository } from "../../repositories";

/**
 * Toggle Favorite Marker Use Case
 */
export class ToggleFavoriteMarkerUseCase {
  constructor(private mapRepository: IMapRepository) {}

  async execute(markerId: number): Promise<boolean> {
    return await this.mapRepository.toggleFavoriteMarker(markerId);
  }
}