import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/images/logo.png";
import LoginForm from "@/components/forms/LoginForm";

import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Login - Job Platform',
  description: "Explore top job listings and unlock your future career today.",
  openGraph: {
    title: 'Login - Platform',
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
    title: 'Login - Job Platform',
    description: "Explore top job listings and unlock your future career today.",
    images: ['https://jobapp.monaami.com/images/logo.png'],
  },
};


export default async function Login(){
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center">
                <Image src={Logo} alt="Logo" className="size-10" />
                <h1 className="text-2xl font-bold">Job Germany<span className="text-primary"></span></h1>
                </Link>
                <LoginForm />
        </div>
    </div>
    )
}