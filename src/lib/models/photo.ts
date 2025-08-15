
import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  url: string;
  uploader: string;
  uploaderAvatar?: string;
  likes: number;
  likedBy: string[];
  uploadedAt: Date;
  eventTag?: 'Haldi' | 'Mehendi' | 'Wedding' | 'Reception';
  aiHint?: string;
}

const PhotoSchema: Schema = new Schema({
  url: { type: String, required: true },
  uploader: { type: String, required: true },
  uploaderAvatar: { type: String },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  uploadedAt: { type: Date, default: Date.now },
  eventTag: { type: String, enum: ['Haldi', 'Mehendi', 'Wedding', 'Reception'] },
  aiHint: { type: String },
});

export default mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
