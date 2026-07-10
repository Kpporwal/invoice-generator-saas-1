import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthStore {
  user: User | null;
  session: Session | null;

  loading: boolean;
  profileLoading: boolean;
  profileCompleted: boolean;

  refreshProfileStatus: () => Promise<void>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  signOut: () => Promise<void>;

  resetPassword: (
    email: string
  ) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  const checkProfileStatus = useCallback(async (userId: string) => {
    setProfileLoading(true);

    const { data, error } = await supabase
      .from("business_profiles")
      .select("profile_completed")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Business profile check failed:", error);
      setProfileCompleted(false);
      setProfileLoading(false);
      return;
    }

    setProfileCompleted(data?.profile_completed === true);
    setProfileLoading(false);
  }, []);

  const refreshProfileStatus = useCallback(async () => {
    if (!user) {
      setProfileCompleted(false);
      setProfileLoading(false);
      return;
    }

    await checkProfileStatus(user.id);
  }, [user, checkProfileStatus]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setProfileCompleted(false);
      setProfileLoading(false);
      return;
    }

    checkProfileStatus(user.id);
  }, [user, loading, checkProfileStatus]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        error: error?.message ?? null,
      };
    },
    []
  );

 const signOut = useCallback(async () => {
  try {
    const { error } = await supabase.auth.signOut({
      scope: "local",
    });

    if (error && error.name !== "AuthSessionMissingError") {
      throw error;
    }
  } catch (error) {
    const errorName =
      error instanceof Error ? error.name : "";

    if (errorName !== "AuthSessionMissingError") {
      console.error("Sign out failed:", error);
      throw error;
    }
  } finally {
    setSession(null);
    setUser(null);
    setProfileCompleted(false);
    setProfileLoading(false);
  }
}, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });

    return {
      error: error?.message ?? null,
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,

        loading,
        profileLoading,
        profileCompleted,

        refreshProfileStatus,

        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}