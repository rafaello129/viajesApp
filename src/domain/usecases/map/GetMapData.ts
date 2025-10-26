import type { MapBounds } from "../../entities/MapBounds";
import type { MapFilters } from "../../entities/MapFilters";
import type { UserLocation } from "../../entities/UserLocation";
import type { IMapRepository, MapData } from "../../repositories";

/**
 * Get Map Data Use Case
 * Retrieves map data based on user location and filters
 */
export class GetMapData{
  constructor(private mapRepository: IMapRepository) {}

  async execute(
    userLocation?: UserLocation, 
    bounds?: MapBounds,
    filters?: MapFilters
  ): Promise<MapData> {
    return await this.mapRepository.getMapData(userLocation, bounds, filters);
  }
}