import express from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { UserLoginSchema, baseValidation } from '../../models/user/UserLog';

import rateLimit from 'express-rate-limit';

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 6,
//   message: "Too many login attempts",
// });
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // limit each IP to 6 login requests per windowMs
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: "Too many login attempts. Try again later.",
    });
  },
});

const authRouter = express.Router();

import { registerUser, loginUser, logoutUser, verifyUser, deleteUser, logoutHacker } from '../controllers/authController';


authRouter.post('/register', validateData(baseValidation), registerUser);
authRouter.post('/login', validateData(UserLoginSchema), loginLimiter, loginUser);
authRouter.get("/verify", verifyUser)
authRouter.delete('/logout', logoutUser);
authRouter.delete('/logoutHacker', logoutHacker);
authRouter.delete('/delete', deleteUser);


export default authRouter;