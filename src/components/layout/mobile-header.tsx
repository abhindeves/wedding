
"use client";

import { Menu, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b md:hidden bg-card">
      <div className="flex items-center space-x-2">
        <Gem className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-headline font-bold">Forever Captured</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
}
