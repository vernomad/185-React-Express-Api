"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.sendStatus(401);
        return;
    }
    // Explicitly cast jwt.verify to ensure TypeScript uses the overload with a callback
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        const decodedPayload = decoded;
        console.log("decodedPayload jwtVerify:", decodedPayload);
        req.user = decodedPayload.UserInfo.username;
        req.roles = decodedPayload.UserInfo.roles;
        next();
    });
};
exports.default = verifyJWT;
