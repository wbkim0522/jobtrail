import { useSession } from '@/hooks/useSession'
import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router'

const RequireAuth = () => {

  const { session, loading } = useSession()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
  
}

export default RequireAuth