import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { formatRelativeTime } from "@/app/utils/formatRelativeTime";

interface ApplicantCardProps {
  job: {
    id: string;
    createdAt: Date;
    Company: {
      about: string;
      name: string;
      location: string;
      logo: string;
    };
    jobTitle: string;
    employmentType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
  };
  status: string;
}

export default function ApplicantCard({ job, status }: ApplicantCardProps) {

    type BadgeVariant = "outline" | "destructive" | "default" | "secondary";

    let variantStatus: BadgeVariant;
  
    if (status === "PENDING") {
      variantStatus = "outline";
    } else if (status === "REJECTED") {
      variantStatus = "destructive";
    } else if (status === "ACCEPTED") {
      variantStatus = "default";
    } else {
      variantStatus = "default";
    }

  return (
    <Link href={`/job/${job.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary p-2">
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Company Logo */}
            <div className="flex justify-center md:justify-start">
              <Image
                src={job.Company.logo}
                alt={job.Company.name}
                width={52}
                height={52}
                className="w-12 h-12 rounded-lg"
              />
            </div>

            {/* Job Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center md:text-left">
                {job.jobTitle}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <p className="text-sm text-muted-foreground">
                  {job.Company.name}
                </p>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <Badge className="rounded-full" variant="secondary">
                  {job.employmentType
                    .replace("_", " ")
                    .charAt(0)
                    .toUpperCase() +
                    job.employmentType.replace("_", " ").slice(1)}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <Badge className="rounded-full">{job.location}</Badge>
                <span className="hidden md:inline text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(job.salaryFrom)} - {formatCurrency(job.salaryTo)}
                </p>
              </div>
            </div>

            {/* Job Location, Time & Application Status */}
            <div className="md:ml-auto text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <MapPin className="size-4" />
                <h1 className="text-sm md:text-base">{job.location}</h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground md:text-right">
                {formatRelativeTime(job.createdAt)}
              </p>
              {/* Application Status Badge */}
              <Badge variant={variantStatus} className="text-md mt-2">
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
