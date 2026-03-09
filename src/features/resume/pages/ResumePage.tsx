/**
 * ResumePage — AI-powered Resume Builder with ATS scoring.
 * Multi-section form | Live preview | AI enhancement | PDF download
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, User, Briefcase, GraduationCap, Code2, FolderOpen, Award, Star,
    Sparkles, Brain, Download, Save, Plus, Trash2, Loader2, ChevronDown,
    ChevronUp, RefreshCw, CheckCircle, AlertTriangle, XCircle, Zap, Target,
    BarChart3, Key, Trophy, BookOpen, Palette, Phone, Mail, Linkedin, Github, Globe, MapPin
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { resumeService, type ResumeData, type ATSResult, type ResumeMeta } from "@/services/resume.service";

const DEFAULT_RESUME: ResumeData = {
    personalInfo: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "", targetRole: "" },
    summary: "",
    experience: [],
    education: [],
    skills: { languages: [], frameworks: [], tools: [], soft: [] },
    projects: [],
    certifications: [],
    achievements: [],
    theme: { fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#000000" },
};

type Section = "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "achievements" | "design";

const NAV_SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal", icon: <User size={15} /> },
    { id: "summary", label: "Summary", icon: <FileText size={15} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={15} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={15} /> },
    { id: "skills", label: "Skills", icon: <Code2 size={15} /> },
    { id: "projects", label: "Projects", icon: <FolderOpen size={15} /> },
    { id: "certifications", label: "Certs", icon: <Award size={15} /> },
    { id: "achievements", label: "Achievements", icon: <Star size={15} /> },
    { id: "design", label: "Design", icon: <Palette size={15} /> },
];

const uid = () => Math.random().toString(36).slice(2);

export default function ResumePage() {
    const [resume, setResume] = useState<ResumeData>(DEFAULT_RESUME);
    const [activeSection, setActiveSection] = useState<Section>("personal");
    const [savedResumes, setSavedResumes] = useState<ResumeMeta[]>([]);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
    const [atsLoading, setAtsLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [enhancingIdx, setEnhancingIdx] = useState<number | null>(null);
    const [jobDesc, setJobDesc] = useState("");
    const [showATS, setShowATS] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [initialFetchDone, setInitialFetchDone] = useState(false);

    // Initial fetch of existing resume
    useEffect(() => {
        const fetchExisting = async () => {
            try {
                const list = await resumeService.listResumes();
                if (list.length > 0) {
                    const existing = await resumeService.getResume(list[0].id);
                    if (existing && existing.data) {
                        // Merge with default to ensure all nested objects exist
                        setResume({ ...DEFAULT_RESUME, ...existing.data });
                        setCurrentId(existing.id);
                        if (existing.atsFeedback) {
                            setAtsResult(existing.atsFeedback);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load existing resume", error);
            } finally {
                setInitialFetchDone(true);
            }
        };
        fetchExisting();
    }, []);

    // Auto-save effect
    useEffect(() => {
        if (!initialFetchDone) return;

        const hasContent = resume.personalInfo.name || resume.summary || resume.experience.length > 0 || resume.education.length > 0;
        if (!hasContent) return;

        const timer = setTimeout(async () => {
            try {
                if (currentId) {
                    await resumeService.updateResume(currentId, { data: resume, title: resume.personalInfo.name ? `${resume.personalInfo.name}'s Resume` : "My Resume" });
                } else {
                    const res = await resumeService.createResume(resume.personalInfo.name ? `${resume.personalInfo.name}'s Resume` : "My Resume", resume);
                    setCurrentId(res.id);
                }
            } catch (e) { }
        }, 1500);

        return () => clearTimeout(timer);
    }, [resume, initialFetchDone, currentId]);

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const a4Width = 794; // ~210mm in pixels at 96 DPI
                if (containerWidth < a4Width + 32) {
                    setScale((containerWidth - 32) / a4Width);
                } else {
                    setScale(1);
                }
            }
        };

        const timer = setTimeout(updateScale, 100);
        window.addEventListener('resize', updateScale);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateScale);
        };
    }, []);

    const updateResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
        setResume(updater);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (currentId) {
                await resumeService.updateResume(currentId, { data: resume });
            } else {
                const res = await resumeService.createResume(resume.personalInfo.name ? `${resume.personalInfo.name}'s Resume` : "My Resume", resume);
                setCurrentId(res.id);
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleAISummary = async () => {
        setSummaryLoading(true);
        try {
            const text = await resumeService.generateSummary(resume);
            setResume(prev => ({ ...prev, summary: text }));
        } catch (e) { console.error(e); }
        finally { setSummaryLoading(false); }
    };

    const handleEnhanceBullets = async (idx: number) => {
        const exp = resume.experience[idx];
        if (!exp) return;
        setEnhancingIdx(idx);
        try {
            const bullets = await resumeService.enhanceBullets(exp.role, exp.bullets);
            setResume(prev => {
                const updated = [...prev.experience];
                updated[idx] = { ...updated[idx], bullets };
                return { ...prev, experience: updated };
            });
        } catch (e) { console.error(e); }
        finally { setEnhancingIdx(null); }
    };

    const handleATS = async () => {
        setAtsLoading(true);
        setShowATS(true);
        try {
            const result = await resumeService.analyzeATS(resume, jobDesc);
            setAtsResult(result);
            if (currentId) await resumeService.updateResume(currentId, { atsScore: result.score, atsFeedback: result });
        } catch (e) { console.error(e); }
        finally { setAtsLoading(false); }
    };

    const handlePrint = useReactToPrint({
        contentRef: previewRef,
        documentTitle: resume.personalInfo.name ? `${resume.personalInfo.name.replace(/\s+/g, '_')}_Resume` : "My_Resume",
        pageStyle: `
            @page { size: A4; margin: 0; }
            @media print { body { -webkit-print-color-adjust: exact; } }
        `
    });

    const addExperience = () => setResume(prev => ({
        ...prev,
        experience: [...prev.experience, { id: uid(), company: "", role: "", startDate: "", endDate: "", current: false, bullets: [""] }],
    }));

    const addEducation = () => setResume(prev => ({
        ...prev,
        education: [...prev.education, { id: uid(), institution: "", degree: "", field: "", year: "", cgpa: "" }],
    }));

    const addProject = () => setResume(prev => ({
        ...prev,
        projects: [...prev.projects, { id: uid(), title: "", techStack: "", description: "", link: "" }],
    }));

    const addCertification = () => setResume(prev => ({
        ...prev,
        certifications: [...prev.certifications, { id: uid(), name: "", issuer: "", date: "", url: "" }],
    }));

    const addSkillTag = (category: keyof ResumeData["skills"], value: string) => {
        if (!value.trim()) return;
        setResume(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: [...prev.skills[category], value.trim()] },
        }));
    };

    const removeSkillTag = (category: keyof ResumeData["skills"], idx: number) => {
        setResume(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: prev.skills[category].filter((_, i) => i !== idx) },
        }));
    };

    const scoreColor = (s: number) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : s >= 40 ? "#f97316" : "#ef4444";
    const verdictColor = (v: string) => v === "Excellent" ? "text-green-400" : v === "Good" ? "text-yellow-400" : v === "Needs Work" ? "text-orange-400" : "text-red-400";

    return (
        <div className="p-4 md:p-6 space-y-4 print:p-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <FileText className="text-primary" size={28} />
                        AI Resume Builder
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Build a professional resume with AI enhancement & ATS scoring</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-white/10 border border-white/10 text-foreground font-semibold px-4 py-2 rounded-xl hover:bg-white/15 transition-all text-sm disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity text-sm"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* ── LEFT: FORM ── */}
                <div className="w-full xl:w-[480px] shrink-0 space-y-4 print:hidden">
                    {/* Section Nav */}
                    <div className="glass-card rounded-xl p-1.5 flex gap-1 overflow-x-auto">
                        {NAV_SECTIONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeSection === s.id
                                    ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    }`}
                            >
                                {s.icon}{s.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18 }}
                            className="glass-card rounded-xl p-5 space-y-4"
                        >
                            {/* ─ PERSONAL ─ */}
                            {activeSection === "personal" && (
                                <>
                                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><User size={16} className="text-primary" />Personal Information</h3>
                                    {(["name", "email", "phone", "location", "targetRole", "linkedin", "github", "website"] as const).map(field => (
                                        <div key={field}>
                                            <label className="text-xs text-muted-foreground capitalize mb-1 block">{field === "targetRole" ? "Target Role" : field === "linkedin" ? "LinkedIn URL" : field === "github" ? "GitHub URL" : field === "website" ? "Portfolio/Website" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                            <input
                                                type="text"
                                                value={resume.personalInfo[field]}
                                                onChange={e => setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: e.target.value } }))}
                                                placeholder={field === "targetRole" ? "e.g. Software Engineer" : field === "linkedin" ? "linkedin.com/in/username" : ""}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* ─ SUMMARY ─ */}
                            {activeSection === "summary" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><FileText size={16} className="text-primary" />Professional Summary</h3>
                                        <button
                                            onClick={handleAISummary}
                                            disabled={summaryLoading}
                                            className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-info text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {summaryLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                            AI Write
                                        </button>
                                    </div>
                                    <textarea
                                        value={resume.summary}
                                        onChange={e => setResume(prev => ({ ...prev, summary: e.target.value }))}
                                        rows={6}
                                        placeholder="Write a compelling professional summary or click 'AI Write' to generate one..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground">Tip: Fill in Personal Info + Skills first for better AI results.</p>
                                </>
                            )}

                            {/* ─ EXPERIENCE ─ */}
                            {activeSection === "experience" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Briefcase size={16} className="text-primary" />Work Experience</h3>
                                        <button onClick={addExperience} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-semibold">
                                            <Plus size={14} />Add
                                        </button>
                                    </div>
                                    {resume.experience.length === 0 && (
                                        <p className="text-xs text-muted-foreground text-center py-4">No experience added yet. Click Add to get started.</p>
                                    )}
                                    {resume.experience.map((exp, idx) => (
                                        <div key={exp.id} className="bg-black/20 rounded-xl p-4 space-y-3 border border-white/5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-primary">Experience #{idx + 1}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEnhanceBullets(idx)}
                                                        disabled={enhancingIdx === idx}
                                                        className="flex items-center gap-1 text-xs text-info hover:text-info/80 font-semibold disabled:opacity-50"
                                                    >
                                                        {enhancingIdx === idx ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                                        AI Enhance
                                                    </button>
                                                    <button onClick={() => setResume(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-destructive">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {(["company", "role", "startDate", "endDate"] as const).map(f => (
                                                <div key={f}>
                                                    <label className="text-xs text-muted-foreground mb-1 block capitalize">{f === "startDate" ? "Start Date" : f === "endDate" ? "End Date" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                                    <input
                                                        type="text"
                                                        value={exp[f]}
                                                        onChange={e => {
                                                            const updated = [...resume.experience];
                                                            updated[idx] = { ...updated[idx], [f]: e.target.value };
                                                            setResume(prev => ({ ...prev, experience: updated }));
                                                        }}
                                                        placeholder={f === "startDate" || f === "endDate" ? "e.g. Jan 2023" : ""}
                                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                            ))}
                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Bullet Points</label>
                                                {exp.bullets.map((b, bi) => (
                                                    <div key={bi} className="flex gap-1 mb-1">
                                                        <textarea
                                                            value={b}
                                                            onChange={e => {
                                                                const updated = [...resume.experience];
                                                                const bullets = [...updated[idx].bullets];
                                                                bullets[bi] = e.target.value;
                                                                updated[idx] = { ...updated[idx], bullets };
                                                                setResume(prev => ({ ...prev, experience: updated }));
                                                            }}
                                                            rows={2}
                                                            placeholder="Describe your achievement..."
                                                            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const updated = [...resume.experience];
                                                                updated[idx].bullets = updated[idx].bullets.filter((_, i) => i !== bi);
                                                                setResume(prev => ({ ...prev, experience: updated }));
                                                            }}
                                                            className="text-muted-foreground hover:text-destructive"
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const updated = [...resume.experience];
                                                        updated[idx].bullets = [...updated[idx].bullets, ""];
                                                        setResume(prev => ({ ...prev, experience: updated }));
                                                    }}
                                                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-1"
                                                >
                                                    <Plus size={12} />Add bullet
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* ─ EDUCATION ─ */}
                            {activeSection === "education" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><GraduationCap size={16} className="text-primary" />Education</h3>
                                        <button onClick={addEducation} className="flex items-center gap-1 text-xs text-primary font-semibold"><Plus size={14} />Add</button>
                                    </div>
                                    {resume.education.map((edu, idx) => (
                                        <div key={edu.id} className="bg-black/20 rounded-xl p-4 space-y-3 border border-white/5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-primary">Education #{idx + 1}</span>
                                                <button onClick={() => setResume(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                                            </div>
                                            {(["institution", "degree", "field", "year", "cgpa"] as const).map(f => (
                                                <div key={f}>
                                                    <label className="text-xs text-muted-foreground mb-1 block capitalize">{f === "cgpa" ? "CGPA / Grade" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                                    <input
                                                        type="text"
                                                        value={edu[f]}
                                                        onChange={e => {
                                                            const updated = [...resume.education];
                                                            updated[idx] = { ...updated[idx], [f]: e.target.value };
                                                            setResume(prev => ({ ...prev, education: updated }));
                                                        }}
                                                        placeholder={f === "year" ? "2020-2024" : f === "cgpa" ? "8.5/10" : ""}
                                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    {resume.education.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No education added yet.</p>}
                                </>
                            )}

                            {/* ─ SKILLS ─ */}
                            {activeSection === "skills" && (
                                <>
                                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Code2 size={16} className="text-primary" />Skills</h3>
                                    {([
                                        { cat: "languages" as const, label: "Programming Languages", placeholder: "e.g. Python, TypeScript" },
                                        { cat: "frameworks" as const, label: "Frameworks & Libraries", placeholder: "e.g. React, NestJS" },
                                        { cat: "tools" as const, label: "Tools & Platforms", placeholder: "e.g. Docker, AWS, Git" },
                                        { cat: "soft" as const, label: "Soft Skills", placeholder: "e.g. Leadership, Communication" },
                                    ]).map(({ cat, label, placeholder }) => (
                                        <div key={cat}>
                                            <label className="text-xs text-muted-foreground mb-2 block">{label}</label>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {resume.skills[cat].map((skill, i) => (
                                                    <span key={i} className="flex items-center gap-1 bg-primary/15 text-primary text-xs px-2 py-1 rounded-full">
                                                        {skill}
                                                        <button onClick={() => removeSkillTag(cat, i)}><XCircle size={10} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder={placeholder}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
                                                onKeyDown={e => {
                                                    if (e.key === "Enter" || e.key === ",") {
                                                        e.preventDefault();
                                                        addSkillTag(cat, (e.target as HTMLInputElement).value);
                                                        (e.target as HTMLInputElement).value = "";
                                                    }
                                                }}
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-1">Press Enter or comma to add</p>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* ─ PROJECTS ─ */}
                            {activeSection === "projects" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><FolderOpen size={16} className="text-primary" />Projects</h3>
                                        <button onClick={addProject} className="flex items-center gap-1 text-xs text-primary font-semibold"><Plus size={14} />Add</button>
                                    </div>
                                    {resume.projects.map((proj, idx) => (
                                        <div key={proj.id} className="bg-black/20 rounded-xl p-4 space-y-3 border border-white/5">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-semibold text-primary">Project #{idx + 1}</span>
                                                <button onClick={() => setResume(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                                            </div>
                                            {(["title", "techStack", "description", "link"] as const).map(f => (
                                                <div key={f}>
                                                    <label className="text-xs text-muted-foreground mb-1 block capitalize">{f === "techStack" ? "Tech Stack" : f === "link" ? "Project Link (optional)" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                                    {f === "description" ? (
                                                        <textarea
                                                            value={proj[f]}
                                                            onChange={e => {
                                                                const updated = [...resume.projects];
                                                                updated[idx] = { ...updated[idx], [f]: e.target.value };
                                                                setResume(prev => ({ ...prev, projects: updated }));
                                                            }}
                                                            rows={3}
                                                            placeholder="Describe what this project does and your role..."
                                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={proj[f]}
                                                            onChange={e => {
                                                                const updated = [...resume.projects];
                                                                updated[idx] = { ...updated[idx], [f]: e.target.value };
                                                                setResume(prev => ({ ...prev, projects: updated }));
                                                            }}
                                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    {resume.projects.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No projects added yet.</p>}
                                </>
                            )}

                            {/* ─ CERTIFICATIONS ─ */}
                            {activeSection === "certifications" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Award size={16} className="text-primary" />Certifications</h3>
                                        <button onClick={addCertification} className="flex items-center gap-1 text-xs text-primary font-semibold"><Plus size={14} />Add</button>
                                    </div>
                                    {resume.certifications.map((cert, idx) => (
                                        <div key={cert.id} className="bg-black/20 rounded-xl p-4 space-y-3 border border-white/5">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-semibold text-primary">Cert #{idx + 1}</span>
                                                <button onClick={() => setResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                                            </div>
                                            {(["name", "issuer", "date", "url"] as const).map(f => (
                                                <div key={f}>
                                                    <label className="text-xs text-muted-foreground mb-1 block capitalize">{f === "url" ? "Certificate URL" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                                    <input
                                                        type="text"
                                                        value={cert[f]}
                                                        onChange={e => {
                                                            const updated = [...resume.certifications];
                                                            updated[idx] = { ...updated[idx], [f]: e.target.value };
                                                            setResume(prev => ({ ...prev, certifications: updated }));
                                                        }}
                                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    {resume.certifications.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No certifications added yet.</p>}
                                </>
                            )}

                            {/* ─ ACHIEVEMENTS ─ */}
                            {activeSection === "achievements" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Star size={16} className="text-primary" />Achievements</h3>
                                        <button
                                            onClick={() => setResume(prev => ({ ...prev, achievements: [...prev.achievements, ""] }))}
                                            className="flex items-center gap-1 text-xs text-primary font-semibold"
                                        >
                                            <Plus size={14} />Add
                                        </button>
                                    </div>
                                    {resume.achievements.map((ach, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={ach}
                                                onChange={e => {
                                                    const updated = [...resume.achievements];
                                                    updated[idx] = e.target.value;
                                                    setResume(prev => ({ ...prev, achievements: updated }));
                                                }}
                                                placeholder="e.g. Ranked top 5% in HackerRank..."
                                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
                                            />
                                            <button onClick={() => setResume(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-destructive"><XCircle size={16} /></button>
                                        </div>
                                    ))}
                                    {resume.achievements.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No achievements added yet.</p>}
                                </>
                            )}

                            {/* ─ DESIGN / THEME ─ */}
                            {activeSection === "design" && (
                                <>
                                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Palette size={16} className="text-primary" />Resume Design & Typography</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Professional Font Family</label>
                                            <select
                                                value={resume.theme?.fontFamily || "'Inter', sans-serif"}
                                                onChange={e => setResume(prev => ({ ...prev, theme: { ...prev.theme, fontFamily: e.target.value } as any }))}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                                            >
                                                <option value="'Inter', sans-serif">Inter (Modern Sans)</option>
                                                <option value="'Roboto', sans-serif">Roboto (Clean Sans)</option>
                                                <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica (Classic Sans)</option>
                                                <option value="'Times New Roman', Times, serif">Times New Roman (Formal Serif)</option>
                                                <option value="'Georgia', serif">Georgia (Elegant Serif)</option>
                                                <option value="'Garamond', serif">Garamond (Academic Serif)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block flex justify-between">
                                                <span>Base Font Size</span>
                                                <span className="text-foreground font-semibold">{resume.theme?.fontSize || 14}px</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="18"
                                                step="1"
                                                value={resume.theme?.fontSize || 14}
                                                onChange={e => setResume(prev => ({ ...prev, theme: { ...prev.theme, fontSize: parseInt(e.target.value) } as any }))}
                                                className="w-full accent-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Accent Color</label>
                                            <input
                                                type="color"
                                                value={resume.theme?.color || "#000000"}
                                                onChange={e => setResume(prev => ({ ...prev, theme: { ...prev.theme, color: e.target.value } as any }))}
                                                className="w-full h-10 bg-black/20 border border-white/10 rounded-xl p-1 cursor-pointer"
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-1">Select pitch-black (#000000) for standard ATS.</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-2">
                                        <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                                        <p className="text-xs text-primary-foreground"><strong>Pro Tip:</strong> You can click anywhere on the Live Preview to manually type, edit, or delete any generated text!</p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* ATS Analyzer */}
                    <div className="glass-card rounded-xl p-5 space-y-4 print:hidden">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Target size={16} className="text-primary" />
                                ATS Score Analyzer
                            </h3>
                            <button onClick={() => setShowATS(!showATS)} className="text-muted-foreground">
                                {showATS ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {showATS && (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Job Description (optional — for better accuracy)</label>
                                    <textarea
                                        value={jobDesc}
                                        onChange={e => setJobDesc(e.target.value)}
                                        rows={3}
                                        placeholder="Paste the job description here..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleATS}
                                    disabled={atsLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-info text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                >
                                    {atsLoading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                                    {atsLoading ? "Analyzing..." : "Analyze ATS Score"}
                                </button>

                                {atsResult && !atsLoading && (
                                    <div className="space-y-4">
                                        {/* Score Ring */}
                                        <div className="text-center py-4">
                                            <div className="relative inline-flex items-center justify-center w-28 h-28">
                                                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                                                    <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                                    <circle
                                                        cx="56" cy="56" r="48" fill="none"
                                                        stroke={scoreColor(atsResult.score)}
                                                        strokeWidth="10"
                                                        strokeDasharray={`${2 * Math.PI * 48}`}
                                                        strokeDashoffset={`${2 * Math.PI * 48 * (1 - atsResult.score / 100)}`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute text-center">
                                                    <p className="text-2xl font-bold" style={{ color: scoreColor(atsResult.score) }}>{atsResult.score}</p>
                                                    <p className="text-[10px] text-muted-foreground">/ 100</p>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-bold mt-2 ${verdictColor(atsResult.verdict)}`}>{atsResult.verdict}</p>
                                        </div>

                                        {/* Breakdown */}
                                        <div className="space-y-2">
                                            {Object.entries(atsResult.breakdown).map(([key, val]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-muted-foreground capitalize">{key}</span>
                                                        <span className="text-foreground font-semibold">{val}/25</span>
                                                    </div>
                                                    <div className="w-full bg-white/5 rounded-full h-1.5">
                                                        <div
                                                            className="h-1.5 rounded-full transition-all duration-500"
                                                            style={{ width: `${(val / 25) * 100}%`, backgroundColor: scoreColor((val / 25) * 100) }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Strengths */}
                                        <div>
                                            <p className="text-xs font-semibold text-green-400 flex items-center gap-1 mb-2"><CheckCircle size={12} />Strengths</p>
                                            {atsResult.strengths.map((s, i) => (
                                                <p key={i} className="text-xs text-foreground bg-green-500/10 rounded-lg px-3 py-1.5 mb-1">{s}</p>
                                            ))}
                                        </div>

                                        {/* Improvements */}
                                        <div>
                                            <p className="text-xs font-semibold text-orange-400 flex items-center gap-1 mb-2"><AlertTriangle size={12} />Improvements</p>
                                            {atsResult.improvements.map((s, i) => (
                                                <p key={i} className="text-xs text-foreground bg-orange-500/10 rounded-lg px-3 py-1.5 mb-1">{s}</p>
                                            ))}
                                        </div>

                                        {/* Missing Keywords */}
                                        {atsResult.missingKeywords.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-2"><Key size={12} />Missing Keywords</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {atsResult.missingKeywords.map((kw, i) => (
                                                        <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">{kw}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: LIVE PREVIEW ── */}
                <div className="flex-1 min-w-0" ref={containerRef}>
                    <div className="glass-card rounded-xl p-1 print:p-0 print:shadow-none bg-black/40">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 print:hidden">
                            <p className="text-xs font-semibold text-muted-foreground">LIVE PREVIEW</p>
                            <div className="flex gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white/5 flex justify-center py-6 print:py-0 print:bg-white transition-all rounded-b-xl" style={{ minHeight: `${1122.5 * scale + 48}px` }}>
                            <div
                                className="origin-top transition-transform duration-300 print:!transform-none shadow-2xl print:shadow-none"
                                style={{ transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: `-${1122.5 * (1 - scale)}px` }}
                            >
                                <div className="bg-white min-h-[297mm] w-[210mm] overflow-hidden">
                                    <div
                                        ref={previewRef}
                                        id="resume-preview"
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        className="bg-white p-10 md:p-12 w-full h-full text-black outline-none focus:ring-4 focus:ring-primary/20"
                                        style={{
                                            fontFamily: resume.theme?.fontFamily || "'Inter', sans-serif",
                                            color: resume.theme?.color || "#000000",
                                            fontSize: `${resume.theme?.fontSize || 14}px`,
                                            minHeight: "297mm",
                                            width: "210mm",
                                        }}
                                    >
                                        {/* ─ HEADER: Exact Match to Reference ─ */}
                                        <div className="pb-[0.3em] mb-[0.8em] flex flex-col items-center justify-center text-center w-full relative">
                                            <h1 className="text-[2.2em] leading-[1.1] font-bold uppercase m-0 px-4" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                                                {resume.personalInfo.name || "YOUR NAME"}
                                            </h1>

                                            {(resume.personalInfo.location || resume.personalInfo.targetRole) && (
                                                <div className="flex items-center justify-center gap-2 mt-[0.3em] text-[1em] font-medium opacity-90">
                                                    {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
                                                    {resume.personalInfo.location && resume.personalInfo.targetRole && <span>|</span>}
                                                    {resume.personalInfo.targetRole && <span>{resume.personalInfo.targetRole}</span>}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center justify-center mt-[0.6em] text-[0.9em] font-medium gap-x-[0.8em] gap-y-[0.3em]">
                                                {resume.personalInfo.phone && (
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap"><Phone size={12} className="shrink-0" fill="currentColor" /> +91-{resume.personalInfo.phone.replace('+91', '').replace('-', '').trim()}</span>
                                                )}
                                                {resume.personalInfo.email && (
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap"><Mail size={12} className="shrink-0" /> <span className="underline decoration-[0.5px] underline-offset-2">{resume.personalInfo.email}</span></span>
                                                )}
                                                {resume.personalInfo.linkedin && (
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap"><Linkedin size={12} className="shrink-0" fill="currentColor" /> <span className="underline decoration-[0.5px] underline-offset-2">{resume.personalInfo.linkedin.replace('https://', '').replace('www.', '')}</span></span>
                                                )}
                                                {resume.personalInfo.github && (
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap"><Github size={12} className="shrink-0" fill="currentColor" /> <span className="underline decoration-[0.5px] underline-offset-2">{resume.personalInfo.github.replace('https://', '').replace('www.', '')}</span></span>
                                                )}
                                                {resume.personalInfo.website && (
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap"><Globe size={12} className="shrink-0" /> <span className="underline decoration-[0.5px] underline-offset-2">{resume.personalInfo.website.replace('https://', '').replace('www.', '')}</span></span>
                                                )}
                                            </div>

                                            {/* Full width bottom border for header */}
                                            <div className="absolute -bottom-[0.2em] left-0 right-0 h-[1.5px]" style={{ backgroundColor: resume.theme?.color || "#000000" }} />
                                        </div>

                                        {/* SUMMARY */}
                                        {resume.summary && (
                                            <section className="mb-[0.8em]">
                                                <h2 className="text-[1.1em] font-bold pb-[0.1em] mb-[0.4em] border-b-[1px] capitalize" style={{ borderColor: resume.theme?.color || "#000000", fontFamily: "'Times New Roman', Times, serif" }}>Profile Summary</h2>
                                                <p className="text-[0.92em] leading-[1.5] text-justify">{resume.summary}</p>
                                            </section>
                                        )}

                                        {/* EXPERIENCE */}
                                        {resume.experience.length > 0 && (
                                            <section className="mb-[0.8em]">
                                                <h2 className="text-[1.1em] font-bold pb-[0.1em] mb-[0.4em] border-b-[1px] capitalize" style={{ borderColor: resume.theme?.color || "#000000", fontFamily: "'Times New Roman', Times, serif" }}>Experience</h2>
                                                {resume.experience.map(exp => (
                                                    <div key={exp.id} className="mb-[0.6em]">
                                                        <div className="flex justify-between items-baseline mb-[0.1em]">
                                                            <div className="text-[1em]">
                                                                <span className="font-bold">{exp.role || "Role"}</span>
                                                                <span className="mx-1 font-semibold">–</span>
                                                                <span className="font-semibold italic">{exp.company || "Company Name"}</span>
                                                            </div>
                                                            <p className="text-[0.9em] font-bold whitespace-nowrap">
                                                                {exp.startDate} {exp.startDate && "–"} {exp.current ? "Present" : exp.endDate}
                                                            </p>
                                                        </div>
                                                        <ul className="mt-[0.2em] space-y-[0.15em] pl-4">
                                                            {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                                                <li key={i} className="text-[0.92em] leading-[1.4] text-justify list-disc">
                                                                    <span>{b}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </section>
                                        )}

                                        {/* PROJECTS */}
                                        {resume.projects.length > 0 && (
                                            <section className="mb-[0.8em]">
                                                <h2 className="text-[1.1em] font-bold pb-[0.1em] mb-[0.4em] border-b-[1px] capitalize" style={{ borderColor: resume.theme?.color || "#000000", fontFamily: "'Times New Roman', Times, serif" }}>Selected Projects</h2>
                                                {resume.projects.map(proj => (
                                                    <div key={proj.id} className="mb-[0.6em]">
                                                        <div className="flex items-baseline mb-[0.1em] flex-wrap">
                                                            <span className="text-[1em] font-bold">{proj.title || "Project Title"}</span>
                                                            {proj.techStack && <span className="text-[0.9em] font-medium ml-1">({proj.techStack})</span>}
                                                            {proj.link && (
                                                                <>
                                                                    <span className="mx-1 font-medium">|</span>
                                                                    <a href={proj.link} className="text-[0.85em] text-blue-800 underline break-all">{proj.link}</a>
                                                                </>
                                                            )}
                                                        </div>
                                                        {proj.description && <p className="text-[0.92em] mt-[0.1em] leading-[1.4] text-justify ml-4 relative before:content-['•'] before:absolute before:-left-4">{proj.description}</p>}
                                                    </div>
                                                ))}
                                            </section>
                                        )}

                                        {/* SKILLS */}
                                        {(resume.skills.languages.length > 0 || resume.skills.frameworks.length > 0 || resume.skills.tools.length > 0 || resume.skills.soft.length > 0) && (
                                            <section className="mb-[0.8em]">
                                                <h2 className="text-[1.1em] font-bold pb-[0.1em] mb-[0.4em] border-b-[1px] capitalize" style={{ borderColor: resume.theme?.color || "#000000", fontFamily: "'Times New Roman', Times, serif" }}>Technical Skills</h2>
                                                <div className="space-y-[0.15em] text-[0.92em] leading-[1.5] pl-4">
                                                    {resume.skills.languages.length > 0 && <p><strong className="font-bold">Programming & Data:</strong> {resume.skills.languages.join(", ")}</p>}
                                                    {resume.skills.frameworks.length > 0 && <p><strong className="font-bold">Machine Learning & Frameworks:</strong> {resume.skills.frameworks.join(", ")}</p>}
                                                    {resume.skills.tools.length > 0 && <p><strong className="font-bold">ML Systems & Deployment:</strong> {resume.skills.tools.join(", ")}</p>}
                                                    {resume.skills.soft.length > 0 && <p><strong className="font-bold">Experimentation & Analytics:</strong> {resume.skills.soft.join(", ")}</p>}
                                                </div>
                                            </section>
                                        )}

                                        {/* EDUCATION */}
                                        {resume.education.length > 0 && (
                                            <section className="mb-[0.8em]">
                                                <h2 className="text-[1.1em] font-bold pb-[0.1em] mb-[0.4em] border-b-[1px] capitalize" style={{ borderColor: resume.theme?.color || "#000000", fontFamily: "'Times New Roman', Times, serif" }}>Education</h2>
                                                {resume.education.map(edu => (
                                                    <div key={edu.id} className="flex justify-between mb-[0.3em] items-baseline">
                                                        <div className="text-[0.95em]">
                                                            <span className="font-bold">{edu.institution}</span>
                                                            <span className="mx-1 font-semibold">|</span>
                                                            <span className="font-serif italic">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                                                        </div>
                                                        <span className="text-[0.9em] font-bold whitespace-nowrap">{edu.year}</span>
                                                    </div>
                                                ))}
                                            </section>
                                        )}

                                        {/* CERTIFICATIONS / ACHIEVEMENTS */}
                                        {(resume.certifications.length > 0 || resume.achievements.length > 0) && (
                                            <section className="mb-[0.8em]">
                                                <h2 className="text-[1.1em] font-bold pb-[0.1em] mb-[0.4em] border-b-[1px] capitalize" style={{ borderColor: resume.theme?.color || "#000000", fontFamily: "'Times New Roman', Times, serif" }}>Extracurricular / Certifications</h2>
                                                <ul className="space-y-[0.15em] pl-4">
                                                    {resume.certifications.map(cert => (
                                                        <li key={cert.id} className="text-[0.92em] leading-[1.4] list-disc">
                                                            <span className="font-bold">{cert.issuer || cert.name}:</span> {cert.name} {cert.url && <span className="text-blue-600">— <a href={cert.url} className="hover:underline">View Credentials</a></span>}
                                                        </li>
                                                    ))}
                                                    {resume.achievements.filter(a => a.trim()).map((ach, i) => (
                                                        <li key={`ach-${i}`} className="text-[0.92em] leading-[1.4] list-disc">
                                                            <span>{ach}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        )}

                                        {/* Placeholder when empty */}
                                        {!resume.personalInfo.name && !resume.summary && resume.experience.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-96 opacity-40 select-none" contentEditable={false}>
                                                <FileText size={48} className="mb-4 opacity-30" />
                                                <p className="text-[1em] font-sans font-medium">Fill in the form to see your professional resume</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
