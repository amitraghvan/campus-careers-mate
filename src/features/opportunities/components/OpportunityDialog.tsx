/**
 * OpportunityDialog — modal form for creating/editing an opportunity.
 */

import { useState } from "react";
import { useOpportunities } from "@/features/opportunities/hooks/use-opportunities";
import type { Opportunity, OpportunityStatus } from "@/types";
import { STATUS_CONFIG } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
}

export function OpportunityDialog({
  open,
  onOpenChange,
  opportunity,
}: OpportunityDialogProps) {
  const { addOpportunity, updateOpportunity } = useOpportunities();
  const isEditing = !!opportunity;

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<OpportunityStatus>("wishlist");
  const [deadline, setDeadline] = useState("");
  const [pkg, setPkg] = useState("");
  const [hrName, setHrName] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && opportunity) {
      setCompany(opportunity.company);
      setRole(opportunity.role);
      setStatus(opportunity.status);
      setDeadline(opportunity.deadline);
      setPkg(opportunity.package || "");
      setHrName(opportunity.hrName || "");
      setHrEmail(opportunity.hrEmail || "");
      setNotes(opportunity.notes);
    } else if (newOpen) {
      setCompany("");
      setRole("");
      setStatus("wishlist");
      setDeadline("");
      setPkg("");
      setHrName("");
      setHrEmail("");
      setNotes("");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !deadline) return;

    if (isEditing) {
      updateOpportunity(opportunity.id, {
        company,
        role,
        status,
        deadline,
        package: pkg || undefined,
        hrName: hrName || undefined,
        hrEmail: hrEmail || undefined,
        notes,
      });
    } else {
      addOpportunity({
        company,
        role,
        status,
        deadline,
        package: pkg || undefined,
        hrName: hrName || undefined,
        hrEmail: hrEmail || undefined,
        notes,
        history: [{ status, date: new Date().toISOString() }],
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Opportunity" : "Add Opportunity"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as OpportunityStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_CONFIG) as OpportunityStatus[]).map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="package">Package (optional)</Label>
            <Input
              id="package"
              value={pkg}
              onChange={(e) => setPkg(e.target.value)}
              placeholder="e.g. ₹25 LPA"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="hrName">HR Name (Optional)</Label>
              <Input
                id="hrName"
                placeholder="e.g. Sarah Jenkins"
                value={hrName}
                onChange={(e) => setHrName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hrEmail">HR Email (Optional)</Label>
              <Input
                id="hrEmail"
                placeholder="e.g. sarah@company.com"
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preparation notes, links, tips..."
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Opportunity"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

