import { Schema, model, type InferSchemaType } from 'mongoose';

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned unless explicitly requested with .select('+passwordHash')
    },
  },
  { timestamps: true }
);

export type AdminDocument = InferSchemaType<typeof adminSchema>;

export const Admin = model('Admin', adminSchema);
