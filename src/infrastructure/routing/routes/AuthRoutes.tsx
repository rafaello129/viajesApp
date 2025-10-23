import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../../presentation/pages/auth/LoginPage';
import { RegisterPage } from '../../../presentation/pages/auth/RegisterPage';
import { AuthLayout } from '../../../presentation/layouts/AuthLayout';

export const AuthRoutes: React.FC = () => {
  return (
    <AuthLayout>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        /<Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthLayout>
  );
};