import { useSession } from "@/hooks/useSession"
import ApplicationListPage from "@/pages/ApplicationListPage"
import LoginPage from "@/pages/LoginPage"
import { Loader2 } from "lucide-react"
import { Navigate, Route, Routes } from "react-router"


const App = () => {

  const { session, loading } = useSession()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to='/' /> : <LoginPage />} />
      <Route path="/" element={session ? <ApplicationListPage /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
