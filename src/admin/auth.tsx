import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'notAdmin'; session: Session }
  | { status: 'admin'; session: Session }
  | { status: 'recovery'; session: Session };

interface AuthValue {
  state: AuthState;
  client: SupabaseClient;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  requestReset: (email: string) => Promise<string | null>;
  setPassword: (password: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthValue | null>(null);

// The admin check runs in the database (public.is_admin); hiding menu items
// is only a convenience. Every write is refused there for non-admins too.
async function resolve(client: SupabaseClient, session: Session | null): Promise<AuthState> {
  if (!session) return { status: 'signedOut' };
  const { data, error } = await client.rpc('is_admin');
  if (error) {
    console.error('Could not check admin rights', error);
    return { status: 'notAdmin', session };
  }
  return data ? { status: 'admin', session } : { status: 'notAdmin', session };
}

export function AuthProvider({ client, children }: { client: SupabaseClient; children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    client.auth.getSession().then(async ({ data }) => {
      const next = await resolve(client, data.session);
      if (active) setState(next);
    });
    const { data: subscription } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setState({ status: 'recovery', session });
        return;
      }
      if (event === 'SIGNED_OUT') setState({ status: 'signedOut' });
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Defer: Supabase must not be called from inside this callback.
        setTimeout(() => resolve(client, session).then((next) => active && setState(next)), 0);
      }
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [client]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (!error) return null;
    if (/invalid login credentials/i.test(error.message)) return 'Dit e-mailadres en wachtwoord horen niet bij elkaar. Controleer ze en probeer het opnieuw.';
    if (/email not confirmed/i.test(error.message)) return 'Dit e-mailadres is nog niet bevestigd. Open eerst de link in de bevestigingsmail.';
    return 'Inloggen is niet gelukt. Controleer uw internetverbinding en probeer het opnieuw.';
  }, [client]);

  const signOut = useCallback(async () => {
    await client.auth.signOut();
    setState({ status: 'signedOut' });
  }, [client]);

  const requestReset = useCallback(async (email: string) => {
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin/nieuw-wachtwoord` });
    return error ? 'Het versturen van de e-mail is niet gelukt. Probeer het later opnieuw.' : null;
  }, [client]);

  const setPassword = useCallback(async (password: string) => {
    const { error } = await client.auth.updateUser({ password });
    return error ? 'Het wachtwoord kon niet worden opgeslagen. Vraag een nieuwe link aan en probeer het opnieuw.' : null;
  }, [client]);

  return <AuthContext.Provider value={{ state, client, signIn, signOut, requestReset, setPassword }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within an AuthProvider');
  return value;
}

/** The Supabase client for admin pages (always configured inside the admin). */
// eslint-disable-next-line react-refresh/only-export-components
export function useAdminClient(): SupabaseClient {
  return useAuth().client;
}
