import { Request, Response } from 'express';
import { UserLogs, UserLogEntry } from '../models/user/UserLogs';
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";


const saltRounds = 10;


export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const usersCollection = await UserLogs; // Connect to your collection

    // Validate incoming data against your schema
    const parsedData = UserLogEntry.partial().safeParse(updateData);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return
    }

    const validatedData = parsedData.data;

    // Rehash the password if it's present in the update
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, saltRounds);
    }

    // Dynamically update only the provided fields
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, // Match the user by ID
      { $set: parsedData.data }, // Update only provided fields
      { returnDocument: "after" } // Return the updated document
    );

    if (!result) {
     res.status(404).json({ message: "User not found" });
     return
    }

    res.status(200).json({ message: "User updated successfully", user: result });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
};
  
  export const deleteUser = async (req: Request, res: Response) => {
   const id = req.params.id
   try {
    const usersCollection = await UserLogs; 
    const deletedUser = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (!deleteUser) {
      res.json({message: "No user to delete.", deletedUser})
      return
    }

    res.json({message: "Deleted user successfully", deletedUser})

   } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).send("Error retrieving user for deletion")
   }

  };