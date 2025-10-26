import type { Zone, Marker } from ".";

export interface MapFilters {
    zoneTypes?: Zone['type'][];
    markerCategories?: Marker['category'][];
    priceRanges?: Marker['priceRange'][];
    minRating?: number;
    maxDistance?: number; // in meters
    showOnlyNearby?: boolean;
    showOnlyFavorites?: boolean;
  }