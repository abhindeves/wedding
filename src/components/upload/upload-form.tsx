"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface FileWithPreview extends File {
  preview: string;
}

export default function UploadForm() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(files.filter((file) => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select at least one photo to upload.",
      });
      return;
    }
    setIsUploading(true);

    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would upload files to Firebase Storage here
    // and save metadata to your database.

    setIsUploading(false);
    setFiles([]);
    toast({
      title: "Upload Successful!",
      description: `${files.length} photo(s) have been added to the gallery.`,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors ${
              isDragActive ? "border-primary bg-primary/10" : "border-border"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary font-semibold">Drop the files here ...</p>
            ) : (
              <p className="text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>

          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Selected Photos:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div key={file.name} className="relative group">
                    <Image
                      src={file.preview}
                      alt={file.name}
                      width={150}
                      height={150}
                      onLoad={() => URL.revokeObjectURL(file.preview)}
                      className="rounded-md object-cover w-full aspect-square"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="absolute top-1 right-1 bg-background/70 rounded-full p-1 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isUploading || files.length === 0}>
            {isUploading
              ? "Uploading..."
              : `Upload ${files.length} Photo(s)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
