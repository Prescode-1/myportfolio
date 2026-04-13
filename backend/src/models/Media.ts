import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  data: Buffer;
  contentType: string;
  createdAt: Date;
}

const MediaSchema = new Schema({
  filename: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMedia>('Media', MediaSchema);
