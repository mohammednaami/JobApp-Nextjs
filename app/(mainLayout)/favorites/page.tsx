import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/utils/EmptyState";
import JobCard from "@/components/job/JobCard";
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Favorites - Job Platform',
  description: "Explore top job listings and unlock your future career today.",
  openGraph: {
    title: 'Favorites - Platform',
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
    title: 'Favorites - Job Platform',
    description: "Explore top job listings and unlock your future career today.",
    images: ['https://jobapp.monaami.com/images/logo.png'],
  },
};

type Favorite = {
    JobPost: {
      id: string;
      jobTitle: string;
      employmentType: string;
      createdAt: Date;
      salaryFrom: number;
      location: string;
      listingDuration: number;
      salaryTo: number;
      Company: {
        name: string;
        location: string;
        about: string;
        logo: string;
      };
    };
  };
  
  async function getFavorites(userId: string): Promise<Favorite[]> {
    return prisma.savedJobPost.findMany({
      where: {
        userId: userId,
      },
      select: {
        JobPost: {
          select: {
            id: true,
            jobTitle: true,
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
        },
      },
    });
  }
  

  export default async function FavoritesPage() {
    const session = await requireUser();
    const data = await getFavorites(session?.id as string);
  
    if (data.length === 0) {
      return (
        <EmptyState
          title="No Favorites found"
          description="You don't have any favorites yet."
          buttonText="Find a job"
          href="/"
        />
      );
    }
  
    return (
      <div className="grid grid-cols-1 mt-5 gap-4">
        {data.map((favorite: Favorite) => (
          <JobCard key={favorite.JobPost.id} job={favorite.JobPost} />
        ))}
      </div>
    );
  }
  
