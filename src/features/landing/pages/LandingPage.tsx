/**
 * LandingPage — SecuraAI public marketing page.
 */

import { HeroSection, FeaturesSection, PreviewSection, CTASection } from "@/features/landing/components";
import { AppHeader, AppFooter } from "@/components/layout";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#06091a", overflow: "hidden" }}>
      <AppHeader />
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <CTASection />
      <AppFooter />
    </div>
  );
}
