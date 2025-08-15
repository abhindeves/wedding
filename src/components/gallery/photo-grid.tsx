import type { Photo } from "@/lib/placeholder-data";
import PhotoCard from "./photo-card";

type PhotoGridProps = {
  photos: Photo[];
  onLike: (id: string, userId: string) => void;
  onDelete: (id: string) => void;
  userId: string;
};

export default function PhotoGrid({ photos, onLike, onDelete, userId }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <h2 className="text-2xl font-semibold">No Photos Yet</h2>
        <p>Be the first to upload a memory!</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {photos.map((photo, index) => (
        <div key={photo._id} className="break-inside-avoid">
            <PhotoCard photo={photo} onLike={onLike} onDelete={onDelete} userId={userId} />
        </div>
      ))}
    </div>
  );
}
