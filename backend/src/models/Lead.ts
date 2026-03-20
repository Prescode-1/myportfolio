import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: Date;
}

const LeadSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  service: String,
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILead>('Lead', LeadSchema);
