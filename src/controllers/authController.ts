import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { UserLogs } from "../../models/user/UserLogs";
import { UserRole } from "../../models/user/UserLog";
import { ObjectId } from "mongodb";

import {slugify} from "../utils/slugify";
import * as bcryptjs from "bcryptjs";
const saltRounds = 10;

import jwt from "jsonwebtoken";
import { jwtVerify, JWTVerifyResult } from "jose";
// import rateLimit from "lambda-rate-limiter";

// const rateLimit = require("lambda-rate-limiter")
// const limiter = rateLimit({
//   interval: 15 * 60 * 1000, // 15 minutes
//   uniqueTokenPerInterval: 4,
// }).check;

// async function getLimiter() {
//   const rateLimit = (await import('lambda-rate-limiter')).default;
//   return rateLimit({
//     interval: 15 * 60 * 1000,
//     uniqueTokenPerInterval: 4,
//   }).check;
// }

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, image, password, passExt, roles } = req.body;
  console.log("body:", req.body);
  const validRoles = Array.isArray(roles)
    ? roles.filter((role) => UserRole.options.includes(role))
    : ["admin"];

  const user: {
    username: string;
    email: string;
    image: string;
    roles: ("admin" | "editor" | "user")[]; // Explicitly using UserRole type
    password: string;
    passExt: string;
    slug: string;
    joinDate: number;
  } = {
    username,
    email,
    image: "/assets/img/user.svg",
    roles: validRoles, // Must be "Admin" or "Editor"
    password,
    passExt,
    slug: "",
    joinDate: Date.now(),
  };

  try {
    const usersCollection = await UserLogs;
     if (!usersCollection) {
  console.warn("⚠️ Database unavailable, skipping user lookup");
  return res.status(503).json({ error: "Database unavailable" });
}

    const usernameExists = await usersCollection.findOne({
      username: user.username,
    });
    if (usernameExists) {
      res
        .status(409)
        .json({
          message: "Username already exists, try adding a unique suffix.",
        });
      return; // Avoid further execution
    }

    const emailExists = await usersCollection.findOne({ email: user.email });
    if (emailExists) {
      res
        .status(409)
        .json({ message: "This email is already associated with an account." });
      return; // Avoid further execution
    }
    const combinedPassword = `${password}${passExt}`;

    const singleHashedPass = await bcryptjs.hash(combinedPassword, saltRounds);
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    user.password = hashedPassword;
    user.passExt = singleHashedPass;

    user.slug = slugify(username);

    const insertResult = await usersCollection.insertOne(user);
    res
      .status(201)
      .json({
        message: "New user registered successfully",
        data: insertResult,
      });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  let passExt = password;
  // console.log("Req.body:", req.body);
 const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
 const displayIp = ip === '::1' ? '127.0.0.1' : ip;

  // const IP = req.get("x-real-ip") || req.socket.remoteAddress;
 
// if (IP) {
//     try {
//       // Apply rate limiter per IP
//       await limiter(4, IP); // max 5 attempts per 15 mins per IP
//     } catch {
//       return res
//         .status(429)
//         .json({ message: "Too many login attempts. Try again later." });
//     }
//   }
  if (!username || !password || !username.trim() || !password.trim()) {
    // handleError(new ErrorWithStatusCode("Invalid username or password", 400), res);
    res.json({ message: "Invalid username or password" });
    return;
  }

  const usersCollection = await UserLogs;

 if (!usersCollection) {
  console.warn("⚠️ Database unavailable, skipping user lookup");
  return res.status(503).json({ error: "Database unavailable" });
}

const foundUser = await usersCollection.findOne({ username });

  if (!foundUser) {
    // throw new ErrorWithStatusCode("User not found", 401);
    res.status(401).json({ message: "User does not exist" });
    return;
  }

  const passwordMatch = await bcryptjs.compare(password, foundUser.password);
  if (passwordMatch === true) {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const token = jwt.sign({ uid: "unauthorized", suspicious: true }, secret, {
      expiresIn: "15m",
    });
    // set as httpOnly cookie
      res.cookie("accessHackToken", token, {
     httpOnly: true,
     secure: false, // false for local
     sameSite: "lax", // or "strict"
     maxAge: 24 * 60 * 60 * 1000,
   });
    const user = {
      id: "hack",
      username: "hacker",
      image: "",
      roles: ["zero"],
      ip: displayIp,
    };

    res.status(200).json({ message: "User logged in successfully", user});
    return;
  }

  const user = {
    id: foundUser._id,
    username: foundUser.username,
    image: foundUser.image,
    roles: foundUser.roles,
  };

  const passExtMatch = await bcryptjs.compare(passExt, foundUser.passExt);

  if (!passExtMatch) {
    // throw new ErrorWithStatusCode("Incorrect match username and password", 401);
    res.status(401).json({ message: "Incorrect match username and password" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    //throw new ErrorWithStatusCode("JWT_SECRET is not defined", 500);
    res.status(500).json({ message: "JWT_SECRET is not defined" });
    return;
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        username: foundUser.username,
        image: foundUser.image,
        roles: foundUser.roles,
      },
    },
    process.env.JWT_SECRET || "",
    { expiresIn: "1d" }
  );
  // const refreshToken = jwt.sign(
  //   { "username": foundUser.username },
  //   secret,
  //   { expiresIn: '1d' }
  // );
  // Set the token in a secure, HTTP-only cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none", //strict for production
    secure: true, //process.env.NODE_ENV === 'production', //true for production
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    //maxAge: 30 * 1000// 30s in milliseconds
  });
  res.status(200).json({ message: "User logged in successfully", user });
};

export const verifyUser = async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  const hackToken = req.cookies.accessHackToken

  if (hackToken) {
     return res.status(404).json({
        isAuthenticated: false,
        reason: "hacker go away",
      });
  }

  if (!token) {
    return res.status(401).json({
      isAuthenticated: false,
      reason: "no_token, try loggin out and in again",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET missing.");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const { payload }: JWTVerifyResult = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    // Optional: manual expiry check
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return res.status(403).json({
        isAuthenticated: false,
        reason: "expired",
      });
    }

    return res.json({
      isAuthenticated: true,
      user: payload.UserInfo,
      userToken: token,
    });
  } catch (err: any) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({
      isAuthenticated: false,
      reason: "invalid_token, try loggin out and in again",
    });
  }
};

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
export const logoutHacker = async (req: Request, res: Response) => {

  res.cookie("accessHackToken", "", {
    httpOnly: true,
    sameSite: "strict", // Match the original cookie's attribute
    secure: process.env.NODE_ENV === "production", // Match the original cookie's attribute
    maxAge: 0, // Set to 0 to immediately expire the cookie
    path: "/", // Match the original cookie's path
  });

  res.status(200).json({ message: "Logged out!" });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "Invalid request: missing _id" });
  }

  try {
    const usersCollection = await UserLogs;
     if (!usersCollection) {
  console.warn("⚠️ Database unavailable, skipping user lookup");
  return res.status(503).json({ error: "Database unavailable" });
}
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(String(_id)),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: `No user found with _id: ${_id}` });
    }

    return res
      .status(200)
      .json({ message: `User with _id: ${_id} successfully deleted.` });
  } catch (err) {
    console.error("Delete error:", err);
    return res
      .status(500)
      .json({ message: "Server error: unable to delete user." });
  }
};
