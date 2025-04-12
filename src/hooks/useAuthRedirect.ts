// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAuthRedirect(requireAuth: boolean) {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const isAuthenticated = res.ok;

        if (requireAuth && !isAuthenticated && router.pathname !== '/login') {
          router.push('/login'); // protect page
        }

        if (!requireAuth && isAuthenticated && router.pathname !== '/profile') {
          router.push('/profile'); // prevent logged-in user from visiting public pages
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    })();
  }, [requireAuth, router]);
}
