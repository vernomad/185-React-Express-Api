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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getUser = void 0;
const UserLogs_1 = require("../models/user/UserLogs");
const mongodb_1 = require("mongodb");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.id;
    try {
        const usersCollection = yield UserLogs_1.UserLogs;
        const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(ID) });
        if (user) {
            const { password } = user, safeUser = __rest(user, ["password"]);
            res.json(safeUser);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.error("Error retrieving user:", err);
        res.status(500).send("Error retrieving user");
    }
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersCollection = yield UserLogs_1.UserLogs; // Resolve the collection
        // Convert aggregate cursor to an array
        const users = yield usersCollection.aggregate([]).toArray();
        // Remove the password field from each user
        const safeUsers = users.map((_a) => {
            var { password } = _a, safeUser = __rest(_a, ["password"]);
            return safeUser;
        });
        res.json({ users: safeUsers });
    }
    catch (err) {
        console.error("Error retrieving users:", err);
        res.status(500).send("Error retrieving users");
    }
});
exports.getUsers = getUsers;
