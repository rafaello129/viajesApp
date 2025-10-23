import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../../../presentation/layouts/DashboardLayout';
import { DashboardPage } from '../../../presentation/pages/dashboard/DashboardPage';

export const DashboardRoutes: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="home" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </DashboardLayout>
  );
};