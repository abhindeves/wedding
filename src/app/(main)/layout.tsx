"use client";

import AuthGuard from "@/components/layout/auth-guard";
import AppSidebar from "@/components/layout/app-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <AppSidebar />
        </div>

        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

          {/* Mobile Sidebar (Overlay) */}
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsMobileSidebarOpen(false)}
              ></div>
              <div className="relative w-64 h-full bg-card shadow-lg">
                <AppSidebar onClose={() => setIsMobileSidebarOpen(false)} />
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
