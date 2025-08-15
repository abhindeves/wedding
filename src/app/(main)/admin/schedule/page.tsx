
"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Edit, Trash2, CalendarDays } from 'lucide-react';
import { Sun, Moon, Sparkles, GlassWater } from 'lucide-react'; // Import icons

const iconOptions = [
  { value: 'Sun', label: 'Sun', icon: Sun },
  { value: 'Moon', label: 'Moon', icon: Moon },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'GlassWater', label: 'GlassWater', icon: GlassWater },
];

const formSchema = z.object({
  _id: z.string().optional(), // For editing existing events
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  time: z.string().min(2, { message: 'Time must be at least 2 characters.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
  icon: z.string().min(1, { message: 'Please select an icon.' }),
});

export default function AdminSchedulePage() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      time: '',
      location: '',
      description: '',
      icon: '',
    },
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast({
        title: "Error",
        description: "Failed to load events.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingEvent) {
        res = await fetch(`/api/schedule/${values._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
      } else {
        res = await fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
      }

      if (!res.ok) {
        throw new Error('Failed to save event');
      }

      toast({
        title: "Success",
        description: `Event ${editingEvent ? 'updated' : 'created'} successfully.`, 
      });
      form.reset();
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? 'update' : 'create'} event.`, 
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = (event: any) => {
    setEditingEvent(event);
    form.reset(event);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete event');
      }

      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center gap-3 mb-8">
        <CalendarDays className="h-10 w-10 text-primary" />
        Manage Event Schedule
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
          <CardDescription>Use this form to add, update, or delete schedule events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Haldi Ceremony" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Friday, 10:00 AM - 12:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Courtyard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A vibrant and playful ceremony..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {React.createElement(option.icon, { className: "h-4 w-4" })}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
              {editingEvent && (
                <Button type="button" variant="outline" onClick={() => { form.reset(); setEditingEvent(null); }}>
                  Cancel Edit
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <h2 className="font-headline text-3xl md:text-4xl font-bold flex items-center gap-3 mb-6 mt-12">
        <CalendarDays className="h-8 w-8 text-primary" />
        Current Schedule
      </h2>

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events scheduled yet.</p>
        ) : (
          events.map((event: any) => (
            <Card key={event._id} className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.time} - {event.location}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(event)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(event._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
