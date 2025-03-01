import { Button } from "@/components/ui/button";
import { Building2, UserRound } from "lucide-react";

export type UserSelectionType = "company" | "jobbSeeker";

interface UserTypeSelectionProps {
  onSelect: (type: UserSelectionType) => void;
}

export default function UserTypeForm({ onSelect }: UserTypeSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome! Let&apos;s get started</h2>
        <p className="text-muted-foreground">
          Chose how you would like to use our Platform
        </p>
      </div>
      <div className="grid gap-2">
        <Button
          onClick={() => onSelect("jobbSeeker")}
          variant="outline"
          className="w-full h-auto p-6 mt-1 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Job Seeker</h3>
            <p>Find your dream job opportunity</p>
          </div>
        </Button>
        <Button
          onClick={() => onSelect("company")}
          variant="outline"
          className="w-full h-auto p-6 mt-1 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="size-6 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Company / Organization</h3>
            <p>Post jobs and find exeptional talent</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
