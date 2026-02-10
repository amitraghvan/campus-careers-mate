/**
 * AppFooter — shared footer used on landing page.
 */

import { GraduationCap } from "lucide-react";
import { APP_CONFIG } from "@/config";

export function AppFooter() {
  return (
    <footer className="border-t border-border/30 py-8 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-display font-semibold">{APP_CONFIG.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">Built with 💚 for students</p>
      </div>
    </footer>
  );
}
