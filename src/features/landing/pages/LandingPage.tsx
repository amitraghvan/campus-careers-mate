/**
 * LandingPage — public-facing marketing page.
 */

import { HeroSection, FeaturesSection, PreviewSection, CTASection } from "@/features/landing/components";
import { AppHeader, AppFooter } from "@/components/layout";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AppHeader />
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <CTASection />
      <AppFooter />
    </div>
  );
}
