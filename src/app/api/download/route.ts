
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch image' }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png');
    headers.set('Content-Disposition', 'attachment; filename="image.png"');

    return new NextResponse(imageBuffer, { headers });
  } catch (error) {
    console.error('Failed to download image:', error);
    return NextResponse.json({ message: 'Failed to download image' }, { status: 500 });
  }
}
