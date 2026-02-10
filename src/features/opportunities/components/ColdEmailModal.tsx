/**
 * ColdEmailModal — Generates and launches cold emails.
 */

import { useState, useEffect } from "react";
import { type Opportunity } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mail, Copy, Check, ExternalLink } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";

interface ColdEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    opportunity: Opportunity;
    onSent: () => void;
}

export function ColdEmailModal({ open, onOpenChange, opportunity, onSent }: ColdEmailModalProps) {
    const { user } = useAuth();
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (open && opportunity) {
            // Smart Subject Line
            setSubject(`Application for ${opportunity.role} Role - ${user?.name}`);

            // Context-Aware Body
            const greeting = opportunity.hrName ? `Hi ${opportunity.hrName},` : "Hi Hiring Team,";
            const company = opportunity.company;
            const role = opportunity.role;
            const myName = user?.name || "[My Name]";
            const myCollege = user?.college || "[My College]";
            // const myDegree = user?.academic?.degree || "[My Degree]"; // If we had academic context available here easily

            const template = `${greeting}

I am writing to express my strong interest in the ${role} position at ${company}.

I am a final year student at ${myCollege} with a strong foundation in software development. I have been following ${company}'s work and I am excited about the possibility of contributing to your team.

My resume is attached for your review. I would welcome the opportunity to discuss how my skills align with your needs.

Best regards,

${myName}
${user?.email || ""}
${user?.academic?.resumeLink || ""}
`;
            setBody(template);
        }
    }, [open, opportunity, user]);

    const handleLaunch = () => {
        const mailtoLink = `mailto:${opportunity.hrEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        onSent();
        onOpenChange(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${subject}\n\n${body}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Cold Email Generator
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {!opportunity.hrEmail && (
                        <div className="p-3 bg-warning/10 text-warning text-xs rounded-lg flex items-center gap-2">
                            <span>⚠ No HR Email found. You'll need to add the recipient manually.</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-secondary/30"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Message Body</label>
                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="bg-secondary/30 min-h-[200px] font-sans text-sm resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleCopy} className="gap-2">
                        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy Text"}
                    </Button>
                    <Button onClick={handleLaunch} className="gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground">
                        <ExternalLink className="h-4 w-4" />
                        Launch Mail App
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
