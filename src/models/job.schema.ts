import { Schema, model, Document } from 'mongoose';

interface IJob extends Document {
  type: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
}

const jobSchema = new Schema<IJob>(
  {
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    error: { type: String },
  },
  { timestamps: true }
);

export const JobModel = model<IJob>('Job', jobSchema);
