
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Photo from '@/lib/models/photo';

export async function GET() {
  try {
    await dbConnect();

    const photos = await Photo.find({}).sort({ uploadedAt: -1 });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    return NextResponse.json({ message: 'Failed to fetch photos' }, { status: 500 });
  }
}
