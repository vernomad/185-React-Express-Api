import express from 'express';
const userRouter = express.Router();
import { getUser, getUsers } from '../controllers/userController';
import { updateUser, deleteUser } from '../controllers/updateUserController';

userRouter.get('/:id', getUser);
userRouter.get('/', getUsers);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;