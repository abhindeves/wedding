"use client";

import {
  CalendarDays,
  Gem,
  Home,
  Image as ImageIcon,
  LogOut,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { getGuestName, logout, isAdmin } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gallery", label: "Photo Gallery", icon: ImageIcon },
  { href: "/upload", label: "Upload Photos", icon: Upload },
  { href: "/schedule", label: "Event Schedule", icon: CalendarDays },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [guestName, setGuestName] = useState<string | null>(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    setGuestName(getGuestName());
    setUserIsAdmin(isAdmin());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const filteredNavItems = userIsAdmin
    ? [...navItems, { href: "/admin/schedule", label: "Manage Schedule", icon: CalendarDays }, { href: "/admin/photos", label: "Manage Photos", icon: ImageIcon }]
    : navItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r p-4 space-y-4">
      <div className="flex items-center space-x-2 p-2">
        <Gem className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold">Forever Captured</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <Separator className="my-4" />
        <div className="flex items-center p-2 space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{guestName || 'Guest'}</span>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
