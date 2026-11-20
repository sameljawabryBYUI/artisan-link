import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    enum: ['buyer', 'artisan'],
    required: true,
  },
  avatarUrl: {
    type: String,
    trim: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
