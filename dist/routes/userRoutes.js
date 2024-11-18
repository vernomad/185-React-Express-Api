"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const updateUserController_1 = require("../controllers/updateUserController");
userRouter.get('/:id', userController_1.getUser);
userRouter.get('/', userController_1.getUsers);
userRouter.patch('/:id', updateUserController_1.updateUser);
userRouter.delete('/:id', updateUserController_1.deleteUser);
exports.default = userRouter;
