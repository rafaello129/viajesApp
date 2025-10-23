import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../presentation/store/authStore';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthRoutes } from './routes/AuthRoutes';
import { DashboardRoutes } from './routes/DashboardRoutes';


export const AppRouter: React.FC = () => {
  const { checkAuth, renewToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Verificar autenticación al cargar la app
    checkAuth();

    // Intentar renovar token si está autenticado
    if (isAuthenticated) {
      renewToken().catch((error) => {
        console.error('Error al renovar token:', error);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación (públicas) */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* Rutas del dashboard (protegidas) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRoutes />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Ruta 404 - Redirigir según autenticación */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};