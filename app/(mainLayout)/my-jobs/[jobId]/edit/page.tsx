import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import EditJobForm from "@/components/forms/EditJobForm";
import { notFound } from "next/navigation";

async function getData(jobId: string, userId: string) {
  const data = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
      Company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      jobDescription: true,
      benefits: true,
      employmentType: true,
      salaryFrom: true,
      location: true,
      listingDuration: true,
      salaryTo: true,
      Company: {
        select: {
          name: true,
          location: true,
          website: true,
          xAccount: true,
          about: true,
          logo: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ jobId: string }>;

export default async function EditJobPage({ params }: { params: Params }) {
  const session = await requireUser();
  const { jobId } = await params;
  const data = await getData(jobId, session.id as string);

  return <EditJobForm jobPost={data} />;
}
