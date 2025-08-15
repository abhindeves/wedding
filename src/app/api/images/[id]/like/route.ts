import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Photo from '@/lib/models/photo';
import { storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // Await params
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

    const likedByUser = photo.likedBy.includes(userId);

    let update;
    if (likedByUser) {
      update = { $pull: { likedBy: userId }, $inc: { likes: -1 } };
    } else {
      update = { $addToSet: { likedBy: userId }, $inc: { likes: 1 } };
    }

    const updatedPhoto = await Photo.findByIdAndUpdate(id, update, { new: true });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('Failed to update photo:', error);
    return NextResponse.json({ message: 'Failed to update photo' }, { status: 500 });
  }
}
