"use strict";
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
exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const serverConfig_1 = __importDefault(require("./serverConfig"));
let db = null; // Cache the database instance
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (db) {
            // Return the cached database instance if already connected
            return db;
        }
        const client = new mongodb_1.MongoClient(serverConfig_1.default.DB_URL);
        yield client.connect();
        db = client.db(serverConfig_1.default.DB_NAME);
        console.log('MongoDB connected successfully');
        return db;
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
