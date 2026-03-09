/**
 * AppFooter — SecuraAI footer.
 */

import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LINKS = [
  { label: "Features", href: "#features-grid" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Privacy", href: "#" },
  { label: "Contact", href: "#" },
];

export function AppFooter() {
  const navigate = useNavigate();
  const handleClick = (href: string) => {
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else navigate(href);
  };

  return (
    <footer style={{ background: "#080b12", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "40px 24px" }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-5 text-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", boxShadow: "0 0 12px rgba(0,212,255,0.35)" }}>
            <Brain className="h-4 w-4" style={{ color: "#080b12" }} />
          </div>
          <span className="text-lg font-display font-bold">SecuraAI</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-6">
          {LINKS.map(l => (
            <button key={l.label} onClick={() => handleClick(l.href)} className="text-sm cursor-pointer transition-colors"
              style={{ color: "#475569", background: "none", border: "none", fontFamily: "inherit" }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = "#00d4ff")}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = "#475569")}>
              {l.label}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ width: "120px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent)" }} />

        <p className="text-xs" style={{ color: "#334155" }}>
          © 2026 SecuraAI. All rights reserved. · Built with ❤️ for students everywhere.
        </p>
      </div>
    </footer>
  );
}
