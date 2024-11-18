"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const UserLog_1 = require("../models/user/UserLog");
const authRouter = express_1.default.Router();
const authController_1 = require("../controllers/authController");
authRouter.post('/register', (0, validationMiddleware_1.validateData)(UserLog_1.UserLogEntry), authController_1.registerUser);
authRouter.post('/login', (0, validationMiddleware_1.validateData)(UserLog_1.UserLoginSchema), authController_1.loginUser);
authRouter.get("/verify", authController_1.verifyUser);
authRouter.delete('/logout', authController_1.logoutUser);
exports.default = authRouter;
