"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "@/lib/auth";
import { Skeleton } from "../ui/skeleton";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }

      // Check for admin routes
      if (pathname.startsWith("/admin")) {
        if (!isAdmin()) {
          router.replace("/"); // Redirect non-admins from admin routes
          return;
        }
      }
      setIsAuth(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isChecking) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="w-full p-8 space-y-4">
                <Skeleton className="h-12 w-1/4" />
                <Skeleton className="h-8 w-1/2" />
                <div className="grid grid-cols-3 gap-4 pt-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (isAuth) {
    return <>{children}</>;
  }

  return null;
}
