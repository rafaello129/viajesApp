import type { Zone, Marker } from '../entities';

export interface MapData {
  zones: Zone[];
  markers: Marker[];
}

export interface IMapRepository {
  getMapData(): Promise<MapData>;
}
