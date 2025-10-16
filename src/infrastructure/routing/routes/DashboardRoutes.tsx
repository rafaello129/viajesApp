import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardLayout } from "../../../presentation/layouts/DashboardLayout"
import { HomePage } from "../../../presentation/pages/dashboard/HomePage"

export const DashboardRoutes = () => {

  return (  
    <DashboardLayout>
      <Routes>
         
          <Route path="home" element={ <HomePage /> }/>

          <Route path="/*" element={ <Navigate to="/home" /> }/>

      </Routes>
    </DashboardLayout>
  )
}