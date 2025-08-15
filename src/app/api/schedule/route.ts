
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/lib/models/event';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({});
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const eventData = await request.json();
    const newEvent = new Event(eventData);
    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}
