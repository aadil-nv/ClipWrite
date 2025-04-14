import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags?: string[];
  preference: string[];
  image?: string;
  isPublished: boolean;
  likeCount: number;
  dislikeCount: number;
  likedBy: mongoose.Types.ObjectId[];
  dislikedBy: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    preference: [{
      type: String,
      enum: [
        'travel', 'food', 'lifestyle', 'fitness', 'technology',
        'gaming', 'fashion', 'education', 'music', 'daily routine',
      ],
    }],
    image: { type: String },
    isPublished: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema);
