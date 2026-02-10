/**
 * SignUpForm — registration form with name, email, password, college.
 */

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks";
import { AUTH_ERRORS, AUTH_VALIDATION } from "@/features/auth/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, GraduationCap, Loader2, Eye, EyeOff } from "lucide-react";

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { signUp, isAuthenticating } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (name.trim().length < AUTH_VALIDATION.name.min) {
      setError(AUTH_ERRORS.nameTooShort);
      return;
    }
    if (!AUTH_VALIDATION.name.pattern.test(name)) {
      setError(AUTH_ERRORS.nameInvalid);
      return;
    }
    if (!AUTH_VALIDATION.email.pattern.test(email)) {
      setError(AUTH_ERRORS.invalidEmail);
      return;
    }
    if (password.length < AUTH_VALIDATION.password.min) {
      setError(AUTH_ERRORS.passwordTooShort);
      return;
    }

    try {
      await signUp({ name, email, password, college: college || undefined });
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : AUTH_ERRORS.genericError
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-name"
            type="text"
            placeholder="Amit Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
            required
            autoComplete="name"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="signup-password">
          Password{" "}
          <span className="text-muted-foreground font-normal">
            (min {AUTH_VALIDATION.password.min} characters)
          </span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary/50"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* College (optional) */}
      <div className="space-y-2">
        <Label htmlFor="signup-college">
          College{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-college"
            type="text"
            placeholder="e.g. IIT Delhi"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
            autoComplete="organization"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isAuthenticating}
        className="w-full bg-gradient-to-r from-accent to-primary text-primary-foreground border-0 hover:opacity-90 glow-accent transition-all"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}

