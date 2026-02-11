import { storage } from "@/utils";
import { AUTH_STORAGE_KEY } from "@/features/auth/constants";
import type { User, AuthSession, SignInDTO, SignUpDTO } from "@/features/auth/types";
import { api } from "@/lib/api";

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    college?: string;
    createdAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
  };
}

export const authService = {
  /** Get current session */
  getSession(): AuthSession | null {
    return storage.get<AuthSession | null>(AUTH_STORAGE_KEY, null);
  },

  /** Save session */
  saveSession(session: AuthSession): void {
    storage.set(AUTH_STORAGE_KEY, session);
  },

  /** Clear session */
  clearSession(): void {
    storage.remove(AUTH_STORAGE_KEY);
  },

  /** Update user profile */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    // In a real app, send PATCH /users/me
    // For now, update local session if needed, but backend is source of truth
    const session = this.getSession();
    if (session) {
      const updatedUser = { ...session.user, ...updates };
      this.saveSession({ ...session, user: updatedUser });
      return updatedUser;
    }
    throw new Error("No session");
  },

  /** Sign up — create a new user */
  async signUp(dto: SignUpDTO): Promise<AuthSession> {
    const response = await api.post<AuthResponse>("/auth/signup", {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      college: dto.college
    });

    // Backend returns { user, tokens: { accessToken, refreshToken, expiresIn } }
    const session: AuthSession & { accessToken?: string; refreshToken?: string } = {
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        college: response.user.college,
        createdAt: response.user.createdAt,
      },
      token: response.tokens.accessToken,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      expiresAt: new Date(Date.now() + (response.tokens.expiresIn || 900) * 1000).toISOString(),
    };

    this.saveSession(session);
    return session;
  },

  /** Sign in — authenticate an existing user */
  async signIn(dto: SignInDTO): Promise<AuthSession> {
    const response = await api.post<AuthResponse>("/auth/signin", {
      email: dto.email,
      password: dto.password
    });

    // Backend returns { user, tokens: { accessToken, refreshToken, expiresIn } }
    const session: AuthSession & { accessToken?: string; refreshToken?: string } = {
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        college: response.user.college,
        createdAt: response.user.createdAt,
      },
      token: response.tokens.accessToken,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      expiresAt: new Date(Date.now() + (response.tokens.expiresIn || 900) * 1000).toISOString(),
    };

    this.saveSession(session);
    return session;
  },

  /** Sign out */
  async signOut(): Promise<void> {
    try {
      await api.post("/auth/signout", {});
    } catch { /* ignore */ }
    this.clearSession();
  },
};
