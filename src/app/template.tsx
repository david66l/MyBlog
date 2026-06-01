"use client";

import { usePathname } from "next/navigation";
import { PageFadeIn } from "@/components/page-fade-in";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return children;
  }

  return <PageFadeIn className="flex min-h-full flex-1 flex-col">{children}</PageFadeIn>;
}
