/**
 * ActivityFeedPage — LinkedIn-style activity stream for peers.
 *
 * Features:
 *  - Chronological feed of peer activity (solved problems, achievements, streaks)
 *  - Post types: achievement, question, milestone, resource share
 *  - Like / React to posts
 *  - Comment on posts
 *  - Create post box
 *  - Right rail: trending topics + leaderboard
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Flame, Trophy, BookOpen, Share2, ThumbsUp,
    MessageCircle, Bookmark, MoreHorizontal,
    Code2, Zap, Target, Plus, Star, ChevronUp, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PostType = "achievement" | "question" | "milestone" | "resource" | "streak";

interface FeedPost {
    id: string;
    author: { name: string; avatar: string; college: string; role: string };
    type: PostType;
    content: string;
    meta?: string; // e.g. "Hard · LeetCode", "DSA · Link"
    tags: string[];
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
    time: string;
    reactions: { emoji: string; count: number }[];
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_POSTS: FeedPost[] = [
    {
        id: "p1", type: "achievement",
        author: { name: "Arjun Sharma", avatar: "AS", college: "IIT Bombay", role: "SDE Aspirant" },
        content: "🏆 Just cracked LeetCode Hard #84 – Largest Rectangle in Histogram using Stack in O(n)! This problem appears in almost every FAANG interview. DM me if you want my approach explained!",
        meta: "Hard · LeetCode · Stack",
        tags: ["DSA", "FAANG", "LeetCode"],
        likes: 47, comments: 12, isLiked: false, isBookmarked: false, time: "2 min ago",
        reactions: [{ emoji: "🔥", count: 14 }, { emoji: "🏆", count: 8 }],
    },
    {
        id: "p2", type: "streak",
        author: { name: "Priya Nair", avatar: "PN", college: "NIT Trichy", role: "ML Enthusiast" },
        content: "📅 Day 45 of my DSA streak! No breaks, no excuses. Current stat: 287 problems solved, 67 Hard. Still going 💪 Anyone else grinding daily? Drop a 🔥 in comments!",
        meta: "45-day streak",
        tags: ["Consistency", "DSA", "Motivation"],
        likes: 89, comments: 23, isLiked: true, isBookmarked: false, time: "15 min ago",
        reactions: [{ emoji: "🔥", count: 31 }, { emoji: "💪", count: 19 }, { emoji: "🙏", count: 7 }],
    },
    {
        id: "p3", type: "question",
        author: { name: "Rohan Verma", avatar: "RV", college: "BITS Pilani", role: "Full Stack Dev" },
        content: "Quick Q: When designing a URL shortener, do you store the hash → URL mapping in Redis (fast, ephemeral) or PostgreSQL (persistent)? What's the right tradeoff for 100M DAU?",
        meta: "System Design · Key-Value Stores",
        tags: ["System Design", "Redis", "Database"],
        likes: 34, comments: 18, isLiked: false, isBookmarked: true, time: "1 hr ago",
        reactions: [{ emoji: "🤔", count: 12 }],
    },
    {
        id: "p4", type: "milestone",
        author: { name: "Sneha Patel", avatar: "SP", college: "IIIT Hyderabad", role: "SWE Aspirant" },
        content: "🎉 HUGE milestone — just got invited to an Amazon OA after months of grinding! Started from 0 a year ago. PlaceTrack + peer accountability made all the difference. Thank you to everyone who helped me!",
        meta: "Amazon OA Invite",
        tags: ["Amazon", "FAANG", "Success"],
        likes: 203, comments: 41, isLiked: true, isBookmarked: true, time: "3 hr ago",
        reactions: [{ emoji: "🎉", count: 67 }, { emoji: "❤️", count: 45 }, { emoji: "🔥", count: 28 }],
    },
    {
        id: "p5", type: "resource",
        author: { name: "Karan Mehta", avatar: "KM", college: "DTU Delhi", role: "Cloud Engineer" },
        content: "📚 Best free resources for System Design (2026 edition):\n\n1. Designing Data-Intensive Applications (Kleppmann)\n2. ByteByteGo Newsletter\n3. Hussein Nasser on YouTube\n4. AWS Architecture Center\n\nSave this for your FAANG prep!",
        meta: "Resource List",
        tags: ["Resources", "System Design", "Free"],
        likes: 156, comments: 29, isLiked: false, isBookmarked: false, time: "5 hr ago",
        reactions: [{ emoji: "🙏", count: 48 }, { emoji: "⭐", count: 32 }],
    },
];

const TRENDING_TOPICS = [
    { tag: "FAANG Prep", posts: 342 },
    { tag: "LeetCode Hard", posts: 218 },
    { tag: "System Design", posts: 195 },
    { tag: "ML Papers", posts: 134 },
    { tag: "Consistency", posts: 97 },
];

const LEADERBOARD = [
    { name: "Priya N.", avatar: "PN", score: 1840, delta: 12 },
    { name: "Arjun S.", avatar: "AS", score: 1720, delta: 6 },
    { name: "Sneha P.", avatar: "SP", score: 1580, delta: 23 },
];

const POST_TYPE_META: Record<PostType, { icon: React.ElementType; color: string; label: string }> = {
    achievement: { icon: Trophy, color: "text-yellow-400", label: "Achievement" },
    streak: { icon: Flame, color: "text-orange-400", label: "Streak" },
    question: { icon: MessageCircle, color: "text-blue-400", label: "Question" },
    milestone: { icon: Target, color: "text-green-400", label: "Milestone" },
    resource: { icon: BookOpen, color: "text-violet-400", label: "Resource" },
};

const REACTION_SET = ["🔥", "❤️", "🎉", "💪", "🙏", "🤔", "⭐"];

// ─── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({ post, onLike, onBookmark }: {
    post: FeedPost;
    onLike: (id: string) => void;
    onBookmark: (id: string) => void;
}) {
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");
    const [showReactions, setShowReactions] = useState(false);
    const { icon: TypeIcon, color, label } = POST_TYPE_META[post.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/70 border border-border/50 rounded-2xl p-5 hover:border-border/80 transition-all space-y-4"
        >
            {/* Author row */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-border/50">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 font-bold text-xs">
                            {post.author.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{post.author.name}</span>
                            <span className={cn("flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-secondary", color)}>
                                <TypeIcon className="h-2.5 w-2.5" /> {label}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{post.author.college} · {post.author.role} · {post.time}</p>
                    </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>

            {/* Meta / tags */}
            {post.meta && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Code2 className="h-3.5 w-3.5" />
                    <span>{post.meta}</span>
                </div>
            )}

            <div className="flex flex-wrap gap-1.5">
                {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                        #{tag}
                    </Badge>
                ))}
            </div>

            {/* Reaction bar */}
            {post.reactions.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {post.reactions.map(r => (
                        <span key={r.emoji} className="flex items-center gap-1 text-sm px-2 py-0.5 rounded-full bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors">
                            {r.emoji} <span className="text-xs text-muted-foreground">{r.count}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* Action bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-1">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-8 gap-1.5 text-xs", post.isLiked ? "text-violet-400 hover:text-violet-300" : "text-muted-foreground hover:text-foreground")}
                            onClick={() => onLike(post.id)}
                            onMouseEnter={() => setShowReactions(true)}
                            onMouseLeave={() => setShowReactions(false)}
                        >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            {post.likes}
                        </Button>
                        <AnimatePresence>
                            {showReactions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-9 left-0 flex gap-1 p-2 bg-popover border border-border/60 rounded-2xl shadow-xl z-20"
                                >
                                    {REACTION_SET.map(e => (
                                        <button key={e} className="text-lg hover:scale-125 transition-transform">{e}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setShowComment(v => !v)}
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments}
                    </Button>

                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                        <Share2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn("h-8 gap-1.5 text-xs", post.isBookmarked ? "text-yellow-400" : "text-muted-foreground hover:text-foreground")}
                    onClick={() => onBookmark(post.id)}
                >
                    <Bookmark className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Comment box */}
            <AnimatePresence>
                {showComment && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form
                            onSubmit={e => { e.preventDefault(); setComment(""); setShowComment(false); }}
                            className="flex gap-2 pt-2 border-t border-border/30"
                        >
                            <Input
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 h-8 text-xs bg-secondary/40 border-border/40"
                                autoFocus
                            />
                            <Button type="submit" size="sm" className="h-8 px-3 bg-gradient-to-r from-violet-600 to-blue-600 border-0 text-white" disabled={!comment.trim()}>
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Create Post ──────────────────────────────────────────────────────────────

function CreatePost({ onPost }: { onPost: (text: string, type: PostType) => void }) {
    const [text, setText] = useState("");
    const [type, setType] = useState<PostType>("achievement");

    return (
        <div className="bg-card/70 border border-border/50 rounded-2xl p-4 space-y-3">
            <div className="flex gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 font-bold text-xs">ME</AvatarFallback>
                </Avatar>
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Share an achievement, question, or resource with your network..."
                    className="flex-1 bg-secondary/40 rounded-xl px-3 py-2 text-sm resize-none border border-border/40 focus:outline-none focus:border-primary/40 transition-colors min-h-[70px]"
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {(Object.keys(POST_TYPE_META) as PostType[]).map(t => {
                        const { icon: Icon, color, label } = POST_TYPE_META[t];
                        return (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={cn(
                                    "flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-all",
                                    type === t ? `border-current bg-secondary ${color}` : "border-border/40 text-muted-foreground hover:border-border"
                                )}
                            >
                                <Icon className="h-3 w-3" /> {label}
                            </button>
                        );
                    })}
                </div>
                <Button
                    size="sm"
                    className="h-8 px-4 bg-gradient-to-r from-violet-600 to-blue-600 border-0 text-white text-xs"
                    disabled={!text.trim()}
                    onClick={() => { onPost(text, type); setText(""); }}
                >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Post
                </Button>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ActivityFeedPage() {
    const [posts, setPosts] = useState<FeedPost[]>(DEMO_POSTS);
    const [filter, setFilter] = useState<"all" | PostType>("all");

    const handleLike = (id: string) => {
        setPosts(prev => prev.map(p => p.id === id
            ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
            : p
        ));
    };
    const handleBookmark = (id: string) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
    };
    const handleCreatePost = (text: string, type: PostType) => {
        const np: FeedPost = {
            id: `p${Date.now()}`, type,
            author: { name: "You", avatar: "ME", college: "Your College", role: "Student" },
            content: text, meta: undefined, tags: [],
            likes: 0, comments: 0, isLiked: false, isBookmarked: false, time: "Just now",
            reactions: [],
        };
        setPosts(prev => [np, ...prev]);
    };

    const filtered = filter === "all" ? posts : posts.filter(p => p.type === filter);

    return (
        <div className="flex h-full overflow-hidden">
            {/* Main feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <CreatePost onPost={handleCreatePost} />

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {[{ key: "all", label: "All Activity" }, ...Object.entries(POST_TYPE_META).map(([k, v]) => ({ key: k, label: v.label }))].map(({ key, label }) => (
                        <Button
                            key={key}
                            size="sm"
                            variant={filter === key ? "default" : "ghost"}
                            className={cn("h-8 text-xs shrink-0", filter === key && "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0")}
                            onClick={() => setFilter(key as any)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                {filtered.map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} onBookmark={handleBookmark} />
                ))}
            </div>

            {/* Right rail */}
            <div className="w-72 border-l border-border/40 p-4 space-y-6 overflow-y-auto hidden lg:block shrink-0 bg-card/20">
                {/* Trending */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">🔥 Trending Topics</h3>
                    <div className="space-y-2">
                        {TRENDING_TOPICS.map((t, i) => (
                            <div key={t.tag} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/60 cursor-pointer transition-colors">
                                <div>
                                    <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                                    <p className="text-sm font-medium">#{t.tag}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{t.posts} posts</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">🏆 This Week's Leaders</h3>
                    <div className="space-y-2">
                        {LEADERBOARD.map((u, i) => (
                            <div key={u.name} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <span className={cn("text-sm font-bold w-5 text-center", i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-amber-600")}>
                                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                                </span>
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 font-bold">{u.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{u.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{u.score} pts</p>
                                </div>
                                <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                                    <ChevronUp className="h-2.5 w-2.5" />{u.delta}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI tip */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-950/40 to-blue-950/20 border border-violet-500/20">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Zap className="h-3.5 w-3.5 text-violet-400" />
                        <span className="text-xs font-semibold text-violet-400">AI Network Tip</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Commenting on peers' posts increases your visibility by 3× and gets you 2 more connection requests on average this week.
                    </p>
                </div>
            </div>
        </div>
    );
}
