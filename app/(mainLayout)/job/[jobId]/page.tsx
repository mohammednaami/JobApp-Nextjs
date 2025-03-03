import { prisma } from "@/app/utils/db";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtlml } from "@/components/utils/JsonToHtml";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import arcjet, { detectBot } from "@/app/utils/arcjet";
import { request } from "@arcjet/next";
import { auth } from "@/app/utils/auth";
import Link from "next/link";
import { SaveJobButton } from "@/components/forms/SubmitButtons";
import { savedJobPost, unSavedJobPost } from "@/app/actions";
import ApplyJobForm from "@/components/forms/ApplyJobForm";
import { Metadata } from "next";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

type Props = {
  params: Promise<{ jobId: string }>;
};

async function getJob(jobId: string, userId?: string) {
  const [jobData, savedJob] = await Promise.all([
    await prisma.jobPost.findUnique({
      where: {
        status: "ACTIVE",
        id: jobId,
      },
      select: {
        id: true,
        jobTitle: true,
        jobDescription: true,
        benefits: true,
        employmentType: true,
        createdAt: true,
        salaryFrom: true,
        location: true,
        listingDuration: true,
        salaryTo: true,
        Company: {
          select: {
            name: true,
            location: true,
            about: true,
            logo: true,
          },
        },
      },
    }),

    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobPostId: {
              userId: userId,
              jobPostId: jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);

  if (!jobData) {
    notFound();
  }

  return { jobData, savedJob };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const { jobId } = await params;
  const { jobData } = await getJob(jobId);
  if (!jobData) {
    return {};
  }

  return {
    title: `${jobData.jobTitle} | Job Platform`,
    description: `Apply for ${jobData.jobTitle} and unlock your career opportunity on Job Platform.`,
    openGraph: {
      title: `${jobData.jobTitle} | Job Platform`,
      description: `Apply for ${jobData.jobTitle} and unlock your career opportunity on Job Platform.`,
      url: `https://jobapp.monaami.com/job/${jobData.id}`,
      siteName: "Job Platform",
      images: [{ url: jobData.Company.logo }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${jobData.jobTitle} | Job Platform`,
      description: `Apply for ${jobData.jobTitle} and unlock your career opportunity on Job Platform.`,
      images: [jobData.Company.logo],
    },
  };

}

export default async function JobIdPage({ params }: Props) {
  const { jobId } = await params;

  const session = await auth();

  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbiden");
  }

  const { jobData: data, savedJob } = await getJob(jobId, session?.user?.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{data.jobTitle}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <p className="font-medium text-muted-foreground">
                {data.Company?.name}
              </p>
              <Badge className="rounded-full" variant="secondary">
                {data.employmentType.replace("_", " ").charAt(0).toUpperCase() +
                  data.employmentType.replace("_", " ").slice(1)}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full" variant="default">
                {data.location}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
            </div>
          </div>

          {session?.user ? (
            <form
              action={
                savedJob
                  ? unSavedJobPost.bind(null, savedJob.id)
                  : savedJobPost.bind(null, jobId)
              }
              className="mt-2 sm:mt-0">
              <SaveJobButton savedJob={!!savedJob} />
            </form>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-2 sm:mt-0"
              )}>
              <Heart className="size-4 " /> Save Job
            </Link>
          )}
        </div>
        <section>
          <JsonToHtlml json={JSON.parse(data.jobDescription)} />
        </section>

        <section>
          <h3 className="font-semibold mb-4">
            Benefits{" "}
            <span className="text-sm text-muted-foreground">
              (Blue is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  className={cn(
                    isOffered ? "" : "opacity-75 cursor-not-allowed",
                    "text-sm px-4 py-1.5 rounded-full"
                  )}
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}>
                  <span className="flex items-center gap-2">
                    {benefit.icon} {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>
      <div className="flex flex-col space-y-6 lg:col-span-1 w-full">
        <Card className="p-6 w-full">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Apply Now</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please let {data.Company.name} know you found this job on
                JobApp. This helps us grow
              </p>
            </div>
            <ApplyJobForm jobId={jobId} />
          </div>
        </Card>
        <Card className="p-6 w-full">
          <h3 className="font-semibold">About the job</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>
              <span className="text-sm">
                {new Date(
                  data.createdAt.getTime() +
                    data.listingDuration * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span className="text-sm">
                {formatRelativeTime(data.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Employment Type
              </span>
              <span className="text-sm">
                {data.employmentType.replace("_", " ").charAt(0).toUpperCase() +
                  data.employmentType.replace("_", " ").slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">{data.location}</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 w-full">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={data.Company.logo}
                alt={data.Company.name}
                width={48}
                height={48}
                className="rounded-full size-12"
              />

              <div className="flex flex-col">
                <h3 className="text-semibold">{data.Company.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {data.Company.about}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
