import { Request, Response } from 'express';
import { UserLogs } from '../models/user/UserLogs';
import { ObjectId } from "mongodb";


export const updateUser = (req: Request, res: Response) => {
    // Handle user login logic using validated data from req.body
    res.json({ message: 'Update user', data: req.body });
  };
  
  export const deleteUser = async (req: Request, res: Response) => {
   const id = req.params.id
   try {
    const usersCollection = await UserLogs; 
    const deletedUser = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (!deleteUser) {
      res.json({message: "No user to delete.", deletedUser})
    }

    res.json({message: "Deleted user successfully", deletedUser})

   } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).send("Error retrieving user for deletion")
   }

  };