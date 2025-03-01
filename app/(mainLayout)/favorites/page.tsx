import { prisma } from "@/app/utils/db"
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/utils/EmptyState";
import JobCard from "@/components/job/JobCard";

async function getFavorites(userId: string){
    const data = await prisma.savedJobPost.findMany({
        where: {
            userId: userId
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
                    Company : {
                        select: {
                            name: true,
                            location: true,
                            about: true,
                            logo: true,
                        }
                    }
                }
            }
        }
    });

    return data;
}

export default async function FavoritesPage(){

    const session = await requireUser();
    const data = await getFavorites(session?.id as string);


    if(data.length === 0){
        return (
            <EmptyState title="No Favorites found" description="You don't have any favorites yet." buttonText="Find a job" href="/" />
        )
    }
    return (
        <div className="grid grid-cols-1 mt-5 gap-4">
            {data.map((favorite) =>(
                <JobCard key={favorite.JobPost.id} job={favorite.JobPost} />
            ))}
        </div>
    );
}