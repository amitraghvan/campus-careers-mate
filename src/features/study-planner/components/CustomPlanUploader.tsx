import { useState } from "react";
import { Upload, FileText, Check, Loader2 } from "lucide-react";
import { StudyPlan } from "../types";
import { toast } from "sonner";
import { addDays, format, startOfDay } from "date-fns";

interface CustomPlanUploaderProps {
  onPlanParsed: (plan: StudyPlan) => void;
}

export function CustomPlanUploader({ onPlanParsed }: CustomPlanUploaderProps) {
  const [textInput, setTextInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  // Very basic NLP structure to transform a flat list of topics into the StudyPlan schema
  const parseRawTextToPlan = async (text: string) => {
    setIsParsing(true);
    
    try {
      // Small artificial delay for UX
      await new Promise(r => setTimeout(r, 600));

      const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 3 && !l.startsWith('#') && !l.startsWith('//'));

      if (lines.length === 0) {
        throw new Error("No usable topics found. Please paste a valid list.");
      }

      const today = startOfDay(new Date());
      const dailyPlan = [];

      // Group ~3 topics per day
      for (let i = 0; i < lines.length; i += 3) {
        const chunk = lines.slice(i, i + 3);
        const dayNum = Math.floor(i / 3) + 1;
        const currentDate = addDays(today, dayNum - 1);

        dailyPlan.push({
          day: dayNum,
          date: format(currentDate, "MMM do, yyyy"),
          hours: chunk.length, // Rough estimate: 1hr per topic
          topics: chunk.map((title, idx) => ({
            taskId: `custom-day${dayNum}-task${idx}`,
            title: title.replace(/^[-*•\d.)]\s*/, ''), // Strip leading bullets/numbers
            completed: false
          }))
        });
      }

      const customPlan: StudyPlan = {
        dailyPlan,
        weeklyGoals: ["Complete all custom uploaded topics", "Review daily notes"],
        focusAreas: ["Consistency", "Following the custom roadmap"]
      };

      onPlanParsed(customPlan);
      toast.success("Custom plan successfully imported!");
      setTextInput("");

    } catch (error: any) {
      toast.error(error.message || "Failed to parse text.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-border/50 bg-card/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Upload className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold">Import Custom Plan</h2>
          <p className="text-sm text-muted-foreground">Paste your syllabus or topic list below.</p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={`Paste a simple list of topics, one per line:\n\nIntroduction to Python\nVariables and Data Types\nControl Flow (If/Else)\nLoops (For/While)\nFunctions\n...`}
          className="w-full h-48 rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
        />

        <button
          onClick={() => parseRawTextToPlan(textInput)}
          disabled={!textInput.trim() || isParsing}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isParsing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Generate Tracker from Text
            </>
          )}
        </button>

        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-500/80 leading-relaxed">
            <strong>Pro Tip:</strong> We will automatically split your topics into manageable daily chunks (approx. 3 topics per day). Our tracker will treat this just like an AI-generated scheme.
          </div>
        </div>
      </div>
    </div>
  );
}
