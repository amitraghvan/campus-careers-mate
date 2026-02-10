import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Globe, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TRENDING_JOBS, RECOMMENDED_JOBS, CATEGORIES } from "@/features/explore/data/explore.data";
import { JobCard } from "@/features/explore/components/JobCard";

export default function ExplorePage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/20 border border-border/50 p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 border border-border/50 text-xs font-medium text-muted-foreground mb-4 backdrop-blur-sm"
                    >
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        <span>Global Opportunities</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4"
                    >
                        Explore opportunities beyond<br /> your campus.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg mb-8"
                    >
                        Discover thousands of internships and early-career roles at top companies.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-2 max-w-md"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by role, company, or skill..."
                                className="pl-9 h-11 bg-background/80 backdrop-blur-sm border-border/50"
                            />
                        </div>
                        <Button size="icon" variant="outline" className="h-11 w-11 shrink-0">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* Decorative Grid */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                <Button
                    variant={activeCategory === null ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveCategory(null)}
                    className="rounded-full"
                >
                    All
                </Button>
                {CATEGORIES.map(cat => (
                    <Button
                        key={cat.id}
                        variant={activeCategory === cat.id ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveCategory(cat.id)}
                        className="rounded-full whitespace-nowrap text-muted-foreground hover:text-foreground"
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>

            {/* Trending Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold">Trending Now <span className="text-muted-foreground font-normal text-sm ml-2">Based on your profile</span></h2>
                    <Button variant="link" className="text-sm h-auto p-0 text-muted-foreground hover:text-primary">View all</Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TRENDING_JOBS.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (i * 0.05) }}
                        >
                            <JobCard job={job} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recommended Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-bold">Recommended for You</h2>
                    <Button variant="link" className="text-sm h-auto p-0 text-muted-foreground hover:text-primary">View all</Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RECOMMENDED_JOBS.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.05) }}
                        >
                            <JobCard job={job} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Future API Banner */}
            <div className="mt-12 rounded-xl border border-dashed border-border p-6 flex items-center justify-center text-center bg-secondary/10">
                <div>
                    <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">More sources connecting...</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                        Real-time integrations with LinkedIn, Adzuna, and Remotive are coming soon.
                    </p>
                </div>
            </div>
        </div>
    );
}
