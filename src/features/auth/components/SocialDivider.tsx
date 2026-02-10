/**
 * SocialDivider — "or continue with" divider for auth forms.
 */

export function SocialDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/50" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-3 text-muted-foreground tracking-wider">
          or
        </span>
      </div>
    </div>
  );
}

