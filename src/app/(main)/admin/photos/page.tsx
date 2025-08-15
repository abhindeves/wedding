
"use client";

import { useState, useEffect } from "react";
import PhotoGrid from "@/components/gallery/photo-grid";
import type { Photo } from "@/lib/placeholder-data";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { getGuestName } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminPhotosPage() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = getGuestName() || "anonymous"; // Get the current user's ID

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setPhotos(data);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleLike = async (id: string, userId: string) => {
    try {
      const res = await fetch(`/api/images/${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const updatedPhoto = await res.json();
      setPhotos(photos.map((p) => (p._id === id ? updatedPhoto : p)));
    } catch (error) {
      console.error('Failed to like photo', error);
      toast({
        title: "Error",
        description: "Failed to like photo.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete photo');
      }

      toast({
        title: "Success",
        description: "Photo deleted successfully.",
      });
      setPhotos(photos.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo.",
        variant: "destructive",
      });
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
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center gap-3">
          <ImageIcon className="h-10 w-10 text-primary" />
          Manage Photos
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Admin panel to view and delete any photo.
        </p>
      </div>

      <PhotoGrid photos={photos} onLike={handleLike} onDelete={handleDelete} userId={currentUserId} />
    </div>
  );
}
