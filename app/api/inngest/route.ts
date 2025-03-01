import { serve } from "inngest/next";
import { inngest } from "@/app/utils/inngest/client";
import { handleJobExpiration, helloWorld, sendPeriodicJobListings } from "./functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        helloWorld,handleJobExpiration,sendPeriodicJobListings
    ],
});
