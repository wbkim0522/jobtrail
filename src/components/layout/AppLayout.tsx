import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const AppLayout = () => {

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jobtrail</h1>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/"
              className={({ isActive }) => isActive ? "text-sm font-medium" : "text-sm text-muted-foreground"}>
              一覧
            </NavLink>
            <NavLink to="/statistics"
              className={({ isActive }) => isActive ? "text-sm font-medium" : "text-sm text-muted-foreground"}>
              統計
            </NavLink>
            <Button
              size="icon"
              variant="ghost"
              aria-label="ログアウト"
              onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout