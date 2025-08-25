"use client";

import type { Photo } from "@/lib/placeholder-data";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Download, User, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { isAdmin } from "@/lib/auth";

type PhotoCardProps = {
  photo: Photo;
  onLike: (id: string, userId: string) => void;
  onDelete: (id: string) => void;
  userId: string; // Assuming you pass the current user's ID as a prop
};

export default function PhotoCard({ photo, onLike, onDelete, userId }: PhotoCardProps) {
  const { toast } = useToast();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const isLiked = photo.likedBy.includes(userId);

  const handleLikeClick = async () => {
    onLike(photo._id, userId);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(photo.url)}`);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo_${photo._id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to download image.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = () => {
    onDelete(photo._id);
  };

  return (
    <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-2xl animate-fade-in">
        <CardContent className="p-0">
            <div className="relative aspect-auto">
                <Image
                src={photo.url}
                alt={`Photo by ${photo.uploader}`}
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                data-ai-hint={photo.aiHint}
                />
            </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-3 bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={photo.uploaderAvatar} alt={photo.uploader} />
                    <AvatarFallback>
                        <User className="h-4 w-4"/>
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{photo.uploader}</span>
                    <span className="text-xs">{formatDistanceToNow(photo.uploadedAt, { addSuffix: true })}</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handleLikeClick} className="group">
                    <Heart className={cn(
                        "h-5 w-5 text-muted-foreground transition-all group-hover:text-accent",
                        isLiked && "fill-accent text-accent"
                    )} />
                    <span className="sr-only">Like</span>
                </Button>
                <span className="text-sm text-muted-foreground min-w-[2ch] text-left">{photo.likes}</span>
                {admin && <Button variant="ghost" size="icon" onClick={handleDownload} className="group">
                    <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    <span className="sr-only">Download</span>
                </Button>}
                {(photo.uploader === userId || userId === "Admin") && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="group">
                                <Trash2 className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your photo
                                    from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteClick}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </CardFooter>
    </Card>
  );
}