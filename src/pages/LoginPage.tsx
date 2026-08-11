import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const LoginPage = () => {

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // come back to this site after login (local or live)
      }
    })

    if (error) console.error(error)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Jobtrail</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          転職活動の応募履歴を管理する
        </p>
      </div>

      <Button onClick={handleGoogleLogin} size="lg">
        Googleでログイン
      </Button>
    </div>
  )
}

export default LoginPage