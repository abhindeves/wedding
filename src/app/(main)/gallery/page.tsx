
"use client";

import { useState, useMemo, useEffect } from "react";
import PhotoGrid from "@/components/gallery/photo-grid";
import type { Photo } from "@/lib/placeholder-data";
import { Image as ImageIcon, User, Filter, X, ArrowUpDown, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getGuestName } from "@/lib/auth";

type SortOrder = "newest" | "oldest";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUploader, setSelectedUploader] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const currentUserId = getGuestName() || "anonymous"; // Get the current user's ID

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        setPhotos(data);
      } catch (error) {
        console.error('Failed to fetch photos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const uniqueUploaders = useMemo(() => {
    const uploaderSet = new Set(photos.map((p) => p.uploader));
    return Array.from(uploaderSet);
  }, [photos]);

  const filteredAndSortedPhotos = useMemo(() => {
    let processedPhotos = [...photos];

    if (selectedUploader) {
      processedPhotos = processedPhotos.filter(
        (photo) => photo.uploader === selectedUploader
      );
    }

    processedPhotos.sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return processedPhotos;
  }, [photos, selectedUploader, sortOrder]);

  const clearFilters = () => {
    setSelectedUploader(null);
  };

  const areFiltersActive = !!selectedUploader;

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

      setPhotos(photos.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Failed to delete photo', error);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="loader"></div>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center gap-3">
          <ImageIcon className="h-10 w-10 text-primary" />
          Photo Gallery
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          All the beautiful moments captured by our beloved guests.
        </p>
      </div>

      <div className="mb-8 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter & Sort
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Sort by Date</DropdownMenuLabel>
              <DropdownMenuGroup>
                <div className="px-2 py-1">
                    <Select
                        onValueChange={(value: SortOrder) => setSortOrder(value)}
                        value={sortOrder}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Uploader</DropdownMenuLabel>
              <DropdownMenuGroup>
                 <div className="px-2 py-1">
                    <Select
                        onValueChange={(value) => setSelectedUploader(value === "all" ? null : value)}
                        value={selectedUploader || "all"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Uploaders" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Uploaders</SelectItem>
                        {uniqueUploaders.map((uploader) => (
                            <SelectItem key={uploader} value={uploader}>
                            {uploader}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                 </div>
                {areFiltersActive && (
                    <DropdownMenuItem onClick={clearFilters} className="text-red-500 focus:bg-red-50 focus:text-red-600">
                        <X className="mr-2 h-4 w-4" />
                        Clear Filter
                    </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      <PhotoGrid key={filteredAndSortedPhotos.length} photos={filteredAndSortedPhotos} onLike={handleLike} onDelete={handleDelete} userId={currentUserId} />
    </div>
  );
}
