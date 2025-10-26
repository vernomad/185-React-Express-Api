import { connectDB } from "../../src/config/db";

import { WithId } from "mongodb";

import { UserLogEntry } from "./UserLog";

export { UserLogEntry };

export type UserLogWithObjectId = WithId<UserLogEntry>;

const initializeUserLogs = async () => {
    const db = await connectDB(); // Connects to DB
    return db.collection<UserLogEntry>("users");
  };

  export const UserLogs = initializeUserLogs(); 