import { Footer } from "@/components/general/Footer";
import { NavBar } from "@/components/general/NavBar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
