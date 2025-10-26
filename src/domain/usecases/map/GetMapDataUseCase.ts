import type { IMapRepository, MapData } from '../../repositories';

/**
 * Use case for retrieving map data (zones and markers)
 * This follows Clean Architecture principles by depending on abstractions (IMapRepository)
 * rather than concrete implementations
 */
export class GetMapDataUseCase {
  constructor(private mapRepository: IMapRepository) {}

  /**
   * Executes the use case to get map data
   * @returns Promise with zones and markers data
   */
  async execute(): Promise<MapData> {
    return await this.mapRepository.getMapData();
  }
}
