import { deleteJobPost } from "@/app/actions";
import { requireUser } from "@/app/utils/requireUser";
import { GeneralSubmitButton } from "@/components/forms/SubmitButtons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, TrashIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Delete Job - Job Platform',
  description: "Delete job listings and unlock your future career today.",
};

type Params = Promise<{ jobId: string }>;
export default async function DeleteJob({ params }: { params: Params }) {
  const { jobId } = await params;

  await requireUser();

  return (
    <div>
      <Card className="max-w-lg mx-auto mt-28">
        <CardHeader>
          <CardTitle>Are you absolutely sure ?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permentanly delete your job
            listing and remove all of your data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/my-jobs"
            className={buttonVariants({ variant: "secondary" })}>
            <ArrowLeft /> Cancel
          </Link>

          <form
            action={async () => {
              "use server";
              await deleteJobPost(jobId);
            }}>
            <GeneralSubmitButton
              text="Delete Job"
              variant="destructive"
              icon={<TrashIcon />}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
