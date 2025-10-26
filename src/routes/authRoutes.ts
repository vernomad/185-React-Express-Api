import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { UserLoginSchema, baseValidation } from '../../models/user/UserLog';

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 4,
  message: "Too many login attempts",
});

const authRouter = express.Router();

import { registerUser, loginUser, logoutUser, verifyUser, deleteUser } from '../controllers/authController';


authRouter.post('/register', validateData(baseValidation), registerUser);
authRouter.post('/login', validateData(UserLoginSchema), loginLimiter, loginUser);
authRouter.get("/verify", verifyUser)
authRouter.delete('/logout', logoutUser);
authRouter.delete('/delete', deleteUser);


export default authRouter;