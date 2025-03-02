import Link from "next/link";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";
import { checkTypeUser } from "@/app/actions";
export async function NavBar() {
  const session = await auth();
  let type: string | null = null; // Default value

  if (session?.user?.id) {
    const userType = await checkTypeUser(session.user.id);
    type = userType?.userType ?? null;
  }

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Naami Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job Board<span className="text-primary"></span>
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        {type === "JOB_SEEKER" && (
          <Link
            className={buttonVariants({ size: "lg" })}
            href="/my-applied-jobs">
            My Applied Jobs
          </Link>
        )}

        {type === "COMPANY" && (
          <Link className={buttonVariants({ size: "lg" })} href="/post-job">
            Post Job
          </Link>
        )}

        {type === null && (
          <Link className={buttonVariants({ size: "lg" })} href="/onboarding">
            Get started
          </Link>
        )}

        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            image={session.user.image as string}
            name={session.user.name as string}
          />
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
