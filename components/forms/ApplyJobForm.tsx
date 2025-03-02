"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { ApplyJobSeeker } from "@/app/actions";
import { toast } from "sonner";

interface iAppProps {
  jobId: string;
}

export interface ApplyFormValues {
  jobId: string;
}

export default function ApplyJobForm({ jobId }: iAppProps) {
  const { register, handleSubmit } = useForm<ApplyFormValues>({
    defaultValues: { jobId },
  });

  const [pending, setPending] = useState(false);

  const onSubmit: SubmitHandler<ApplyFormValues> = async (data) => {
    setPending(true);
    try {
      const result = await ApplyJobSeeker(data as ApplyFormValues);

      if (result.success) {
        toast.success(result.message || "Applied successfully!");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred." + error);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("jobId")} value={jobId} />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Applying..." : "Apply now"}
      </Button>
    </form>
  );
}
