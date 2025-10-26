export interface Zone {
  id: number;
  name: string;
  coordinates: [number, number][];
  type: 'safe' | 'caution' | 'restricted' | 'recommended';
  description?: string;
  securityLevel?: number; // 1-5
  popularityScore?: number; // 0-100
  color?: string;
  distanceFromUser?: number; // in meters
}