
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Photo from '@/lib/models/photo';
import { storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await request.json(); // Assuming you send the user ID in the request body

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const photo = await Photo.findById(id);

    if (!photo) {
      return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }

    console.log('Delete Request:');
    console.log('  Photo ID:', id);
    console.log('  User ID:', userId);
    console.log('  Photo Uploader:', photo.uploader);
    console.log('  Uploader Mismatch:', photo.uploader !== userId);

    if (photo.uploader !== userId && userId !== "Admin") {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Delete from Firebase Storage
    const filePath = photo.url.split('/o/')[1].split('?')[0];
    const fileRef = ref(storage, decodeURIComponent(filePath));
    await deleteObject(fileRef);

    // Delete from MongoDB
    await Photo.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Failed to delete photo:', error);
    return NextResponse.json({ message: 'Failed to delete photo' }, { status: 500 });
  }
}
