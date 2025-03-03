import Link from "next/link";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";
import { checkTypeUser } from "@/app/actions";
import { Menu } from "lucide-react";

export async function NavBar() {
  const session = await auth();
  let type: string | null = null; // Default value

  if (session?.user?.id) {
    const userType = await checkTypeUser(session.user.id);
    type = userType?.userType ?? null;
  }

  return (
    <nav className="flex items-center justify-between py-5 px-4 md:px-8 relative">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Naami Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job Germany<span className="text-primary"></span>
        </h1>
      </Link>

      <div className="md:hidden">
        <input type="checkbox" id="menu-toggle" className="hidden peer" />
        <label htmlFor="menu-toggle" className="cursor-pointer p-2">
          <Menu />
        </label>
        <div className="peer-checked:flex hidden flex-col items-center gap-4 bg-white dark:bg-gray-900 p-2 shadow-md absolute left-0 w-full">
          <ThemeToggle />
          {type === "JOB_SEEKER" && (
            <Link className={buttonVariants({ size: "lg" })} href="/my-applied-jobs">
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
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        {type === "JOB_SEEKER" && (
          <Link className={buttonVariants({ size: "lg" })} href="/my-applied-jobs">
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
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
