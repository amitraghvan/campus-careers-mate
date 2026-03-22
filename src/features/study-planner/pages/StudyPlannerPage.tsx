import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PlannerForm } from "../components/PlannerForm";
import { CustomPlanUploader } from "../components/CustomPlanUploader";
import { PlanTracker } from "../components/PlanTracker";
import { studyPlannerService } from "@/services/study-planner.service";
import { PlannerInput, StudyPlan } from "../types";
import { BookOpen, Sparkles, Upload as UploadIcon, Trash2, RefreshCcw } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore";

export default function StudyPlannerPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastInput, setLastInput] = useState<PlannerInput | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'custom'>('ai');

  const { activePlan, setPlan, clearPlan, addCustomPlan } = useStudyStore();

  const handleGenerate = async (input: PlannerInput) => {
    setIsGenerating(true);
    setLastInput(input);
    try {
      const generatedPlan = await studyPlannerService.generateStudyPlan(input);
      setPlan(generatedPlan);
      toast.success("Study plan successfully crafted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomPlan = (plan: StudyPlan) => {
    setPlan(plan);
    addCustomPlan(plan);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-orange-500" />
          AI Study Planner
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate an optimized, deterministic study schedule to hit your goals.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6 lg:items-start">
        {/* Left Side: Input Form or Controls */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 lg:sticky lg:top-24 space-y-4"
        >
          {!activePlan ? (
            <>
              {/* Tabs */}
              <div className="flex p-1 space-x-1 bg-secondary/50 rounded-xl">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'ai' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-background/50'
                  }`}
                >
                  <Sparkles className="h-4 w-4" /> AI Magic
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'custom' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-background/50'
                  }`}
                >
                  <UploadIcon className="h-4 w-4" /> Upload Custom
                </button>
              </div>

              {activeTab === 'ai' ? (
                <PlannerForm 
                  onSubmit={handleGenerate} 
                  isLoading={isGenerating} 
                  initialData={lastInput}
                />
              ) : (
                <CustomPlanUploader onPlanParsed={handleCustomPlan} />
              )}
            </>
          ) : (
            // Active Plan Controls
            <div className="glass-card p-6 rounded-xl border border-border/50 bg-card/50 space-y-4">
              <h3 className="font-semibold text-foreground">Plan Controls</h3>
              <p className="text-sm text-muted-foreground">You currently have an active study tracker running.</p>
              
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => clearPlan()}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Drop Current Plan
                </button>
                
                {lastInput && (
                  <button
                    onClick={() => {
                      clearPlan();
                      handleGenerate(lastInput);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" /> Reroll AI Generation
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Side: Result or Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-8"
        >
          <AnimatePresence mode="wait">
            {!activePlan && !isGenerating && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 rounded-xl border border-border/50 text-center border-dashed bg-card/10 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="h-16 w-16 mb-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-orange-500 opacity-60" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mb-2">Ready to Map Your Future?</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Fill out your study requirements on the left, and our intelligent system will map out a day-to-day schedule precisely tailored to your timeline.
                </p>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 rounded-xl border border-border/50 text-center bg-card/10 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="h-16 w-16 mb-6 rounded-full bg-orange-500/20 flex items-center justify-center animate-pulse">
                  <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Synthesizing optimal curriculum...</h3>
                <p className="text-muted-foreground text-sm">Analyzing subjects, weighing difficulty, placing milestones.</p>
              </motion.div>
            )}

            {activePlan && !isGenerating && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <PlanTracker />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
