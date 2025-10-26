export interface Marker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: 'hotel' | 'restaurant' | 'attraction' | 'event' | 'villa' | 'service';
  rating?: number;
  description?: string;
  imageUrl?: string;
  priceRange?: 'budget' | 'moderate' | 'luxury' | 'ultra-luxury';
  distanceFromUser?: number; // in meters
  isNearby?: boolean; // within proximity radius
  isFavorite?: boolean;
  metadata?: {
    address?: string;
    phone?: string;
    website?: string;
    openingHours?: string;
    amenities?: string[];
  };
}