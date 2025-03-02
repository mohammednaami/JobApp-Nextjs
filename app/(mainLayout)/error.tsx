"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
          <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>

          <div className="mt-1 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              Try Again
            </p>
            <Button asChild className="w-full mt-5">
              <Link href="/" onClick={() => reset()}>
                Go back to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
