import type { UserLocation, Marker, Zone } from '../../domain/entities';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Calculate distance from user to marker
 */
export const getMarkerDistance = (
  userLocation: UserLocation,
  marker: Marker
): number => {
  return calculateDistance(userLocation.lat, userLocation.lng, marker.lat, marker.lng);
};

/**
 * Check if marker is within radius
 */
export const isMarkerNearby = (
  userLocation: UserLocation,
  marker: Marker,
  radius: number
): boolean => {
  const distance = getMarkerDistance(userLocation, marker);
  return distance <= radius;
};

/**
 * Sort markers by distance from user
 */
export const sortMarkersByDistance = (
  userLocation: UserLocation,
  markers: Marker[]
): Marker[] => {
  return markers
    .map((marker) => ({
      ...marker,
      distanceFromUser: getMarkerDistance(userLocation, marker),
    }))
    .sort((a, b) => (a.distanceFromUser || 0) - (b.distanceFromUser || 0));
};

/**
 * Filter markers by radius
 */
export const filterMarkersByRadius = (
  userLocation: UserLocation,
  markers: Marker[],
  radius: number
): Marker[] => {
  return markers
    .map((marker) => ({
      ...marker,
      distanceFromUser: getMarkerDistance(userLocation, marker),
      isNearby: isMarkerNearby(userLocation, marker, radius),
    }))
    .filter((marker) => (marker.distanceFromUser || 0) <= radius);
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Calculate center point of coordinates
 */
export const getCenterPoint = (coordinates: [number, number][]): [number, number] => {
  if (coordinates.length === 0) return [0, 0];

  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  );

  return [sum[0] / coordinates.length, sum[1] / coordinates.length];
};

/**
 * Check if point is inside polygon (for zones)
 */
export const isPointInPolygon = (
  point: [number, number],
  polygon: [number, number][]
): boolean => {
  const [lng, lat] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Get current zone for user location
 */
export const getCurrentZone = (
  userLocation: UserLocation,
  zones: Zone[]
): Zone | null => {
  const point: [number, number] = [userLocation.lng, userLocation.lat];

  for (const zone of zones) {
    if (isPointInPolygon(point, zone.coordinates)) {
      return zone;
    }
  }

  return null;
};

/**
 * Geolocation options for better compatibility
 */
const getGeolocationOptions = (highAccuracy: boolean = false) => ({
  enableHighAccuracy: highAccuracy,
  timeout: highAccuracy ? 15000 : 10000, // 15s for high accuracy, 10s for normal
  maximumAge: highAccuracy ? 0 : 30000, // Use cache for normal accuracy
});

/**
 * Get browser geolocation with fallback
 */
export const getUserLocation = async (): Promise<UserLocation> => {
  if (!navigator.geolocation) {
    throw new Error('Geolocalización no soportada en este navegador');
  }

  // Try high accuracy first
  try {
    return await getLocationWithTimeout(true);
  } catch (highAccError) {
    console.warn('High accuracy location failed, trying normal accuracy:', highAccError);
    
    // Fallback to normal accuracy
    try {
      return await getLocationWithTimeout(false);
    } catch (normalError) {
      // If both fail, use IP-based fallback or default location
      console.error('All location attempts failed:', normalError);
      
      // Return default location (Cancún) as last resort
      return {
        lat: 21.1619,
        lng: -86.8515,
        accuracy: undefined,
        timestamp: Date.now(),
      };
    }
  }
};

/**
 * Helper function to get location with specific timeout
 */
const getLocationWithTimeout = (highAccuracy: boolean): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    const options = getGeolocationOptions(highAccuracy);
    
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout de geolocalización (${options.timeout}ms)`));
    }, options.timeout + 1000); // Extra second for cleanup

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(new Error(getGeolocationErrorMessage(error)));
      },
      options
    );
  });
};

/**
 * Watch user location with improved error handling
 */
export const watchUserLocation = (
  onUpdate: (location: UserLocation) => void,
  onError?: (error: Error) => void
): number => {
  if (!navigator.geolocation) {
    onError?.(new Error('Geolocalización no soportada'));
    return -1;
  }

  let lastUpdateTime = 0;
  const MIN_UPDATE_INTERVAL = 5000; // Minimum 5 seconds between updates

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const now = Date.now();
      
      // Throttle updates to avoid too frequent changes
      if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
        return;
      }

      lastUpdateTime = now;

      onUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: now,
      });
    },
    (error) => {
      console.warn('Location watch error:', getGeolocationErrorMessage(error));
      // Don't propagate minor errors, just log them
      if (error.code === error.TIMEOUT) {
        // Timeout is expected sometimes, don't treat as critical error
        return;
      }
      onError?.(new Error(getGeolocationErrorMessage(error)));
    },
    {
      enableHighAccuracy: false, // Use normal accuracy for continuous tracking
      timeout: 20000, // 20 seconds timeout for watch
      maximumAge: 10000, // Accept 10 second old positions
    }
  );

  return watchId;
};

/**
 * Stop watching user location
 */
export const stopWatchingLocation = (watchId: number): void => {
  if (navigator.geolocation && watchId !== -1) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Get human-readable error message
 */
const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Permiso de ubicación denegado. Por favor, habilita el acceso en la configuración.';
    case error.POSITION_UNAVAILABLE:
      return 'Ubicación no disponible. Verifica tu conexión GPS/WiFi.';
    case error.TIMEOUT:
      return 'Tiempo de espera agotado. La señal GPS puede ser débil.';
    default:
      return 'Error desconocido al obtener ubicación.';
  }
};

/**
 * Check if geolocation is available and permitted
 */
export const checkGeolocationSupport = async (): Promise<{
  supported: boolean;
  permitted: boolean;
  message: string;
}> => {
  if (!navigator.geolocation) {
    return {
      supported: false,
      permitted: false,
      message: 'Geolocalización no soportada en este navegador',
    };
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    
    return {
      supported: true,
      permitted: permission.state === 'granted',
      message: permission.state === 'granted'
        ? 'Geolocalización disponible'
        : permission.state === 'denied'
        ? 'Permiso de ubicación denegado'
        : 'Permiso de ubicación pendiente',
    };
  } catch (error) {
    // Permissions API not supported, assume geolocation might work
    return {
      supported: true,
      permitted: false,
      message: 'API de permisos no disponible, intenta solicitar ubicación',
    };
  }
};