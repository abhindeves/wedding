"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Home, UploadCloud, X, Loader2, ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getGuestName } from '@/lib/auth';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function PostLoginOptionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [guestName, setGuestName] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setGuestName(getGuestName());
  }, []);

  useEffect(() => {
    if (!cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoElement.srcObject = stream;
        await videoElement.play();
        console.log("Camera stream active and playing.");
      } catch (err) {
        console.error("Error accessing camera: ", err);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to use this feature.",
          variant: "destructive",
        });
        setCameraActive(false);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        console.log("Camera cleaned up on unmount.");
      }
    };
  }, [cameraActive]);

  const startCamera = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        console.log("Canvas dimensions:", canvasRef.current.width, "x", canvasRef.current.height);
        console.log("Video dimensions:", videoRef.current.videoWidth, "x", videoRef.current.videoHeight);
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const imageDataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        console.log("Photo captured. Captured image data URL length:", imageDataUrl.length);
        console.log("Captured image state after setCapturedImage:", imageDataUrl.substring(0, 100) + "...");
        if (!imageDataUrl || imageDataUrl.length < 100) {
          console.error("imageDataUrl is empty or too short after capture.");
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    setUploadProgress(0);
    const uploader = getGuestName() || 'Anonymous';

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const storageRef = ref(storage, `photos/${Date.now()}_${compressedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          toast({
            title: "Upload Failed",
            description: "There was an error uploading your photo. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const photoData = {
              url: downloadURL,
              uploader,
            };

            const apiResponse = await fetch('/api/photos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(photoData),
            });

            if (!apiResponse.ok) {
              throw new Error('Failed to save photo metadata');
            }

            toast({
              title: "Upload Successful",
              description: "Your photo has been uploaded to the gallery.",
            });
            setIsUploading(false);
            setCapturedImage(null);
          });
        }
      );
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleGoToHomepage = () => {
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Welcome, {guestName || 'Guest'}!</CardTitle>
            <CardDescription className="pt-2">What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!cameraActive && !capturedImage && !isUploading && (
              <Button className="w-full py-6 text-lg" onClick={startCamera}>
                <Camera className="mr-2 h-6 w-6" />
                Open Camera & Upload Photo
              </Button>
            )}

            {cameraActive && (
              <div className="space-y-4">
                <video ref={videoRef} className="w-full rounded-lg shadow-md border-4 border-red-500" autoPlay playsInline></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <div className="flex justify-center gap-4">
                  <Button className="py-6 text-lg flex-1" onClick={capturePhoto}>
                    <Camera className="mr-2 h-6 w-6" />
                    Capture Photo
                  </Button>
                  <Button variant="outline" className="py-6 text-lg flex-1" onClick={stopCamera}>
                    <X className="mr-2 h-6 w-6" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {capturedImage && !isUploading && (
              <div className="space-y-4">
                <img src={capturedImage} alt="Captured" className="w-full rounded-lg shadow-md" />
                <div className="flex justify-center gap-4">
                  <Button className="py-6 text-lg flex-1" onClick={handleUpload} disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                    <UploadCloud className="mr-2 h-6 w-6" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" className="py-6 text-lg flex-1" onClick={() => setCapturedImage(null)}>
                    <X className="mr-2 h-6 w-6" />
                    Retake
                  </Button>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2 mt-4">
                <h3 className="text-lg font-semibold">Uploading...</h3>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">{uploadProgress.toFixed(0)}%</p>
              </div>
            )}

            {!cameraActive && !capturedImage && !isUploading && (
              <Button className="w-full py-6 text-lg" onClick={handleGoToHomepage} variant="outline">
                <Home className="mr-2 h-6 w-6" />
                Go to Homepage
              </Button>
            )}
{/* 
            {!cameraActive && !capturedImage && !isUploading && (
              <Button className="w-full py-6 text-lg" onClick={() => router.push('/gallery')} variant="secondary">
                <ImageIcon className="mr-2 h-6 w-6" />
                Go to Gallery
              </Button>
            )} */}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
