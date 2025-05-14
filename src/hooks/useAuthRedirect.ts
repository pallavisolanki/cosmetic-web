// src/hooks/useAuthRedirect.ts
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export function useAuthRedirect(requireAuth: boolean) {
  const router = useRouter();
  const redirectedRef = useRef(false); // ✅ prevent loops

  useEffect(() => {
    if (redirectedRef.current) return;

    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const isAuthenticated = res.ok;

        if (requireAuth && !isAuthenticated && router.pathname !== '/login') {
          redirectedRef.current = true;
          router.push('/login');
        }

        if (!requireAuth && isAuthenticated && router.pathname !== '/profile') {
          redirectedRef.current = true;
          router.push('/profile');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    })();
  }, [requireAuth, router]);
}

