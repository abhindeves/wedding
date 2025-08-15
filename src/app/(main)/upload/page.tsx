"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from "@/lib/utils";
import { getGuestName } from '@/lib/auth';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';




const formSchema = z.object({
  file: z.array(z.instanceof(File)).min(1, { message: "Please select at least one photo." }).max(30, { message: "You can upload up to 30 photos at a time." }),
});

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  });

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    setUploadProgress({});
    const uploader = getGuestName() || 'Anonymous';
    let allUploadsSuccessful = true;

    for (const file of values.file) {
      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // (max file size in MB)
          maxWidthOrHeight: 1920, // (max width or height in pixels)
          useWebWorker: true,
        });

        const storageRef = ref(storage, `photos/${Date.now()}_${compressedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            },
            (error) => {
              console.error('Upload failed for', file.name, error);
              toast({
                title: "Upload Failed",
                description: `Failed to upload ${file.name}. Please try again.`, 
                variant: "destructive",
              });
              allUploadsSuccessful = false;
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                const photoData = {
                  url: downloadURL,
                  uploader,
                };

                const response = await fetch('/api/photos', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(photoData),
                });

                if (!response.ok) {
                  throw new Error('Failed to save photo metadata for ' + file.name);
                }
                resolve();
              }).catch((error) => {
                console.error('Failed to get download URL or save metadata for', file.name, error);
                toast({
                  title: "Upload Failed",
                  description: `Failed to process ${file.name}.`, 
                  variant: "destructive",
                });
                allUploadsSuccessful = false;
                reject(error);
              });
            }
          );
        });
      } catch (error) {
        allUploadsSuccessful = false;
      }
    }

    setIsUploading(false);
    if (allUploadsSuccessful) {
      toast({
        title: "Upload Successful",
        description: "All selected photos have been uploaded and are now in the gallery.",
      });
      router.push('/gallery');
    } else {
        toast({
            title: "Uploads Completed with Errors",
            description: "Some photos could not be uploaded. Please check the console for details.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold flex items-center gap-3">
          <UploadCloud className="h-10 w-10 text-primary" />
          Upload Your Photos
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Share your favorite moments from our special day.
        </p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DropzoneField form={form} />
              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>

              {isUploading && Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-semibold">Upload Progress:</h3>
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-32 truncate">{fileName}</span>
                      <Progress value={progress} className="flex-1" />
                      <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

interface DropzoneFieldProps {
  form: any; // Adjust type as needed
}

const DropzoneField: React.FC<DropzoneFieldProps> = ({ form }) => {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      form.setValue('file', acceptedFiles);
      form.clearErrors('file');
    },
  });

  const files = form.watch('file');

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file: File) => file !== fileToRemove);
    form.setValue('file', updatedFiles);
  };

  return (
    <FormItem>
      {/* <FormLabel className="text-lg font-semibold">Upload Your Photos</FormLabel> */}
      <FormControl>
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out",
            "bg-gradient-to-br from-background to-muted/20 hover:from-muted/30 hover:to-muted/40",
            isDragActive && "border-primary scale-[1.02]",
            isDragAccept && "border-green-500 bg-green-50",
            isDragReject && "border-red-500 bg-red-50"
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-16 w-16 text-primary mb-4 animate-bounce-slow" />
          {isDragActive ? (
            isDragAccept ? (
              <p className="text-lg text-green-600 font-medium">Drop your images here!</p>
            ) : (
              <p className="text-lg text-red-600 font-medium">Some files will be rejected.</p>
            )
          ) : (
            <p className="text-lg text-muted-foreground text-center">
              Drag 'n' drop up to 30 photos here, or <span className="text-primary font-medium">click to select files</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">Accepted: JPG, PNG, GIF | Max size: 1MB per photo</p>
        </div>
      </FormControl>
      <FormMessage />

      {files && files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Selected Photos ({files.length}):</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file: File, index: number) => (
              <li key={file.name + index} className="relative group aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 ease-in-out">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Remove photo</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </FormItem>
  );
};