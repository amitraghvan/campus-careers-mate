/**
 * Auth Service — handles authentication persistence.
 * Currently uses localStorage. Swap to a real API in production.
 */

import { storage } from "@/utils";
import { AUTH_STORAGE_KEY } from "@/features/auth/constants";
import type { User, AuthSession, SignInDTO, SignUpDTO } from "@/features/auth/types";

const USERS_KEY = "placement-tracker-users";

/** Simulated delay for realistic UX */
function delay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  /** Get saved users from storage */
  getUsers(): Record<string, { user: User; passwordHash: string }> {
    return storage.get(USERS_KEY, {}) as Record<string, { user: User; passwordHash: string }>;
  },

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
    await delay();

    const users = this.getUsers();
    let foundEmail = "";

    // Find user by ID (since we key by email)
    for (const [email, record] of Object.entries(users)) {
      if (record.user.id === userId) {
        foundEmail = email;
        break;
      }
    }

    if (!foundEmail) throw new Error("User not found");

    // Update user record
    // @ts-ignore - we know structure from getUsers but TS is being strict about object entries
    const updatedUser = { ...users[foundEmail].user, ...updates };
    users[foundEmail].user = updatedUser;

    // Save back to storage
    storage.set(USERS_KEY, users);

    // Update current session if active
    const session = this.getSession();
    if (session && session.user.id === userId) {
      this.saveSession({ ...session, user: updatedUser });
    }

    return updatedUser;
  },

  /** Sign up — create a new user */
  async signUp(dto: SignUpDTO): Promise<AuthSession> {
    await delay();

    const users = this.getUsers();
    const emailKey = dto.email.toLowerCase().trim();

    if (users[emailKey]) {
      throw new Error("An account with this email already exists");
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      email: emailKey,
      college: dto.college?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // Store user (password stored as simple hash — demo only)
    users[emailKey] = {
      user,
      passwordHash: btoa(dto.password), // NOT production safe — demo only
    };
    storage.set(USERS_KEY, users);

    const session: AuthSession = {
      user,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.saveSession(session);
    return session;
  },

  /** Sign in — authenticate an existing user */
  async signIn(dto: SignInDTO): Promise<AuthSession> {
    await delay();

    const users = this.getUsers();
    const emailKey = dto.email.toLowerCase().trim();
    const record = users[emailKey];

    if (!record || record.passwordHash !== btoa(dto.password)) {
      throw new Error("Invalid email or password");
    }

    const session: AuthSession = {
      user: record.user,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    this.saveSession(session);
    return session;
  },

  /** Sign out */
  async signOut(): Promise<void> {
    await delay(300);
    this.clearSession();
  },
};

