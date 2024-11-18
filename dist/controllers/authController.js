"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verifyUser = exports.loginUser = exports.registerUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const UserLogs_1 = require("../models/user/UserLogs");
const slugify_1 = __importDefault(require("../utils/slugify"));
const bcryptjs = __importStar(require("bcryptjs"));
const saltRounds = 10;
const errors_1 = require("./errors");
const errors_2 = require("./errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jose_1 = require("jose");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, image, password } = req.body;
    const user = {
        username,
        email,
        image: '/user.svg',
        roles: "Admin", // Must be "Admin" or "Editor"
        password,
        slug: "",
        joinDate: Date.now(),
    };
    try {
        const usersCollection = yield UserLogs_1.UserLogs;
        const usernameExists = yield usersCollection.findOne({ username: user.username });
        if (usernameExists) {
            res.status(409).json({ message: "Username already exists, try adding a unique suffix." });
            return; // Avoid further execution
        }
        const emailExists = yield usersCollection.findOne({ email: user.email });
        if (emailExists) {
            res.status(409).json({ message: "This email is already associated with an account." });
            return; // Avoid further execution
        }
        const hashedPassword = yield bcryptjs.hash(password, saltRounds);
        user.password = hashedPassword;
        user.slug = (0, slugify_1.default)(username);
        const insertResult = yield usersCollection.insertOne(user);
        res.status(201).json({ message: "New user registered successfully", data: insertResult });
    }
    catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Error registering user" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log("User", username, "is trying to login!");
    if (!username || !password || !username.trim() || !password.trim()) {
        // handleError(new ErrorWithStatusCode("Invalid username or password", 400), res);
        res.json({ message: "Invalid username or password" });
        return;
    }
    const usersCollection = yield UserLogs_1.UserLogs;
    const foundUser = yield usersCollection.findOne({ username: username });
    if (!foundUser) {
        (0, errors_1.handleError)(new errors_2.ErrorWithStatusCode("User not found", 401), res);
        return;
    }
    const passwordMatch = yield bcryptjs.compare(password, foundUser.password);
    if (!passwordMatch) {
        (0, errors_1.handleError)(new errors_2.ErrorWithStatusCode("Incorrect match username and password", 401), res);
        return;
    }
    //const roles = foundUser.roles ? Object.values(foundUser.roles) : [];
    // const secret = process.env.JWT_SECRET;
    // if (!secret) {
    //   throw new Error("JWT_SECRET is not defined in environment variables.");
    // }
    const accessToken = jsonwebtoken_1.default.sign({
        "UserInfo": {
            "id": foundUser._id,
            "username": foundUser.username,
            "image": foundUser.image,
            "roles": foundUser.roles
        }
    }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    // const refreshToken = jwt.sign(
    //   { "username": foundUser.username },
    //   secret,
    //   { expiresIn: '1d' }
    // );
    // Set the token in a secure, HTTP-only cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none', //strict for production
        secure: true, //process.env.NODE_ENV === 'production', //true for production
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        //maxAge: 30 * 1000// 30s in milliseconds
    });
    res.json({ message: 'User logged in successfully' });
});
exports.loginUser = loginUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken; // Get the token from HTTP-only cookie
    if (!token) {
        res.status(401).json({ isAuthenticated: false });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Handle missing secret in a way that informs of configuration issues
        console.error("JWT_SECRET is not defined in environment variables.");
        res.status(500).json({ error: "Server configuration error" });
        return;
    }
    try {
        // Verify the token using jose's jwtVerify method
        const { payload } = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(secret));
        // If verification is successful, send the decoded user data
        console.log("Decoded JWT:", payload);
        res.json({ isAuthenticated: true, user: payload.UserInfo, userToken: token });
        return;
    }
    catch (err) {
        // If verification fails, send a 403 response
        console.error("JWT verification failed:", err);
        res.status(403).json({ isAuthenticated: false });
        return;
    }
});
exports.verifyUser = verifyUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.json({ message: "Logged out!" });
});
exports.logoutUser = logoutUser;
