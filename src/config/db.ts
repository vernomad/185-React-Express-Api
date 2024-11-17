import { MongoClient, Db } from 'mongodb';
import serverConfig from './serverConfig';

let db: Db | null = null; // Cache the database instance

export const connectDB = async (): Promise<Db> => {
  try {
    if (db) {
      // Return the cached database instance if already connected
      return db;
    }

    const client = new MongoClient(serverConfig.DB_URL);
    await client.connect();
    db = client.db(serverConfig.DB_NAME);

    console.log('MongoDB connected successfully');
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
