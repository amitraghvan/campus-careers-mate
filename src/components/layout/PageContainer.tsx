/**
 * PageContainer — consistent page wrapper with background effects.
 */

import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  withEffects?: boolean;
}

export function PageContainer({ children, withEffects = true }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {withEffects && (
        <>
          <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <div className="fixed inset-0 bg-radial-glow opacity-30 pointer-events-none" />
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        </>
      )}
      {children}
    </div>
  );
}
