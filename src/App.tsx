import AppLayout from "@/components/layout/AppLayout"
import RequireAuth from "@/components/layout/RequireAuth"
import ApplicationListPage from "@/pages/ApplicationListPage"
import LoginPage from "@/pages/LoginPage"
import StatisticsPage from "@/pages/StatisticsPage"
import { Route, Routes } from "react-router"


const App = () => {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<ApplicationListPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
