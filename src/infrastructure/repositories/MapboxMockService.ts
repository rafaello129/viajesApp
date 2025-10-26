import type { IMapRepository, MapData } from '../../domain/repositories';
import { mockZones, mockMarkers } from '../mocks/mapData.mock';

/**
 * Mock implementation of IMapRepository
 * This simulates fetching map data from an API
 * In production, this would be replaced with actual API calls
 */
export class MapboxMockService implements IMapRepository {
  /**
   * Simulates an async API call to retrieve map data
   * Returns mock zones and markers after a small delay
   */
  async getMapData(): Promise<MapData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      zones: mockZones,
      markers: mockMarkers,
    };
  }
}
