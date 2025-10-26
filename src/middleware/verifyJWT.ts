import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { UserRoleType } from '../../models/user/UserLog';

export interface CustomRequest extends Request {
  user?: string;
  roles?: UserRoleType;
}


const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.sendStatus(401);
    return;
  }

  // Explicitly cast jwt.verify to ensure TypeScript uses the overload with a callback
  (jwt.verify as (
    token: string,
    secretOrPublicKey: jwt.Secret,
    callback: (err: VerifyErrors | null, decoded: JwtPayload | undefined) => void
  ) => void)(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    const decodedPayload = decoded as JwtPayload & {
      UserInfo: { username: string; roles: UserRoleType };
    };
    console.log("decodedPayload jwtVerify:",decodedPayload)

    req.user = decodedPayload.UserInfo.username;
    req.roles = decodedPayload.UserInfo.roles;
    next();
  });
};



export default verifyJWT;
