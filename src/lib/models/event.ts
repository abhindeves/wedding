
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  time: string;
  location: string;
  description: string;
  icon: string; // Storing icon name as string, will map to React.ElementType in frontend
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
