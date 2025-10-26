import type { IMapRepository, MapData } from '../../domain/repositories';
import type { Marker, Zone, UserLocation, MapBounds, MapFilters } from '../../domain/entities';
import { mockZones, mockMarkers } from '../mocks/mapData.mock';
import {
  getMarkerDistance,
  filterMarkersByRadius,
  sortMarkersByDistance,
} from '../utils/geolocation.utils';

/**
 * Mock implementation with geolocation features
 */
export class MapboxMockRepository implements IMapRepository {
  private favorites: Set<number> = new Set();

  async getMapData(
    userLocation?: UserLocation,
    bounds?: MapBounds,
    filters?: MapFilters
  ): Promise<MapData> {
    // Simulate network delay
    // await new Promise((resolve) => setTimeout(resolve, 800));

    let zones = [...mockZones];
    let markers = [...mockMarkers];

    // Add favorite status
    markers = markers.map(marker => ({
      ...marker,
      isFavorite: this.favorites.has(marker.id),
    }));

    // Apply user location-based filtering
    if (userLocation) {
      markers = markers.map((marker) => ({
        ...marker,
        distanceFromUser: getMarkerDistance(userLocation, marker),
        isNearby: getMarkerDistance(userLocation, marker) <= 500, // 500m radius
      }));

      // Sort by distance
      markers = sortMarkersByDistance(userLocation, markers);
    }

    // Apply filters
    if (filters) {
      if (filters.markerCategories && filters.markerCategories.length > 0) {
        markers = markers.filter((m) =>
          filters.markerCategories!.includes(m.category)
        );
      }

      if (filters.priceRanges && filters.priceRanges.length > 0) {
        markers = markers.filter((m) =>
          m.priceRange && filters.priceRanges!.includes(m.priceRange)
        );
      }

      if (filters.minRating) {
        markers = markers.filter((m) => (m.rating || 0) >= filters.minRating!);
      }

      if (filters.maxDistance && userLocation) {
        markers = markers.filter(
          (m) => (m.distanceFromUser || Infinity) <= filters.maxDistance!
        );
      }

      if (filters.showOnlyNearby) {
        markers = markers.filter((m) => m.isNearby);
      }

      if (filters.showOnlyFavorites) {
        markers = markers.filter((m) => m.isFavorite);
      }

      if (filters.zoneTypes && filters.zoneTypes.length > 0) {
        zones = zones.filter((z) => filters.zoneTypes!.includes(z.type));
      }
    }

    return { zones, markers };
  }

  async getNearbyMarkers(userLocation: UserLocation, radius: number): Promise<Marker[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const nearby = filterMarkersByRadius(userLocation, mockMarkers, radius);
    
    return nearby.map(marker => ({
      ...marker,
      isFavorite: this.favorites.has(marker.id),
    }));
  }

  async getMarkerById(id: number): Promise<Marker> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const marker = mockMarkers.find((m) => m.id === id);
    if (!marker) {
      throw new Error(`Marker ${id} not found`);
    }

    return {
      ...marker,
      isFavorite: this.favorites.has(marker.id),
    };
  }

  async getZoneById(id: number): Promise<Zone> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const zone = mockZones.find((z) => z.id === id);
    if (!zone) {
      throw new Error(`Zone ${id} not found`);
    }

    return zone;
  }

  async toggleFavoriteMarker(markerId: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.favorites.has(markerId)) {
      this.favorites.delete(markerId);
      return false;
    } else {
      this.favorites.add(markerId);
      return true;
    }
  }
}