/**
 * Map Helper Functions
*/

export const getZoneColor = (type: string): string => {
    const colors = {
      safe: '#10b981',
      caution: '#f59e0b',
      restricted: '#ef4444',
      recommended: '#D4AF37',
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };
  
  export const getMarkerColor = (category: string): string => {
    const colors = {
      hotel: '#D4AF37',
      restaurant: '#f59e0b',
      attraction: '#3b82f6',
      event: '#a855f7',
      villa: '#ec4899',
      service: '#6b7280',
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };
  
  export const getCategoryIcon = (category: string): string => {
    const icons = {
      hotel: '🏨',
      restaurant: '🍽️',
      attraction: '🎭',
      event: '🎉',
      villa: '🏖️',
      service: '🛎️',
    };
    return icons[category as keyof typeof icons] || '📍';
  };
  
  export const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };
  
  export const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };