"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Sun, Moon, Sparkles, GlassWater } from "lucide-react";
import { Separator } from "@/components/ui/separator";


import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const iconMap: { [key: string]: React.ElementType } = {
  Sun: Sun,
  Moon: Moon,
  Sparkles: Sparkles,
  GlassWater: GlassWater,
};

export default function SchedulePage() {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
        <div className="mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center gap-3">
                <CalendarDays className="h-10 w-10 text-primary" />
                Event Schedule
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Here’s what we have planned. We can't wait to celebrate with you!
            </p>
        </div>

        <div className="relative">
             <div className="absolute left-6 md:left-8 top-8 bottom-8 w-0.5 bg-border -z-10" />

            <div className="space-y-12">
            {events.length === 0 ? (
                <p className="text-muted-foreground">No events scheduled yet.</p>
            ) : (
                events.map((event: any) => {
                    const IconComponent = iconMap[event.icon];
                    return (
                        <div key={event._id} className="relative flex items-start gap-6 md:gap-8">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-12 w-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                                    {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                                </div>
                            </div>
                            <div className="flex-1 pt-1">
                                <h2 className="font-headline text-2xl font-bold">{event.title}</h2>
                                <p className="font-semibold text-primary">{event.time} - {event.location}</p>
                                <p className="text-muted-foreground mt-1">{event.description}</p>
                            </div>
                        </div>
                    );
                })
            )}
            </div>
        </div>
    </div>
  );
}
