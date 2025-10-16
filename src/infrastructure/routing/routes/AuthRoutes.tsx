

import { Navigate, Route, Routes } from "react-router-dom"
import { AuthLayout } from "../../../presentation/layouts/AuthLayout"
import { LoginPage } from "../../../presentation/pages/auth/LoginPage"
import { RegisterPage } from "../../../presentation/pages/auth/RegisterPage"



export const AuthRoutes = () => {
  return (
    <AuthLayout>
      <Routes>
          <Route path="login" element={ <LoginPage /> }/>
          <Route path="register" element={ <RegisterPage /> }/>
          <Route path="/*" element={ <Navigate to="/auth/login" /> }/>
      </Routes>
    </AuthLayout>
  )
}