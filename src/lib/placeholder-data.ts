export type Photo = {
  _id: string;
  url: string;
  uploader: string;
  uploaderAvatar?: string;
  likes: number;
  likedBy: string[];
  uploadedAt: Date;
  eventTag?: 'Haldi' | 'Mehendi' | 'Wedding' | 'Reception';
  aiHint?: string;
};

export const photos: Photo[] = [
  { _id: '1', url: 'https://placehold.co/600x800.png', uploader: 'Aunt Carol', uploaderAvatar: 'https://placehold.co/100x100.png', likes: 15, likedBy: [], uploadedAt: new Date('2024-07-20T10:00:00Z'), eventTag: 'Wedding', aiHint: 'wedding couple' },
  { _id: '2', url: 'https://placehold.co/800x600.png', uploader: 'Cousin Mike', likes: 25, likedBy: [], uploadedAt: new Date('2024-07-20T11:30:00Z'), eventTag: 'Wedding', aiHint: 'wedding ceremony' },
  { _id: '3', url: 'https://placehold.co/600x900.png', uploader: 'Jane Smith', uploaderAvatar: 'https://placehold.co/100x100.png', likes: 8, likedBy: [], uploadedAt: new Date('2024-07-19T18:00:00Z'), eventTag: 'Mehendi', aiHint: 'henna hands' },
  { _id: '4', url: 'https://placehold.co/700x500.png', uploader: 'John Doe', likes: 42, likedBy: [], uploadedAt: new Date('2024-07-20T14:00:00Z'), eventTag: 'Reception', aiHint: 'wedding party' },
  { _id: '5', url: 'https://placehold.co/600x600.png', uploader: 'Aunt Carol', uploaderAvatar: 'https://placehold.co/100x100.png', likes: 3, likedBy: [], uploadedAt: new Date('2024-07-19T10:00:00Z'), eventTag: 'Haldi', aiHint: 'turmeric ceremony' },
  { _id: '6', url: 'https://placehold.co/800x800.png', uploader: 'Best Man Bob', uploaderAvatar: 'https://placehold.co/100x100.png', likes: 18, likedBy: [], uploadedAt: new Date('2024-07-20T15:15:00Z'), eventTag: 'Reception', aiHint: 'wedding dance' },
  { _id: '7', url: 'https://placehold.co/1000x600.png', uploader: 'Jane Smith', uploaderAvatar: 'https://placehold.co/100x100.png', likes: 9, likedBy: [], uploadedAt: new Date('2024-07-20T12:00:00Z'), eventTag: 'Wedding', aiHint: 'bride groom' },
  { _id: '8', url: 'https://placehold.co/600x1000.png', uploader: 'Cousin Mike', likes: 33, likedBy: [], uploadedAt: new Date('2024-07-20T16:00:00Z'), eventTag: 'Reception', aiHint: 'wedding cake' },
];

export type ScheduleEvent = {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  icon: React.ElementType;
};

// You can use any icon from lucide-react
import { Sun, Moon, Sparkles, GlassWater } from 'lucide-react';

export const schedule: ScheduleEvent[] = [
    {
      id: '1',
      title: 'Haldi Ceremony',
      time: 'Friday, 10:00 AM - 12:00 PM',
      location: 'The Courtyard',
      description: 'A vibrant and playful ceremony where turmeric paste is applied to the couple.',
      icon: Sun,
    },
    {
      id: '2',
      title: 'Mehendi Night',
      time: 'Friday, 6:00 PM - 9:00 PM',
      location: 'Garden Pavilion',
      description: 'An evening of intricate henna designs, music, and dance.',
      icon: Moon,
    },
    {
      id: '3',
      title: 'Wedding Ceremony',
      time: 'Saturday, 4:00 PM - 5:30 PM',
      location: 'Main Ballroom',
      description: 'The moment we say "I do". Please be seated by 3:45 PM.',
      icon: Sparkles,
    },
    {
      id: '4',
      title: 'Cocktail Hour & Reception',
      time: 'Saturday, 6:00 PM onwards',
      location: 'Grand Hall',
      description: 'Join us for drinks, dinner, and dancing to celebrate the night away!',
      icon: GlassWater,
    },
  ];
