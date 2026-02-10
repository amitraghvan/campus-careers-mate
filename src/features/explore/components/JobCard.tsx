import { ExploreJob } from "@/features/explore/data/explore.data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowUpRight, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JobCardProps {
    job: ExploreJob;
}

export function JobCard({ job }: JobCardProps) {
    const [saved, setSaved] = useState(false);

    return (
        <div className="group relative bg-card hover:bg-secondary/20 border border-border/50 hover:border-border rounded-xl p-5 transition-all duration-300 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:bg-background group-hover:shadow-sm transition-all border border-transparent group-hover:border-border/50">
                        {job.logo}
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {job.role}
                        </h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setSaved(!saved);
                    }}
                    className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                        saved
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                >
                    <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="font-normal text-xs bg-secondary/50 text-muted-foreground hover:bg-secondary">
                    {job.type}
                </Badge>
                {job.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="font-normal text-xs text-muted-foreground">
                        {tag}
                    </Badge>
                ))}
                {job.trending && (
                    <Badge variant="default" className="font-normal text-xs bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                        Trending
                    </Badge>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {job.postedAt}
                    </span>
                </div>

                <Button size="sm" variant="ghost" className="h-7 px-2 -mr-2 text-xs hover:bg-primary hover:text-primary-foreground group-hover:flex hidden">
                    View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}
