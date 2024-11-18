"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = __importDefault(require("./allowedOrigins"));
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins_1.default.indexOf(origin) !== -1) {
            callback(null, true); // Allow requests with undefined origins or matching allowed origins
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true, // Ensure credentials are allowed
    optionsSuccessStatus: 200
};
exports.default = corsOptions;
