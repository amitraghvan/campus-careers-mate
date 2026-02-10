/**
 * Notes Page — interview prep and company research notes.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    StickyNote, Plus, Search, Trash2, Edit3, X, Save,
    BookOpen, Building2, Lightbulb, Code2, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/utils";
import { formatDistanceToNow } from "@/utils/date";

interface Note {
    id: string;
    title: string;
    content: string;
    category: string;
    company?: string;
    createdAt: string;
    updatedAt: string;
}

const CATEGORIES = [
    { value: "interview", label: "Interview Prep", icon: BookOpen, color: "text-primary" },
    { value: "company", label: "Company Research", icon: Building2, color: "text-info" },
    { value: "technical", label: "Technical", icon: Code2, color: "text-warning" },
    { value: "tips", label: "Tips & Tricks", icon: Lightbulb, color: "text-success" },
    { value: "general", label: "General", icon: FileText, color: "text-accent" },
];

const NOTES_KEY = "placement-tracker-notes";

function getNotes(): Note[] {
    return storage.get<Note[]>(NOTES_KEY, []);
}

function saveNotes(notes: Note[]): void {
    storage.set(NOTES_KEY, notes);
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>(() => getNotes());
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // New note form
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("general");
    const [company, setCompany] = useState("");

    const filtered = useMemo(() => {
        return notes
            .filter((n) => {
                if (activeCategory !== "all" && n.category !== activeCategory) return false;
                if (search) {
                    const q = search.toLowerCase();
                    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.company?.toLowerCase().includes(q);
                }
                return true;
            })
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [notes, search, activeCategory]);

    const persist = (updated: Note[]) => {
        setNotes(updated);
        saveNotes(updated);
    };

    const handleCreate = () => {
        if (!title.trim()) return;
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: title.trim(),
            content: content.trim(),
            category,
            company: company.trim() || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        persist([newNote, ...notes]);
        resetForm();
    };

    const handleUpdate = () => {
        if (!editingNote || !title.trim()) return;
        const updated = notes.map((n) =>
            n.id === editingNote.id
                ? { ...n, title: title.trim(), content: content.trim(), category, company: company.trim() || undefined, updatedAt: new Date().toISOString() }
                : n
        );
        persist(updated);
        resetForm();
    };

    const handleDelete = (id: string) => {
        persist(notes.filter((n) => n.id !== id));
    };

    const startEdit = (note: Note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
        setCompany(note.company || "");
        setIsCreating(true);
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setCategory("general");
        setCompany("");
        setEditingNote(null);
        setIsCreating(false);
    };

    const getCategoryInfo = (cat: string) => CATEGORIES.find((c) => c.value === cat) || CATEGORIES[4];

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold tracking-tight">Notes</h1>
                    <p className="text-muted-foreground text-sm mt-1">Interview prep & company research</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreating(true); }} size="sm" className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0">
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Note
                </Button>
            </motion.div>

            {/* Search & filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-secondary/50 border-border/30"
                    />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategory === "all" ? "bg-primary/15 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        All
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategory === cat.value ? "bg-primary/15 text-primary" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Create/Edit form */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card rounded-xl p-5 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold">{editingNote ? "Edit Note" : "New Note"}</h3>
                            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary/50 border-border/30" />
                            <div className="flex gap-3">
                                <Input placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-secondary/50 border-border/30 flex-1" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="bg-secondary/50 border border-border/30 rounded-md px-3 text-sm text-foreground"
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                            <Textarea placeholder="Write your notes..." value={content} onChange={(e) => setContent(e.target.value)} className="bg-secondary/50 border-border/30 min-h-[120px]" />
                            <div className="flex justify-end">
                                <Button onClick={editingNote ? handleUpdate : handleCreate} size="sm" disabled={!title.trim()} className="bg-gradient-to-r from-primary to-info text-primary-foreground border-0">
                                    <Save className="h-4 w-4 mr-1.5" />
                                    {editingNote ? "Update" : "Save"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notes grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((note, i) => {
                        const catInfo = getCategoryInfo(note.category);
                        return (
                            <motion.div
                                key={note.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.03 }}
                                className="glass-card-hover rounded-xl p-4 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <catInfo.icon className={`h-4 w-4 shrink-0 ${catInfo.color}`} />
                                        <h4 className="text-sm font-semibold truncate">{note.title}</h4>
                                    </div>
                                    <div className="flex gap-1 shrink-0 ml-2">
                                        <button onClick={() => startEdit(note)} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                            <Edit3 className="h-3 w-3" />
                                        </button>
                                        <button onClick={() => handleDelete(note.id)} className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                {note.company && (
                                    <p className="text-xs text-primary mb-1.5">{note.company}</p>
                                )}
                                <p className="text-xs text-muted-foreground line-clamp-4 flex-1">{note.content || "No content"}</p>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${catInfo.color} bg-secondary/50`}>
                                        {catInfo.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(note.updatedAt)}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <StickyNote className="h-12 w-12 text-muted-foreground/20 mb-3" />
                    <p className="text-muted-foreground text-sm">
                        {search ? "No notes match your search" : "No notes yet — create one!"}
                    </p>
                </div>
            )}
        </div>
    );
}
