import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { PlannerInput } from "../types";

const formSchema = z.object({
  goal: z.string().min(3, "Goal must be at least 3 characters"),
  subjects: z.string().min(1, "Please enter at least one subject (comma separated)"),
  examDate: z.string().min(1, "Please enter an exam date"),
  dailyHours: z.number().min(1, "Must be at least 1 hour").max(12, "Maximum 12 hours allowed for health"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

type FormData = z.infer<typeof formSchema>;

interface PlannerFormProps {
  onSubmit: (data: PlannerInput) => void;
  isLoading: boolean;
  initialData?: PlannerInput | null;
}

export function PlannerForm({ onSubmit, isLoading, initialData }: PlannerFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "",
      subjects: "",
      examDate: "",
      dailyHours: 2,
      level: "beginner",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        subjects: initialData.subjects.join(", "),
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: FormData) => {
    const input: PlannerInput = {
      goal: values.goal,
      examDate: values.examDate,
      dailyHours: values.dailyHours,
      level: values.level,
      subjects: values.subjects.split(",").map(s => s.trim()).filter(Boolean),
    };
    onSubmit(input);
  };

  return (
    <div className="glass-card p-6 rounded-xl border border-border/50 bg-card/50">
      <h2 className="text-xl font-display font-bold mb-4">Study Requirements</h2>
      <p className="text-sm text-muted-foreground mb-6">Tell the AI what you're aiming for.</p>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Primary Goal</label>
          <input
            {...form.register("goal")}
            placeholder="e.g., Crack Google Interviews, Pass AWS Cert"
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isLoading}
          />
          {form.formState.errors.goal && (
            <p className="text-sm text-red-500">{form.formState.errors.goal.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subjects (comma separated)</label>
          <input
            {...form.register("subjects")}
            placeholder="Data Structures, System Design, React"
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isLoading}
          />
          {form.formState.errors.subjects && (
            <p className="text-sm text-red-500">{form.formState.errors.subjects.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Exam/Goal Date</label>
            <input
              type="date"
              {...form.register("examDate")}
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              disabled={isLoading}
            />
            {form.formState.errors.examDate && (
              <p className="text-sm text-red-500">{form.formState.errors.examDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Daily Hours</label>
            <input
              type="number"
              {...form.register("dailyHours", { valueAsNumber: true })}
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              disabled={isLoading}
            />
            {form.formState.errors.dailyHours && (
              <p className="text-sm text-red-500">{form.formState.errors.dailyHours.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Current Level</label>
          <select
            {...form.register("level")}
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isLoading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Physics-defying Plan...
            </>
          ) : (
            "Generate Magic Plan"
          )}
        </button>
      </form>
    </div>
  );
}
