/**
 * AuthContext — global auth state management.
 * Provides user session, sign in/up/out actions to the entire app.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import type { User, AuthSession, SignInDTO, SignUpDTO } from "@/features/auth/types";
import { authService } from "@/features/auth/services";

interface AuthContextType {
  /** Current authenticated user, or null */
  user: User | null;
  /** Whether auth state is still loading on mount */
  isLoading: boolean;
  /** Whether a sign in/up operation is in progress */
  isAuthenticating: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Sign in with email/password */
  signIn: (dto: SignInDTO) => Promise<void>;
  /** Sign up with name/email/password */
  signUp: (dto: SignUpDTO) => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const session = authService.getSession();
    if (session && new Date(session.expiresAt) > new Date()) {
      setUser(session.user);
    } else {
      authService.clearSession();
    }
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (dto: SignInDTO) => {
    setIsAuthenticating(true);
    try {
      const session = await authService.signIn(dto);
      setUser(session.user);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signUp = useCallback(async (dto: SignUpDTO) => {
    setIsAuthenticating(true);
    try {
      const session = await authService.signUp(dto);
      setUser(session.user);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 * Must be used within AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

