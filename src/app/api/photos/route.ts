
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Photo from '@/lib/models/photo';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const photoData = await request.json();

    const newPhoto = new Photo(photoData);

    await newPhoto.save();

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error('Failed to save photo metadata:', error);
    return NextResponse.json({ message: 'Failed to save photo metadata' }, { status: 500 });
  }
}
