import { Request, Response } from 'express';
import { UserLogs } from '../models/user/UserLogs';
import { UserLogEntryWithId } from '../models/user/UserLog';
import { ObjectId } from "mongodb";



export const getUser = async (req: Request, res: Response) => {
  const ID = req.params.id
try {
  const usersCollection = await UserLogs; 
  const user = await usersCollection.findOne({_id: new ObjectId(ID)})

  if (user) {
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
} catch (err) {
  console.error("Error retrieving user:", err);
  res.status(500).send("Error retrieving user");
}
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersCollection = await UserLogs; // Resolve the collection

     // Convert aggregate cursor to an array
     const users = await usersCollection.aggregate<UserLogEntryWithId>([]).toArray();

     // Remove the password field from each user
     const safeUsers = users.map(({  ...safeUser }) => safeUser);
 
     res.json({ users: safeUsers });
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Error retrieving users");
  }
};


