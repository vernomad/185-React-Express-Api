import { connectDB } from "../../src/config/db";

import { WithId } from "mongodb";

import { UserLogEntry } from "./UserLog";

export { UserLogEntry };

export type UserLogWithObjectId = WithId<UserLogEntry>;

// const initializeUserLogs = async () => {
//     const db = await connectDB(); // Connects to DB
//      if (!db) {
//   console.error("No database connection");
//   return null
//      }
//   return db.collection<UserLogEntry>("users");
// };
export const getUserLogs = async () => {
  const db = await connectDB();
  if (!db) throw new Error("DB not connected");

  return db.collection("users");
};

 // export const UserLogs = initializeUserLogs(); 