"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CalendarDays, Sun, Moon, Sparkles, GlassWater, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const iconMap: { [key: string]: React.ElementType } = {
  Sun: Sun,
  Moon: Moon,
  Sparkles: Sparkles,
  GlassWater: GlassWater,
};

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/schedule');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-[40vh] bg-gray-300">
        <Image 
          src="https://firebasestorage.googleapis.com/v0/b/lions-74edb.firebasestorage.app/o/photos%2F20240818_115754.jpg?alt=media&token=9f0a72bb-be58-48f3-a0a0-7ebe0cb5a065"
          alt="Wedding banner"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-70"
          data-ai-hint="wedding banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin-login">Admin Login</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <div className="text-foreground">
                <h1 className="font-headline text-5xl md:text-7xl font-bold">Celebrating Us</h1>
                <p className="mt-2 text-lg md:text-xl max-w-2xl">Welcome to our special corner of the internet! We're so excited to share our moments with you.</p>
            </div>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Camera className="h-5 w-5 text-primary" />
                            Share Your Snaps
                        </CardTitle>
                        <CardDescription>
                            Help us capture every moment. Upload your photos from the event!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/upload">
                            <Button className="w-full">Upload Photos</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            Upcoming Events
                        </CardTitle>
                        <CardDescription>
                            Here's what's happening. Join us for the celebrations!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : events.length === 0 ? (
                            <p className="text-muted-foreground">No upcoming events.</p>
                        ) : (
                            <div className="space-y-4">
                                {events.map((event: any) => {
                                    const IconComponent = iconMap[event.icon];
                                    return (
                                        <div key={event._id} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{event.title}</h3>
                                                <p className="text-sm text-muted-foreground">{event.time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-primary/10 border-primary/20 md:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">A Note on Photos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/80">
                        This is a private gallery for our friends and family. Please be respectful of others when sharing and downloading photos. Let's fill this space with love, laughter, and beautiful memories!
                    </p>
                </CardContent>
            </Card>
      </div>
    </div>
  );
}
