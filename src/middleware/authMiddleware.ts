import dotenv from 'dotenv';
dotenv.config();
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { UserRoleType } from '../models/user/UserLog';



export interface CustomRequest extends Request {
    user?: string;
    roles?: UserRoleType;
  }


const requireAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.sendStatus(403); // Forbidden if no valid auth header
    return;
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.log("JWT verification failed:", err);
        res.sendStatus(403); // Invalid token
        return;
      }

      if (!decoded) {
        res.sendStatus(403); // Invalid token structure
        return;
      }

      const decodedPayload = decoded as JwtPayload & {
        UserInfo: { username: string; roles: UserRoleType };
      };

      req.user = decodedPayload.UserInfo.username;
      req.roles = decodedPayload.UserInfo.roles;
      next();
    });
  } 
};



// async function setUser(req: CustomRequest, res: Response, next: NextFunction) {
//     const user = res.locals.user;
//     if (!user || user === null) {
//       console.log("SetUser says No user signed in!");
//       // next();
//     }
//     const userId = res.locals.user.id;
  
//     console.log(userId, "SetUser userId");
//     if (userId) {
//       req.user = User.findById((user) => user.id === user);
//     }
//     next();
//   }

export default requireAuth;