import { useState } from "react";
import { useOpportunities } from "@/contexts/OpportunityContext";
import { STATUS_CONFIG, OpportunityStatus, Opportunity } from "@/types/opportunity";
import { OpportunityDialog } from "@/components/OpportunityDialog";
import { OpportunityDetail } from "@/components/OpportunityDetail";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OpportunityList() {
  const { opportunities, deleteOpportunity } = useOpportunities();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [viewingOpp, setViewingOpp] = useState<Opportunity | null>(null);

  const filtered = opportunities.filter((o) => {
    const matchesSearch =
      o.company.toLowerCase().includes(search.toLowerCase()) ||
      o.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setDialogOpen(true);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </button>
            {(Object.keys(STATUS_CONFIG) as OpportunityStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <Button onClick={() => { setEditingOpp(null); setDialogOpen(true); }} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-lg p-12 text-center animate-fade-in">
          <p className="text-muted-foreground">No opportunities found.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setEditingOpp(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add your first opportunity
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((opp, i) => {
            const config = STATUS_CONFIG[opp.status];
            const isPast = new Date(opp.deadline) < new Date() && opp.status !== "selected" && opp.status !== "rejected";
            return (
              <div
                key={opp.id}
                className="glass-card rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                onClick={() => setViewingOpp(opp)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{opp.company}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{opp.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs ${isPast ? "text-destructive" : "text-muted-foreground"}`}>
                      {isPast ? "Overdue" : formatDate(opp.deadline)}
                    </p>
                    {opp.package && <p className="text-xs text-muted-foreground">{opp.package}</p>}
                  </div>
                </div>
                {opp.checklist.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${(opp.checklist.filter((c) => c.done).length / opp.checklist.length) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {opp.checklist.filter((c) => c.done).length}/{opp.checklist.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        opportunity={editingOpp}
      />

      {viewingOpp && (
        <OpportunityDetail
          opportunity={opportunities.find((o) => o.id === viewingOpp.id) || viewingOpp}
          open={!!viewingOpp}
          onOpenChange={(open) => !open && setViewingOpp(null)}
          onEdit={() => { handleEdit(viewingOpp); setViewingOpp(null); }}
          onDelete={() => { deleteOpportunity(viewingOpp.id); setViewingOpp(null); }}
        />
      )}
    </div>
  );
}
