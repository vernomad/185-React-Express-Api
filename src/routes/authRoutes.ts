import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { UserLoginSchema, baseValidation } from '../../models/user/UserLog';

const authRouter = express.Router();

import { registerUser, loginUser, logoutUser, verifyUser, deleteUser } from '../controllers/authController';


authRouter.post('/register', validateData(baseValidation), registerUser);
authRouter.post('/login', validateData(UserLoginSchema), loginUser);
authRouter.get("/verify", verifyUser)
authRouter.delete('/logout', logoutUser);
authRouter.delete('/delete', deleteUser);


export default authRouter;