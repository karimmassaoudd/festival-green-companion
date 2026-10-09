import type { Session, User } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { getSupabaseClient } from '@/lib/supabase';

type AuthResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  startupError: string | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (fullName: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startupError, setStartupError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    try {
      const client = getSupabaseClient();
      const { data: authListener } = client.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return;
        setSession(isRegisteredSession(nextSession) ? nextSession : null);
        setIsLoading(false);
      });
      unsubscribe = () => authListener.subscription.unsubscribe();

      void client.auth.getSession().then(async ({ data, error }) => {
        if (!active) return;
        if (error) {
          setStartupError(error.message);
          setIsLoading(false);
          return;
        }

        if (data.session?.user.is_anonymous) {
          await client.auth.signOut();
        } else {
          setSession(data.session);
          setIsLoading(false);
        }
      });
    } catch (error) {
      const message = getErrorMessage(error);
      void Promise.resolve().then(() => {
        if (!active) return;
        setStartupError(message);
        setIsLoading(false);
      });
    }

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      try {
        const client = getSupabaseClient();
        if (state === 'active') client.auth.startAutoRefresh();
        else client.auth.stopAutoRefresh();
      } catch {
        // The login screen displays the missing-configuration error.
      }
    });

    return () => {
      active = false;
      unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      return { error: error?.message ?? null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }, []);

  const signUp = useCallback(
    async (fullName: string, email: string, password: string): Promise<AuthResult> => {
      try {
        const client = getSupabaseClient();
        const { data, error } = await client.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });

        return {
          error: error?.message ?? null,
          needsEmailConfirmation: !error && !data.session,
        };
      } catch (error) {
        return { error: getErrorMessage(error) };
      }
    },
    [],
  );

  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signOut();
      return { error: error?.message ?? null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      startupError,
      signIn,
      signUp,
      signOut,
    }),
    [isLoading, session, signIn, signOut, signUp, startupError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function isRegisteredSession(session: Session | null): session is Session {
  return Boolean(session && !session.user.is_anonymous);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected authentication error occurred.';
}
