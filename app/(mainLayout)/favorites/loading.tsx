import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFavorites(){

    return (
        <div className="flex flex-col gap-6">
        {[...Array(10)].map((item, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-14 w-14 rounded" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-[300px]" />
                <Skeleton className="h-4 w-[200px]" />
                <div className="flex gap-4 mt-4">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
}