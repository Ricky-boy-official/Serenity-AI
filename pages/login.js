import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/');
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        theme="light"
        redirectTo={process.env.NEXT_PUBLIC_SITE_URL}
      />
    </div>
  );
}