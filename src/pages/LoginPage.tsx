import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

const LoginPage = () => {

  const [loading, setLoading] = useState(false)


  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // come back to this site after login (local or live)
      }
    })

    if (error) console.error(error)
    setLoading(false)
  }


  const handleGuestLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: import.meta.env.VITE_DEMO_EMAIL,
      password: import.meta.env.VITE_DEMO_PASSWORD,
    })

    if (error) console.error(error)
    setLoading(false)
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Jobtrail</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          転職活動の応募履歴を管理する
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={handleGoogleLogin} size="lg" disabled={loading}>
          Googleでログイン
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="outline" size="lg" disabled={loading}>
                ゲストで試す
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>体験用アカウントについて</AlertDialogTitle>
              <AlertDialogDescription>
                このアカウントは体験用です。
                <br />
                すべての利用者が同じデータを閲覧・編集できるため、
                <br />
                個人情報の入力はお控えください。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleGuestLogin}>
                同意して続ける
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  )
}

export default LoginPage