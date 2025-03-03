import { prisma } from "@/app/utils/db";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { requireUser } from "@/app/utils/requireUser";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/utils/EmptyState";
import { cn } from "@/lib/utils";
import { FileUser } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getCandidate(jobId: string, userId: string) {
  const data = await prisma.applyJobPost.findMany({
    where: {
      jobPostId: jobId,
      JobPost: {
        Company: {
          userId: userId,
        },
      },
    },
    select: {
      JobPost: {
        select: {
          jobTitle:true,
          jobDescription:true,
        }
      },
      JobSeeker: {
        select: {
          id: true,
          name: true,
          resume: true,
          about: true,
        },
      },
      status: true,
      createdAt: true,
    },
  });
  if (!data) {
    return notFound();
  }

  return data;
}

type Props = {
  params: Promise<{ jobId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { jobId } = await params;

  const session = await requireUser();
  const candidate = await getCandidate(jobId, session.id as string);
  if (candidate.length === 0) {
    return {
      title: "Candidate not found | Job Platform",
      description: "Candidate not found",
    };
  }
  return {
    title: `Candidate ${candidate[0].JobPost.jobTitle} | Job Platform`,
    description: `Candidate for ${candidate[0].JobPost.jobTitle} `,
  };
}

export default async function CandidatePage({ params }: Props) {
  const session = await requireUser();
  const { jobId } = await params;
  const candidate = await getCandidate(jobId, session.id as string);

  return (
    <>
      {candidate.length === 0 ? (
        <EmptyState
          title="No Candidate found"
          description="You don't have any Candidate in this job."
          buttonText="Go back to my jobs"
          href="/my-jobs"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Candidate</CardTitle>
            <CardDescription>
              Manage your candidate for your job.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Wrap table in a responsive container */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>About</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Apply at</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidate.map((candidate) => (
                    <TableRow key={candidate.JobSeeker.id}>
                      <TableCell>{candidate.JobSeeker.name}</TableCell>
                      <TableCell>{candidate.JobSeeker.about}</TableCell>
                      <TableCell>
                        <Link
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "flex flex-wrap items-center gap-2"
                          )}
                          href={candidate.JobSeeker.resume}>
                          <FileUser className="size-4" />
                          Resume
                        </Link>
                      </TableCell>
                      <TableCell>{candidate.status}</TableCell>
                      <TableCell>
                        {formatRelativeTime(candidate.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            className={buttonVariants({ variant: "default" })}>
                            ACCEPTED
                          </Button>
                          <Button
                            className={buttonVariants({
                              variant: "destructive",
                            })}>
                            REJECTED
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
