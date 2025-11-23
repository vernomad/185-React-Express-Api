import { MongoClient, Db } from 'mongodb';
import serverConfig from './serverConfig'
let db: Db | null = null; // Cache the database instance

export const connectDB = async (): Promise<Db | null> => {
  try {
    if (db) {
      // Return the cached database instance if already connected
      return db;
    }

    const client = new MongoClient(serverConfig.DB_URL);
    await client.connect();
    db = client.db(serverConfig.DB_NAME);

    return db;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    console.warn('⚠️ Continuing without database connection...');
    return null; // don't exit; return null
  }
};
