/**
 * OpportunityList — main list with search, filter, and CRUD actions.
 */

import { useState } from "react";
import { useOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import { OpportunityDialog } from "./OpportunityDialog";
import { OpportunityDetail } from "./OpportunityDetail";
import { STATUS_CONFIG } from "@/constants";
import { formatDateShort, isOverdue } from "@/utils";
import type { OpportunityStatus, Opportunity } from "@/types";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {(["all", ...Object.keys(STATUS_CONFIG)] as ("all" | OpportunityStatus)[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {s === "all" ? "All" : STATUS_CONFIG[s].label}
                </button>
              )
            )}
          </div>
          <Button
            onClick={() => {
              setEditingOpp(null);
              setDialogOpen(true);
            }}
            size="sm"
            className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0 hover:opacity-90 glow-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center">
          <p className="text-muted-foreground mb-4">No opportunities found.</p>
          <Button
            variant="outline"
            onClick={() => {
              setEditingOpp(null);
              setDialogOpen(true);
            }}
            className="border-primary/30 hover:bg-primary/5"
          >
            <Plus className="h-4 w-4 mr-1" /> Add your first opportunity
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filtered.map((opp, i) => {
              const config = STATUS_CONFIG[opp.status];
              const isPast =
                isOverdue(opp.deadline) &&
                opp.status !== "selected" &&
                opp.status !== "rejected";
              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-card-hover rounded-xl p-5 cursor-pointer group"
                  onClick={() => setViewingOpp(opp)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div
                        className={`h-3 w-3 rounded-full ${config.dotColor} flex-shrink-0 ring-4 ring-secondary/50`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-display font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {opp.company}
                          </h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {opp.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p
                        className={`text-xs font-medium ${
                          isPast ? "text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {isPast ? "⚠ Overdue" : formatDateShort(opp.deadline)}
                      </p>
                      {opp.package && (
                        <p className="text-xs text-primary font-medium">
                          {opp.package}
                        </p>
                      )}
                    </div>
                  </div>
                  {opp.checklist.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all"
                          style={{
                            width: `${
                              (opp.checklist.filter((c) => c.done).length /
                                opp.checklist.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {opp.checklist.filter((c) => c.done).length}/
                        {opp.checklist.length}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Dialogs */}
      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        opportunity={editingOpp}
      />

      {viewingOpp && (
        <OpportunityDetail
          opportunity={
            opportunities.find((o) => o.id === viewingOpp.id) || viewingOpp
          }
          open={!!viewingOpp}
          onOpenChange={(open) => !open && setViewingOpp(null)}
          onEdit={() => {
            handleEdit(viewingOpp);
            setViewingOpp(null);
          }}
          onDelete={() => {
            deleteOpportunity(viewingOpp.id);
            setViewingOpp(null);
          }}
        />
      )}
    </div>
  );
}

