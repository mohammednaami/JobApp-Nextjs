import { prisma } from "@/app/utils/db";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/utils/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PenBox, UserRoundSearch, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CopyLinkMenuItem } from "@/components/utils/CopyLink";
import { cn } from "@/lib/utils";


import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'My Jobs - Job Platform',
  description: "Explore top job listings and unlock your future career today.",
  openGraph: {
    title: 'My Jobs - Platform',
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
    title: 'My Jobs - Job Platform',
    description: "Explore top job listings and unlock your future career today.",
    images: ['https://jobapp.monaami.com/images/logo.png'],
  },
};

type JobListing = {
  id: string;
  jobTitle: string;
  status: string;
  createdAt: Date;
  Company: {
    name: string;
    logo: string;
  };
  _count: {
    ApplyJobPost: number;
  };
};

async function getJob(userId: string): Promise<JobListing[]> {
  const data = await prisma.jobPost.findMany({
    where: {
      Company: {
        userId: userId,
      },
    },
    select: {
      id: true,
      jobTitle: true,
      status: true,
      createdAt: true,
      Company: {
        select: {
          name: true,
          logo: true,
        },
      },
      _count: {
        select: {
          ApplyJobPost: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function MyJobsPage() {
  const session = await requireUser();

  const data = await getJob(session.id as string);

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No job posts found"
          description="You don't have any job posts yet."
          buttonText="Create a job post now!"
          href="/post-job"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>My Jobs</CardTitle>
            <CardDescription>
              Manage your job listing and applications here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Image
                        src={listing.Company.logo}
                        alt={listing.Company.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </TableCell>
                    <TableCell>{listing.Company.name}</TableCell>
                    <TableCell>{listing.jobTitle}</TableCell>
                    <TableCell>
                      {listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1).toLowerCase()}
                    </TableCell>
                    <TableCell>
                      <Link className={cn(buttonVariants({ variant: "default" }),"flex flex-wrap items-center gap-2")}  href={`/my-jobs/${listing.id}/candidate`} > 
                      <UserRoundSearch className="size-4" /> 
                       {listing._count.ApplyJobPost}
                       </Link>
                    </TableCell>
                    <TableCell>
                      {formatRelativeTime(listing.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/edit`}>
                              <PenBox />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <CopyLinkMenuItem
                            jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`}
                          />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/my-jobs/${listing.id}/delete`}>
                              <XCircle />
                              Delete Job
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
