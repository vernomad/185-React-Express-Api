import express from 'express';
const userRouter = express.Router();
import { getUser, getUsers } from '../controllers/userController';
import { updateUser, deleteUser } from '../controllers/updateUserController';
import { validateIdParam } from "../controllers/validateIds";

userRouter.get('/:id', validateIdParam, getUser);
userRouter.get('/', getUsers);
userRouter.patch('/:id', validateIdParam, updateUser);
userRouter.delete('/:id', validateIdParam, deleteUser);

export default userRouter;