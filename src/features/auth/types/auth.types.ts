/**
 * Auth Types — user, session, and auth form contracts.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}

export interface SignUpDTO {
  name: string;
  email: string;
  password: string;
  college?: string;
}

export type AuthMode = "sign-in" | "sign-up";

