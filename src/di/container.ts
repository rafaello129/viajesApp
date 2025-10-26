import { AxiosHttpClient } from '../infrastructure/http';
import { AuthRepository, MapboxMockRepository } from '../infrastructure/repositories';
import {
  LoginUser,
  RegisterUser,
  RenewToken,
  Logout,
} from '../domain/usecases/auth';
import { GetMapData } from '../domain/usecases/map/GetMapData';
import { GetNearbyMarkersUseCase } from '../domain/usecases/map/GetNearbyMarkers';
import { ToggleFavoriteMarkerUseCase } from '../domain/usecases/map/ToggleFavoriteMarker';

// 1️⃣ Configurar URL base del API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 2️⃣ Crear instancia del cliente HTTP
export const httpClient = new AxiosHttpClient(API_BASE_URL);

// 3️⃣ Crear instancia del repositorio de autenticación
export const authRepository = new AuthRepository(httpClient);
export const mapRepository = new MapboxMockRepository();

// 4️⃣ Crear casos de uso de autenticación
export const loginUserUseCase = new LoginUser(authRepository);
export const registerUserUseCase = new RegisterUser(authRepository);
export const renewTokenUseCase = new RenewToken(authRepository);
export const logoutUseCase = new Logout(authRepository);
export const getMapDataUseCase = new GetMapData(mapRepository);
export const getNearbyMarkersUseCase = new GetNearbyMarkersUseCase(mapRepository);
export const toggleFavoriteMarkerUseCase = new ToggleFavoriteMarkerUseCase(mapRepository);