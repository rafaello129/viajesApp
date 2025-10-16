import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardRoutes } from "./routes/DashboardRoutes";
import { AuthRoutes } from "./routes/AuthRoutes";

export const AppRouter = () => {

  return (
    <Routes>
      { true ? (
        <Route path="/*" element={<DashboardRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}

      <Route path="/*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
