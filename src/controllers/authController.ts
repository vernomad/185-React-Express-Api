import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import { UserLogs } from '../models/user/UserLogs';
import slugify from '../utils/slugify';
import * as bcryptjs from "bcryptjs";
const saltRounds = 10;

// import { handleError } from './errors';
// import { ErrorWithStatusCode } from './errors';
import jwt from 'jsonwebtoken';
import { UserRoleType } from '../models/user/UserLog';
import { jwtVerify, JWTVerifyResult } from 'jose';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, image, password } = req.body;

  const user: {
    username: string;
    email: string;
    image: string;
    roles: UserRoleType; // Explicitly using UserRole type
    password: string;
    slug: string;
    joinDate: number;
  } = {
    username,
    email,
    image: '/user.svg',
    roles: "Admin", // Must be "Admin" or "Editor"
    password,
    slug: "",
    joinDate: Date.now(),
  };

  try {
    const usersCollection = await UserLogs;

    const usernameExists = await usersCollection.findOne({ username: user.username });
    if (usernameExists) {
      res.status(409).json({ message: "Username already exists, try adding a unique suffix." });
      return; // Avoid further execution
    }

    const emailExists = await usersCollection.findOne({ email: user.email });
    if (emailExists) {
      res.status(409).json({ message: "This email is already associated with an account." });
      return; // Avoid further execution
    }

    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    user.password = hashedPassword;

    user.slug = slugify(username);

    const insertResult = await usersCollection.insertOne(user);
    res.status(201).json({ message: "New user registered successfully", data: insertResult });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("User", username, "is trying to login!")
  if (!username || !password || !username.trim() || !password.trim()) {
   // handleError(new ErrorWithStatusCode("Invalid username or password", 400), res);
    res.json({message: "Invalid username or password"})
    return
  }

  const usersCollection = await UserLogs;

  const foundUser = await usersCollection.findOne({ username: username });

  if (!foundUser) {
   // throw new ErrorWithStatusCode("User not found", 401);
   res.status(401).json({message: "User does not exist"});
    return; 
  }

  const passwordMatch = await bcryptjs.compare(password, foundUser.password);
  if (!passwordMatch) {
   // throw new ErrorWithStatusCode("Incorrect match username and password", 401);
    res.status(401).json({message: "Incorrect match username and password"});
    return; 
  }
    //const roles = foundUser.roles ? Object.values(foundUser.roles) : [];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      //throw new ErrorWithStatusCode("JWT_SECRET is not defined", 500);
      res.status(500).json({message: "JWT_SECRET is not defined"});
      return;
    }

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "id": foundUser._id,
          "username": foundUser.username,
          "image": foundUser.image,
          "roles": foundUser.roles
        }
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '1d' }
    );
    // const refreshToken = jwt.sign(
    //   { "username": foundUser.username },
    //   secret,
    //   { expiresIn: '1d' }
    // );
    // Set the token in a secure, HTTP-only cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none', //strict for production
        secure: true,//process.env.NODE_ENV === 'production', //true for production
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        //maxAge: 30 * 1000// 30s in milliseconds
      });
     res.status(200).json({ message: 'User logged in successfully' });     
};


export const verifyUser = async (req: Request, res: Response ) => {
  const token = req.cookies.accessToken; // Get the token from HTTP-only cookie

  if (!token) {
   res.status(401).json({ isAuthenticated: false });
   return
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Handle missing secret in a way that informs of configuration issues
    console.error("JWT_SECRET is not defined in environment variables.");
     res.status(500).json({ error: "Server configuration error" });
     return
  }

  try {
    // Verify the token using jose's jwtVerify method
    const { payload }: JWTVerifyResult = await jwtVerify(token, new TextEncoder().encode(secret));

    // If verification is successful, send the decoded user data
    console.log("Decoded JWT:", payload);
     res.json({ isAuthenticated: true, user: payload.UserInfo, userToken: token })
     return
   
  } catch (err) {
    // If verification fails, send a 403 response
    console.error("JWT verification failed:", err);
   res.status(403).json({ isAuthenticated: false });
  
  }
};

// export const logoutUser = async (req: Request, res: Response) => {
//   res.cookie("accessToken", "", { maxAge: 1 });
//   res.json({message: "Logged out!"})
// }



export const logoutUser = async (req: Request, res: Response) => {
  // Clear the cookie by setting the same attributes
  res.cookie("accessToken", "", {
    httpOnly: true,
    sameSite: "strict", // Match the original cookie's attribute
    secure: process.env.NODE_ENV === "production", // Match the original cookie's attribute
    maxAge: 0, // Set to 0 to immediately expire the cookie
    path: "/", // Match the original cookie's path
  });

  res.status(200).json({ message: "Logged out!" });
};
