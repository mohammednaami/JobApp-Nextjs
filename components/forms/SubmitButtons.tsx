"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneralSubmitButton {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
  icon?: React.ReactNode;
}
export function GeneralSubmitButton({
  text,
  variant,
  className,
  icon,
}: GeneralSubmitButton) {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} className={className} disabled={pending}>
      {icon && <div className="size-4">{icon}</div>}
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Submitting ...</span>
        </>
      ) : (
        <>
          <span>{text}</span>
        </>
      )}
    </Button>
  );
}

export function SaveJobButton({ savedJob }: { savedJob: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Heart className={cn(savedJob ? 'fill-current text-red-500' : '',"size-4 transition-colors")}/>
          {savedJob ? "Saved" : "Save Job"}
        </>
      )}
    </Button>
  );
}
