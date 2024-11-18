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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogs = exports.UserLogEntry = void 0;
const db_1 = require("../../config/db");
const UserLog_1 = require("./UserLog");
Object.defineProperty(exports, "UserLogEntry", { enumerable: true, get: function () { return UserLog_1.UserLogEntry; } });
const initializeUserLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.connectDB)(); // Connects to DB
    return db.collection("users");
});
exports.UserLogs = initializeUserLogs();
