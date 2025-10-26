import React, { useEffect, useState } from 'react';
import MapView from '../../components/map/MapView';
import { GetMapDataUseCase } from '../../../domain/usecases';
import { MapboxMockService } from '../../../infrastructure/repositories';
import type { Zone, Marker } from '../../../domain/entities';

/**
 * MapPage Component
 * Page that displays the interactive map with zones and markers
 * Uses Clean Architecture: fetches data through use case
 */
export const MapPage: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize repository and use case
        const mapRepository = new MapboxMockService();
        const getMapDataUseCase = new GetMapDataUseCase(mapRepository);

        // Execute use case
        const data = await getMapDataUseCase.execute();
        
        setZones(data.zones);
        setMarkers(data.markers);
      } catch (err) {
        console.error('Error loading map data:', err);
        setError('Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Interactive Map</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore zones and markers in Cancún, Mexico
        </p>
      </div>
      <div className="h-[calc(100vh-200px)] min-h-[500px]">
        <MapView zones={zones} markers={markers} />
      </div>
    </div>
  );
};
