import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col h-full opacity-60">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 w-full">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1 max-w-[180px]">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}
