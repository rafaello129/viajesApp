import type { Marker, UserLocation } from "../../entities";
import type { IMapRepository } from "../../repositories";


/**
 * Get Nearby Markers Use Case
 * Retrieves markers within a specified radius of user location
 */
export class GetNearbyMarkersUseCase {
  constructor(private mapRepository: IMapRepository) {}

  async execute(userLocation: UserLocation, radius: number): Promise<Marker[]> {
    return await this.mapRepository.getNearbyMarkers(userLocation, radius);
  }
}