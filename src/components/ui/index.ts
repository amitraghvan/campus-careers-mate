/**
 * Shared UI barrel export.
 * Re-exports the most commonly used shadcn/ui primitives
 * so features can import from "@/components/ui" cleanly.
 */

export { Button, buttonVariants } from "./button";
export { Input } from "./input";
export { Label } from "./label";
export { Textarea } from "./textarea";
export { Badge } from "./badge";
export { Checkbox } from "./checkbox";
export { Separator } from "./separator";
export { Skeleton } from "./skeleton";
export { Progress } from "./progress";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./select";

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./tabs";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

