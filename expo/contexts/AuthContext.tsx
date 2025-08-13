import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Session, User} from '@supabase/supabase-js';
import {supabase} from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithPassword: (params: {email: string; password: string}) => Promise<{error: Error | null}>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({data}) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setIsLoading(false);
    });

    const {data: subscription} = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = useMemo(() => ({
    session,
    user: session?.user ?? null,
    isLoading,
    signInWithPassword: async ({email, password}) => {
      const {error} = await supabase.auth.signInWithPassword({email, password});
      return {error: error ? new Error(error.message) : null};
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  }), [session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


