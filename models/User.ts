import { model, models, Schema } from 'mongoose';

export interface User {
  githubId: string;
  name: string;
  role: 'buyer' | 'artisan';
  avatarUrl: string;
}

const UserSchema = new Schema<User>({
  githubId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['buyer', 'artisan'],
  },
  avatarUrl: {
    type: String,
    required: true,
    trim: true,
  },
});

export const UserModel = models.User ?? model<User>('User', UserSchema);
