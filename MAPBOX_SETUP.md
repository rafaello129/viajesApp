# Mapbox Integration Setup Guide

## 🗺️ Overview

This project now includes an interactive Mapbox GL JS integration following Clean Architecture principles. The map displays zones and markers for Cancún, Mexico with a dark theme.

## 📋 Quick Start

### 1. Get a Mapbox Token

1. Go to [Mapbox Account](https://account.mapbox.com/)
2. Sign up or log in
3. Create a new access token or use your default public token
4. Copy the token (starts with `pk.`)

### 2. Configure the Token

Add your Mapbox token to the `.env` file:

```env
VITE_MAPBOX_TOKEN=pk.your_actual_mapbox_token_here
```

**Important:** 
- Never commit real tokens to version control
- The current `.env` file contains a placeholder
- Restart the dev server after changing `.env`

### 3. Run the Application

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

### 4. Access the Map

- **Within the app:** Navigate to `/dashboard/map` (requires authentication)
- **Standalone demo:** Open `http://localhost:5173/mapbox-demo.html`

## 🏗️ Architecture

The integration follows Clean Architecture:

```
src/
├── domain/
│   ├── entities/
│   │   ├── Zone.ts              # Zone entity
│   │   └── Marker.ts            # Marker entity
│   ├── repositories/
│   │   └── IMapRepository.ts    # Repository interface
│   └── usecases/
│       └── map/
│           └── GetMapDataUseCase.ts  # Use case
├── infrastructure/
│   ├── mocks/
│   │   └── mapData.mock.ts      # Mock data
│   └── repositories/
│       └── MapboxMockService.ts # Mock service
└── presentation/
    ├── components/
    │   └── map/
    │       ├── MapView.tsx      # Map component
    │       └── README.md        # Component docs
    └── pages/
        └── dashboard/
            └── MapPage.tsx      # Map page
```

## ✨ Features

- ✅ Interactive map with Mapbox GL JS
- ✅ Dark mode style
- ✅ 3 zones (polygons) displayed in blue
- ✅ 5 markers (points of interest) displayed in red
- ✅ Click zones/markers to see popups
- ✅ Hover effects
- ✅ Environment-based configuration
- ✅ Clean Architecture compliance
- ✅ Mock data ready for API integration

## 🎨 Map Features

### Zones
- Hotel Zone
- Downtown Cancún  
- Puerto Cancún

Displayed as blue polygons with 30% opacity and blue outlines.

### Markers
- Cancún International Airport
- Hotel Fiesta Americana
- Plaza Las Américas
- Interactive Aquarium
- Mercado 28

Displayed as red circles with white borders.

## 📖 Documentation

Detailed documentation is available in:
- `/src/presentation/components/map/README.md` - Component usage and API

## 🔧 Development

### Build the Project

```bash
npm run build
```

### Lint the Code

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## 🚀 Future Enhancements

The current implementation is designed to scale:

1. **Real API Integration** - Replace `MapboxMockService` with actual API calls
2. **Real-time Updates** - Add WebSocket support for live data
3. **MapLibre Migration** - Easy switch due to abstraction layer
4. **Additional Features**:
   - Marker clustering
   - Custom layers (heatmaps, 3D buildings)
   - Geocoding/search
   - Drawing tools
   - Offline support

## 🐛 Troubleshooting

### Map Not Displaying

1. **Check token:** Verify `VITE_MAPBOX_TOKEN` is set in `.env`
2. **Restart server:** Changes to `.env` require server restart
3. **Check console:** Look for error messages in browser console
4. **Check network:** Ensure internet connection for loading tiles

### Token Issues

- Make sure token starts with `pk.`
- Verify token is valid at [Mapbox Account](https://account.mapbox.com/)
- Check token has proper scopes (default public token works)

### Demo Page

If you want to test without authentication, use the standalone demo:
```
http://localhost:5173/mapbox-demo.html
```

Edit the token directly in `/public/mapbox-demo.html` for quick testing.

## 📦 Dependencies

New packages added:
- `mapbox-gl` - Mapbox GL JS library
- `@types/mapbox-gl` - TypeScript definitions

## 🔐 Security Note

**Never commit actual Mapbox tokens to version control.** The `.env` file in this repository contains only a placeholder. Each developer should:

1. Create their own Mapbox account
2. Generate a token
3. Add it to their local `.env` file
4. Keep it out of version control

## 📝 License

This integration follows the same license as the main project.

## 🤝 Contributing

When adding features to the map:

1. Follow Clean Architecture principles
2. Add types for new entities
3. Create interfaces for new repositories
4. Implement use cases for business logic
5. Keep presentation layer thin
6. Update documentation

## 📞 Support

For issues or questions:
1. Check the component README: `/src/presentation/components/map/README.md`
2. Review [Mapbox Documentation](https://docs.mapbox.com/mapbox-gl-js/api/)
3. Check browser console for errors

---

**Note:** This is a development setup. For production deployment, ensure proper token management and security practices.
