/**
 * Auth Types — user, session, and auth form contracts.
 */

export interface AcademicProfile {
  tenthMarks: string;
  twelfthMarks: string;
  degree: string;
  branch: string;
  currentCGPA: string;
  backlogs: string; // "0" or number
  skills: string; // comma separated
  resumeLink: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  avatarUrl?: string;
  academic?: AcademicProfile;
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

