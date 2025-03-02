"use client";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cityListGermany } from "@/app/utils/citiesList";

const jobTypes = ["full_time", "part_time", "contract", "internship"];

export default function JobFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  // get current filters from the URL
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];

  const currentLocation = searchParams.get("loc") || "";

  function clearAllFilter() {
    router.push("/");
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  function handleJobTypeChange(jobType: string, checked: boolean) {
    const current = new Set(currentJobTypes);

    if (checked) {
      current.add(jobType);
    } else {
      current.delete(jobType);
    }

    const newValue = Array.from(current).join(",");

    router.push(`?${createQueryString("jobTypes", newValue)}`);
  }

  function handleLocationChange(loc: string) {
    router.push(`?${createQueryString("loc", loc)}`);
  }

  return (
    <Card className="col-span-2 md:col-span-1 h-fit">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
        <Button
          onClick={clearAllFilter}
          variant="destructive"
          size="sm"
          className="h-8">
          <span>Clear All</span>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>

      <Separator className="mb-4" />

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Job Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {jobTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(type, checked as boolean)
                  }
                  id={type}
                  checked={currentJobTypes.includes(type)}
                />
                <Label className="text-sm font-medium" htmlFor={type}>
                  {type.replace("_", " ").charAt(0).toUpperCase() +
                    type.replace("_", " ").slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />

        <div>
          <Label className="text-lg font-semibold">Location</Label>
          <Select value={currentLocation} onValueChange={(location) => handleLocationChange(location)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Location</SelectLabel>
                {cityListGermany.map((city) => (
                  <SelectItem key={city.code} value={city.name}>
                    <span className="pl-2">{city.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
