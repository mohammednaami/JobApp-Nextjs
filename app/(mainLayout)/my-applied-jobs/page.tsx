import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import ApplicantCard from "@/components/job/ApplicantCard";
import { EmptyState } from "@/components/utils/EmptyState";


import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'My Applied Jobs - Job Platform',
  description: "Explore top job listings and unlock your future career today.",
  openGraph: {
    title: 'My Applied Jobs - Platform',
    description: "Explore top job listings and unlock your future career today.",
    url: 'https://jobapp.monaami.com',
    siteName: 'Job Platform',
    images: [
      {
        url: 'https://jobapp.monaami.com/images/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Applied Jobs - Job Platform',
    description: "Explore top job listings and unlock your future career today.",
    images: ['https://jobapp.monaami.com/images/logo.png'],
  },
};
async function getMyApplication(userId: string) {
  return await prisma.applyJobPost.findMany({
    where: {
      JobSeeker: {
        userId: userId,
      },
    },
    select: {
      JobPost: {
        select: {
          id: true,
          jobTitle: true,
          employmentType: true,
          createdAt: true,
          salaryFrom: true,
          salaryTo: true,
          location: true,
          listingDuration: true,
          Company: {
            select: {
              name: true,
              location: true,
              about: true,
              logo: true,
            },
          },
        },
      },
      status: true,
      createdAt: true,
    },
  });
}

export default async function MyApplication() {
  const session = await requireUser();
  const data = await getMyApplication(session?.id as string);
  if (data.length === 0) {
    return (
      <EmptyState
        title="No Job Application found"
        description="You don't apply to any jobs"
        buttonText="Find a job"
        href="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {data.map((application) => (
        <ApplicantCard
          key={application.JobPost.id}
          job={application.JobPost}
          status={application.status}
        />
      ))}
    </div>
  );
}
