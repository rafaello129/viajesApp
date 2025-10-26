import type { Zone, Marker } from '../../domain/entities';

/**
 * Mock zones data for Cancún, Mexico
 * These represent different areas/zones in the city
 */
export const mockZones: Zone[] = [
  {
    id: 1,
    name: 'Hotel Zone',
    coordinates: [
      [-86.8515, 21.1619],
      [-86.8400, 21.1619],
      [-86.8400, 21.1500],
      [-86.8515, 21.1500],
      [-86.8515, 21.1619],
    ],
  },
  {
    id: 2,
    name: 'Downtown Cancún',
    coordinates: [
      [-86.8300, 21.1700],
      [-86.8150, 21.1700],
      [-86.8150, 21.1550],
      [-86.8300, 21.1550],
      [-86.8300, 21.1700],
    ],
  },
  {
    id: 3,
    name: 'Puerto Cancún',
    coordinates: [
      [-86.8100, 21.1400],
      [-86.7950, 21.1400],
      [-86.7950, 21.1250],
      [-86.8100, 21.1250],
      [-86.8100, 21.1400],
    ],
  },
];

/**
 * Mock markers data for Cancún, Mexico
 * These represent points of interest or important locations
 */
export const mockMarkers: Marker[] = [
  {
    id: 1,
    name: 'Cancún International Airport',
    lat: 21.0365,
    lng: -86.8770,
  },
  {
    id: 2,
    name: 'Hotel Fiesta Americana',
    lat: 21.1426,
    lng: -86.8266,
  },
  {
    id: 3,
    name: 'Plaza Las Américas',
    lat: 21.1469,
    lng: -86.8260,
  },
  {
    id: 4,
    name: 'Interactive Aquarium',
    lat: 21.0925,
    lng: -86.7707,
  },
  {
    id: 5,
    name: 'Mercado 28',
    lat: 21.1617,
    lng: -86.8270,
  },
];
