/**
 * OpportunityDetail — side sheet showing full details + checklist.
 */

import { useState } from "react";
import { useOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import type { Opportunity } from "@/types";
import { STATUS_CONFIG } from "@/constants";
import { formatDateLong } from "@/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface OpportunityDetailProps {
  opportunity: Opportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OpportunityDetail({
  opportunity,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: OpportunityDetailProps) {
  const { toggleChecklistItem, addChecklistItem, removeChecklistItem } =
    useOpportunities();
  const [newItem, setNewItem] = useState("");
  const config = STATUS_CONFIG[opportunity.status];

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    addChecklistItem(opportunity.id, newItem.trim());
    setNewItem("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{opportunity.company}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {opportunity.role}
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.color} font-medium`}
            >
              {config.label}
            </span>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Deadline</p>
              <p className="text-sm font-medium">
                {formatDateLong(opportunity.deadline)}
              </p>
            </div>
            {opportunity.package && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Package</p>
                <p className="text-sm font-medium">{opportunity.package}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          {opportunity.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Notes</p>
              <p className="text-sm leading-relaxed bg-muted/50 rounded-md p-3">
                {opportunity.notes}
              </p>
            </div>
          )}

          {/* Checklist */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Preparation Checklist
            </p>
            <div className="space-y-2">
              {opportunity.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={() =>
                      toggleChecklistItem(opportunity.id, item.id)
                    }
                  />
                  <span
                    className={`text-sm flex-1 ${
                      item.done ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() =>
                      removeChecklistItem(opportunity.id, item.id)
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Add a task..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                  className="text-sm"
                />
                <Button size="sm" variant="outline" onClick={handleAddItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
