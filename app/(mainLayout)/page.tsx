import JobFilter from "@/components/job/JobFilters";
import JobListings from "@/components/job/JobListings";
import { JobListingLoading } from "@/components/job/JobListingsLoading";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{ page?: string; jobTypes?: string; loc?: string }>;
};

export default async function Home({ searchParams }: SearchParams) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;

  const jobTypes = params.jobTypes?.split(",") || [];

  const location = params.loc || "";


  const filterKey = `page=${currentPage};jobTypes=${jobTypes.join(",")};loc=${location}`;


  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilter />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading />} key={filterKey}>
          <JobListings currentPage={currentPage} jobTypes={jobTypes} location={location} />
        </Suspense>
      </div>
    </div>
  );
}
