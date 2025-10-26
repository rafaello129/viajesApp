# Map Module Documentation

## Overview

This module integrates **Mapbox GL JS** into the React application following Clean Architecture principles. It displays an interactive map centered on Cancún, Mexico with zones (polygons) and markers (points of interest).

## Architecture

The implementation follows the existing Clean Architecture structure:

```
src/
├── domain/
│   ├── entities/
│   │   ├── Zone.ts          # Zone entity definition
│   │   └── Marker.ts        # Marker entity definition
│   ├── repositories/
│   │   └── IMapRepository.ts # Map repository interface
│   └── usecases/
│       └── map/
│           └── GetMapDataUseCase.ts # Use case for fetching map data
├── infrastructure/
│   ├── mocks/
│   │   └── mapData.mock.ts  # Mock data for zones and markers
│   └── repositories/
│       └── MapboxMockService.ts # Mock service implementation
└── presentation/
    ├── components/
    │   └── map/
    │       └── MapView.tsx   # Reusable Mapbox component
    └── pages/
        └── dashboard/
            └── MapPage.tsx   # Map page component
```

## Setup Instructions

### 1. Install Dependencies

The required dependencies are already installed:
- `mapbox-gl` - Mapbox GL JS library
- `@types/mapbox-gl` - TypeScript type definitions

### 2. Configure Mapbox Token

1. Get a Mapbox access token from [Mapbox Account](https://account.mapbox.com/)
2. Add it to your `.env` file:

```env
VITE_MAPBOX_TOKEN=your_actual_mapbox_token_here
```

**Important:** Never commit your actual token to version control. The token in `.env` is a placeholder.

### 3. Run the Application

```bash
npm run dev
```

Navigate to `/dashboard/map` to see the map in action.

## Features

### Current Implementation

- ✅ Interactive map centered on Cancún, Mexico
- ✅ Dark mode style (`mapbox://styles/mapbox/dark-v11`)
- ✅ Display zones as colored polygons with outlines
- ✅ Display markers as custom circular elements
- ✅ Click on zones/markers to see popups with names
- ✅ Hover effects on interactive elements
- ✅ Mock data for development (5 markers, 3 zones)
- ✅ Clean Architecture compliance
- ✅ Environment-based token configuration

### Map Controls

- **Zoom:** Use scroll wheel or +/- buttons
- **Pan:** Click and drag the map
- **Rotate:** Right-click and drag (or Ctrl + drag)
- **Popups:** Click on zones or markers to see details

## Component API

### MapView Component

```tsx
import MapView from '../components/map/MapView';

<MapView 
  zones={zones}     // Array of Zone objects
  markers={markers} // Array of Marker objects
/>
```

**Props:**
- `zones` (optional): Array of `Zone` objects to display as polygons
- `markers` (optional): Array of `Marker` objects to display as points

### Data Structures

**Zone:**
```typescript
interface Zone {
  id: number;
  name: string;
  coordinates: [number, number][]; // Array of [lng, lat] pairs
}
```

**Marker:**
```typescript
interface Marker {
  id: number;
  name: string;
  lat: number;
  lng: number;
}
```

## Usage Example

```tsx
import React, { useEffect, useState } from 'react';
import MapView from '../components/map/MapView';
import { GetMapDataUseCase } from '../../../domain/usecases';
import { MapboxMockService } from '../../../infrastructure/repositories';

export const MapPage = () => {
  const [zones, setZones] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const repository = new MapboxMockService();
      const useCase = new GetMapDataUseCase(repository);
      const data = await useCase.execute();
      
      setZones(data.zones);
      setMarkers(data.markers);
    };
    
    loadData();
  }, []);

  return <MapView zones={zones} markers={markers} />;
};
```

## Testing

### Manual Testing

1. **Visual Test:** Open `/dashboard/map` and verify:
   - Map loads correctly
   - Dark theme is applied
   - Map is centered on Cancún
   - Zones appear as blue polygons
   - Markers appear as red circles

2. **Interaction Test:**
   - Click on zones → popup shows zone name
   - Click on markers → popup shows marker name
   - Hover over zones → cursor changes to pointer
   - Pan, zoom, and rotate the map

3. **Error Handling:**
   - Remove token from `.env` → warning message appears
   - Check console for any errors

## Future Enhancements

The current implementation is designed to easily scale:

### 1. Real API Integration

Replace `MapboxMockService` with a real API service:

```typescript
export class MapboxApiService implements IMapRepository {
  constructor(private httpClient: HttpClient) {}
  
  async getMapData(): Promise<MapData> {
    const response = await this.httpClient.get('/api/map-data');
    return response.data;
  }
}
```

### 2. Real-time Updates

Add WebSocket support for live updates:

```typescript
// Listen for real-time zone updates
socket.on('zone-updated', (zone: Zone) => {
  updateZoneOnMap(zone);
});
```

### 3. MapLibre Migration

The abstraction through `IMapRepository` makes it easy to switch to MapLibre:

1. Replace `mapbox-gl` with `maplibre-gl`
2. Update imports in `MapView.tsx`
3. No changes needed in domain layer

### 4. Additional Features

- **Clustering:** Group nearby markers
- **Custom layers:** Add heatmaps, 3D buildings
- **Geocoding:** Search for locations
- **Drawing tools:** Let users draw zones
- **Offline support:** Cache map tiles

## Troubleshooting

### Map Not Displaying

1. **Check token:** Verify `VITE_MAPBOX_TOKEN` is set in `.env`
2. **Check console:** Look for error messages
3. **Check network:** Ensure internet connection for tile loading
4. **Restart dev server:** Changes to `.env` require restart

### Zones/Markers Not Showing

1. **Check data:** Verify `zones` and `markers` props are passed
2. **Check coordinates:** Ensure coordinates are in [lng, lat] format
3. **Check zoom level:** Zoom out to see if elements are outside viewport

### Performance Issues

1. **Too many markers:** Implement clustering for >100 markers
2. **Complex zones:** Simplify polygon coordinates
3. **Heavy animations:** Reduce or disable animations

## Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
- [GeoJSON Specification](https://geojson.org/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Support

For issues or questions:
1. Check this documentation
2. Review Mapbox documentation
3. Check the browser console for errors
4. Verify environment configuration
