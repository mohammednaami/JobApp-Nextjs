import JobFilter from "@/components/job/JobFilters";
import JobListings from "@/components/job/JobListings";
import { JobListingLoading } from "@/components/job/JobListingsLoading";
import { Suspense } from "react";
import { Metadata } from 'next';

type SearchParams = {
  searchParams: Promise<{ page?: string; jobTypes?: string; loc?: string }>;
};

export const metadata: Metadata = {
  title: 'Job Platform',
  description: "Explore top job listings and unlock your future career today.",
  openGraph: {
    title: 'Job Platform',
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
    title: 'Job Platform',
    description: "Explore top job listings and unlock your future career today.",
    images: ['https://jobapp.monaami.com/images/logo.png'],
  },
};



export default async function Home({ searchParams }: SearchParams) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;

  const jobTypes = params.jobTypes?.split(",") || [];

  const location = params.loc || "";


  const filterKey = `page=${currentPage};jobTypes=${jobTypes.join(",")};loc=${location}`;


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
      <JobFilter />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading />} key={filterKey}>
          <JobListings currentPage={currentPage} jobTypes={jobTypes} location={location} />
        </Suspense>
      </div>
    </div>
  );
}
