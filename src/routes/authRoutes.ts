import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { UserLoginSchema, UserLogEntry } from '../models/user/UserLog';

const authRouter = express.Router();

import { registerUser, loginUser, logoutUser, verifyUser } from '../controllers/authController';


authRouter.post('/register', validateData(UserLogEntry), registerUser);
authRouter.post('/login', validateData(UserLoginSchema), loginUser);
authRouter.get("/verify", verifyUser)
authRouter.delete('/logout', logoutUser);


export default authRouter;