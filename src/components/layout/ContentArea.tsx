/**
 * ContentArea — standardized max-width content wrapper for pages.
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContentAreaProps {
  children: ReactNode;
  className?: string;
}

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <main className={cn("relative max-w-7xl mx-auto px-4 sm:px-6 py-6", className)}>
      {children}
    </main>
  );
}

