import Link from "next/link";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";
export async function NavBar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Naami Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job Board<span className="text-primary"></span>
        </h1>
      </Link>
      {/*       <div className="flex items-center gap-4">
        <ThemeToggle />
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}>
            <Button>Logout</Button>
          </form>
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}>
            Login
          </Link>
        )}
      </div> */}

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link className={buttonVariants({ size: "lg" })} href="/post-job">
          Post Job
        </Link>
        {session?.user ? (
          <UserDropdown email={session.user.email as string} image={session.user.image as string} name={session.user.name as string} />
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
