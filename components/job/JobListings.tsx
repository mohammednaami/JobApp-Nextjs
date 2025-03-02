import { prisma } from "@/app/utils/db";
import { EmptyState } from "@/components/utils/EmptyState";
import JobCard from "@/components/job/JobCard";
import { PaginationComponent } from "@/components/general/MainPagination";
import { JobPostStatus } from "@prisma/client";

async function getData({
  page = 1,
  pageSize = 10,
  jobTypes = [],
  location = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
}) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const skip = (page - 1) * pageSize;

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && { employmentType: { in: jobTypes } }),
    ...(location && location !== "worldwide" && {
      location: location,
    })

  };

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      where: where,
      take: pageSize,
      skip: skip,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.jobPost.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  return { jobs: data, totalPages: Math.ceil(totalCount / pageSize) };
}
export default async function JobListings({
  currentPage,
  jobTypes,
  location
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) {
  const { jobs, totalPages } = await getData({
    page: currentPage,
    pageSize: 10,
    jobTypes,
    location
  });

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Jobs Found"
          description="Try Searching for a different job title or location"
          buttonText="Clear all filters"
          href="/"
        />
      )}

      <div className="flex justify-center mt-6">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}
