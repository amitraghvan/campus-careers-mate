import { OpportunityProvider } from "@/contexts/OpportunityContext";
import { StatsCards } from "@/components/StatsCards";
import { UpcomingDeadlines } from "@/components/UpcomingDeadlines";
import { StatusBreakdown } from "@/components/StatusBreakdown";
import { OpportunityList } from "@/components/OpportunityList";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <OpportunityProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">PlaceTrack</h1>
              <p className="text-xs text-muted-foreground">Never miss an opportunity</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <StatsCards />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <UpcomingDeadlines />
              <StatusBreakdown />
            </div>
            <div className="lg:col-span-2">
              <OpportunityList />
            </div>
          </div>
        </main>
      </div>
    </OpportunityProvider>
  );
};

export default Index;

