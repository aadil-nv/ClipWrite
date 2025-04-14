import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile: string;
  dob: Date;
  preferences: string[];
  image?: string
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
    },
    preferences: {
      type: [String],
      enum: [
        'travel',
        'food',
        'lifestyle',
        'fitness',
        'technology',
        'gaming',
        'fashion',
        'education',
        'music',
        'daily routine',
      ],
      default: ['technology'],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);


