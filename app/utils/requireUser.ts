import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";

export async function requireUser(){
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    };

    return session.user;
}