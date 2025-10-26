import { Request, Response } from 'express';
import { UserLogs } from '../../models/user/UserLogs';
import { UpdateSchema} from '../../models/user/UserLog';
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";


const saltRounds = 10;


export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

 console.log("ObjectId:", new ObjectId(id));

  try {
    const usersCollection = await UserLogs; // Connect to collection
      // ✅ remove _id to avoid overwriting it
    delete updateData._id;
    //  console.log("Update-api", updateData)
        if (updateData.password === "") {
          delete updateData.password;
        }
        if (updateData.passExt === "") {
          delete updateData.passExt;
        }
    // Validate incoming data (partial since not all fields are required for update)
    const parsedData = UpdateSchema.partial().safeParse(updateData);
    if (!parsedData.success) {
      return res.status(400).json({ errors: parsedData.error.errors });
    }

    const validatedData = { ...parsedData.data };

    // ✅ Password update guard
      if ((validatedData.password && !validatedData.passExt) ||
          (!validatedData.password && validatedData.passExt)) {
        return res.status(400).json({
          message: "Both password and passExt must be provided together to update.",
        });
      }
 
    //console.log("validatedData:", validatedData)
    const newPassExt = `${validatedData.password}${validatedData.passExt}` ;

    // Hash password if updating it
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(
        validatedData.password,
        saltRounds
      );
    }
    if (validatedData.passExt) {
      validatedData.passExt = await bcrypt.hash(
        newPassExt,
        saltRounds
      )
    }
    // Mongo update
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: validatedData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: result.username,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
};
  
  export const deleteUser = async (req: Request, res: Response) => {
   const id = req.params.id
   try {
    if (!id) {
        return res.status(400).json({ message: "Invalid request: missing _id" });
      }

    const usersCollection = await UserLogs; 
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: `No user found with mongodb _id: ${id}` });
    }

    return res
      .status(200)
      .json({ message: `User with _id: ${id} successfully deleted.` });

   } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ message: "Server error: unable to delete user." });
   }

};