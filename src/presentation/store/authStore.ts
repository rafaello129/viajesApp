import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import  type { LoginCredentials, RegisterData, User } from '../../domain/entities';
import {
  loginUserUseCase,
  registerUserUseCase,
  renewTokenUseCase,
  logoutUseCase,
} from '../../di/container';
import { TokenStorage } from '../../infrastructure/storage';

interface AuthState {
  // 📊 Estado
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 🔧 Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  renewToken: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: TokenStorage.getUser(),
        accessToken: TokenStorage.getToken(),
        isAuthenticated: TokenStorage.hasToken(),
        isLoading: false,
        error: null,

        // 🔐 Login
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await loginUserUseCase.execute(credentials);
            
            set({
              user: response.user as any,
              accessToken: response.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Error al iniciar sesión',
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        // 📝 Register
        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await registerUserUseCase.execute(data);
            
            set({
              user: response.user as any,
              accessToken: response.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Error al registrar usuario',
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        // 🔄 Renovar Token
        renewToken: async () => {
          set({ isLoading: true, error: null });
          try {
            
            const response = await renewTokenUseCase.execute();
            
            set({
              user: response.user,
              accessToken: response.accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Error al renovar token',
              isLoading: false,
              isAuthenticated: false,
              user: null,
              accessToken: null,
            });
            TokenStorage.clear();
          }
        },

        // 🚪 Logout
        logout: async () => {
          set({ isLoading: true });
          try {
            await logoutUseCase.execute();
            
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error: any) {
            set({
              error: error.message || 'Error al cerrar sesión',
              isLoading: false,
            });
          }
        },

        // 🧹 Limpiar error
        clearError: () => {
          set({ error: null });
        },

        // ✅ Verificar autenticación
        checkAuth: () => {
          const token = TokenStorage.getToken();
          const user = TokenStorage.getUser();
          
          if (token && user) {
            set({
              user,
              accessToken: token,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);