# Visual Guide: Mapbox Integration

## 🎨 What You'll See (With Valid Token)

When you configure a valid Mapbox token, the map will display:

### Map View Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🗺️  Interactive Map - Cancún, Mexico                       │
│  Explore zones and markers in Cancún, Mexico                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│        ┌─────────────────────────────────────────┐          │
│        │                                           │          │
│        │   🌊 Caribbean Sea (Dark Blue Water)     │          │
│        │                                           │          │
│        │     ┏━━━━━━━━┓                           │          │
│        │     ┃ Zone 2 ┃  Downtown Cancún          │          │
│        │     ┃ (Blue) ┃  🔴 Mercado 28            │          │
│        │     ┗━━━━━━━━┛                           │          │
│        │              🔴 Plaza Las Américas       │          │
│        │         ┏━━━━━━━━┓                       │          │
│        │         ┃ Zone 1 ┃  Hotel Zone           │          │
│        │         ┃ (Blue) ┃  🔴 Fiesta Americana  │          │
│        │         ┗━━━━━━━━┛                       │          │
│        │                                           │          │
│        │              ┏━━━━━━━━┓                  │          │
│        │              ┃ Zone 3 ┃  Puerto Cancún   │          │
│        │              ┃ (Blue) ┃                   │          │
│        │              ┗━━━━━━━━┛                  │          │
│        │                                           │          │
│        │         🔴 Interactive Aquarium          │          │
│        │                                           │          │
│        │    🔴 Cancún International Airport       │          │
│        │                                           │          │
│        └─────────────────────────────────────────┘          │
│                                                               │
│  Legend:                                                      │
│  🟦 Zones (Blue polygons) - Click to see names              │
│  🔴 Markers (Red circles) - Points of interest              │
└─────────────────────────────────────────────────────────────┘
```

### Interactive Features

1. **Zones (Blue Polygons)**
   - Semi-transparent blue fill (30% opacity)
   - Solid blue border (2px width)
   - Hover: Cursor changes to pointer
   - Click: Popup shows zone name

2. **Markers (Red Circles)**
   - Red circular markers (30px diameter)
   - White border (2px)
   - Shadow effect for depth
   - Click: Popup shows location name

3. **Map Controls**
   - Zoom: Scroll wheel or +/- buttons
   - Pan: Click and drag
   - Rotate: Right-click and drag (or Ctrl + drag)

### Color Scheme (Dark Theme)

- **Background:** Dark blue/black water (#0A0A0A)
- **Zones:** Blue (#3b82f6) at 30% opacity
- **Zone borders:** Blue (#3b82f6)
- **Markers:** Red (#ef4444)
- **Marker borders:** White (#ffffff)
- **Popups:** White background with black text
- **Map style:** `mapbox://styles/mapbox/dark-v11`

### Data Display

**Zones:**
1. Hotel Zone - Tourist area along the beach
2. Downtown Cancún - City center
3. Puerto Cancún - Marina district

**Markers:**
1. Cancún International Airport - South of the city
2. Hotel Fiesta Americana - In Hotel Zone
3. Plaza Las Américas - Shopping center
4. Interactive Aquarium - Coastal attraction
5. Mercado 28 - Traditional market

### Expected Behavior

```typescript
// When user clicks on a zone
map.on('click', 'zones-layer', (e) => {
  const coordinates = e.lngLat;
  const name = e.features[0].properties.name;
  
  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(`<div style="color: #000;"><strong>${name}</strong></div>`)
    .addTo(map);
});

// When user hovers over zone
map.on('mouseenter', 'zones-layer', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'zones-layer', () => {
  map.getCanvas().style.cursor = '';
});

// When user clicks on a marker
// Popups are automatically bound to markers
const marker = new mapboxgl.Marker(element)
  .setLngLat([lng, lat])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<div style="color: #000;"><strong>${name}</strong></div>`)
  )
  .addTo(map);
```
```

## 🖼️ Screenshot Examples

### With Valid Token:
The map displays a rich, dark-themed satellite/street view with:
- Detailed street layouts
- Building outlines
- Water bodies in dark blue
- Overlaid blue zones
- Red circular markers
- Interactive popups on click

### Without Token (Current State):
Shows error message:
- Red warning banner at top
- Gray placeholder area
- "Mapbox Token Required" message
- Instructions to add token

## 🎯 Integration Points

The map integrates seamlessly with the ALAYA luxury travel dashboard:

```
Dashboard Layout
├── Sidebar (with Map link)
├── Top Menu
└── Main Content
    └── Map Page
        ├── Header (Title + Description)
        ├── Map View (600px height)
        └── Legend
```

## 📱 Responsive Behavior

- **Desktop:** Full-width map with controls on right
- **Mobile:** Full-width map, touch controls enabled
- **Tablet:** Optimized for touch and mouse interaction

## 🔄 State Flow

```
User → Navigate to /dashboard/map
  ↓
MapPage loads
  ↓
GetMapDataUseCase.execute()
  ↓
MapboxMockService.getMapData()
  ↓
Returns { zones, markers }
  ↓
MapView renders with data
  ↓
Mapbox GL JS initializes
  ↓
Loads dark theme style
  ↓
Centers on Cancún (21.1619, -86.8515)
  ↓
Adds zone layers (fill + outline)
  ↓
Adds marker elements
  ↓
Ready for interaction!
```

## 🚀 Performance

- Initial load: ~500ms (simulated network delay)
- Map tiles: Cached by Mapbox
- Interactions: Immediate response
- Smooth zoom/pan animations

---

**To see this in action:** Add a valid Mapbox token to `.env` and restart the dev server!
