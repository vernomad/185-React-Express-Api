"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.sendStatus(403); // Forbidden if no valid auth header
        return;
    }
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("JWT verification failed:", err);
                res.sendStatus(403); // Invalid token
                return;
            }
            if (!decoded) {
                res.sendStatus(403); // Invalid token structure
                return;
            }
            const decodedPayload = decoded;
            req.user = decodedPayload.UserInfo.username;
            req.roles = decodedPayload.UserInfo.roles;
            next();
        });
    }
};
// async function setUser(req: CustomRequest, res: Response, next: NextFunction) {
//     const user = res.locals.user;
//     if (!user || user === null) {
//       console.log("SetUser says No user signed in!");
//       // next();
//     }
//     const userId = res.locals.user.id;
//     console.log(userId, "SetUser userId");
//     if (userId) {
//       req.user = User.findById((user) => user.id === user);
//     }
//     next();
//   }
exports.default = requireAuth;
