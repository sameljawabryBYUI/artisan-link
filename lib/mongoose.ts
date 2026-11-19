import 'server-only';

import mongoose, { type Mongoose } from 'mongoose';

type MongooseCache = {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached =
  globalThis.mongooseCache ?? (globalThis.mongooseCache = { connection: null, promise: null });

export default async function connectToDatabase(): Promise<Mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment.');
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.connection;
}
