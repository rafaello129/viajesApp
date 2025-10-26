import type { Zone, Marker, UserLocation, MapBounds, MapFilters } from '../entities';

export interface MapData {
  zones: Zone[];
  markers: Marker[];
}

export interface IMapRepository {
  getMapData(userLocation?: UserLocation, bounds?: MapBounds, filters?: MapFilters): Promise<MapData>;
  getNearbyMarkers(userLocation: UserLocation, radius: number): Promise<Marker[]>;
  getMarkerById(id: number): Promise<Marker>;
  getZoneById(id: number): Promise<Zone>;
  toggleFavoriteMarker(markerId: number): Promise<boolean>;
}