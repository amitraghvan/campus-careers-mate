/**
 * Auth Constants — validation rules, error messages, and field configs.
 */

export const AUTH_VALIDATION = {
  name: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    min: 8,
    max: 128,
  },
  college: {
    max: 100,
  },
} as const;

export const AUTH_ERRORS = {
  invalidEmail: "Please enter a valid email address",
  passwordTooShort: `Password must be at least ${AUTH_VALIDATION.password.min} characters`,
  nameRequired: "Full name is required",
  nameTooShort: `Name must be at least ${AUTH_VALIDATION.name.min} characters`,
  nameInvalid: "Name can only contain letters, spaces, hyphens, and apostrophes",
  invalidCredentials: "Invalid email or password",
  emailAlreadyExists: "An account with this email already exists",
  genericError: "Something went wrong. Please try again.",
} as const;

export const AUTH_STORAGE_KEY = "placement-tracker-auth";
