"use client"
import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";

export function CopyLinkMenuItem({jobUrl}: {jobUrl:string}){

    const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));


    async function handleCopy(){
        try{
            await navigator.clipboard.writeText(jobUrl);
          //  toast.success("URL copied to clipboard");
            toast.promise(promise, {
                loading: 'Loading...',
                success: () => {
                  return `URL copied to clipboard`;
                },
                error: 'Failed to copy URL, Try again',
              });
        }catch(err){
            console.log(err);
        }
    }
    return (
        <DropdownMenuItem onSelect={handleCopy}>
            <Link2 className="size-4" />
            <span>Copy Job URL</span>

        </DropdownMenuItem>
    )
}