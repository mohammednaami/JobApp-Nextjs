import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import EditJobForm from "@/components/forms/EditJobForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";


type Props = {
  params: Promise<{ jobId: string }>;
};

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


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params;

  const session = await requireUser();
  const data = await getData(jobId, session.id as string);
  return {
    title: `Edit ${data.jobTitle} | Job Platform`,
    description: `Edit for ${data.jobTitle} `,
  };
}

export default async function EditJobPage({ params }: Props) {
  const session = await requireUser();
  const { jobId } = await params;
  const data = await getData(jobId, session.id as string);

  return <EditJobForm jobPost={data} />;
}
