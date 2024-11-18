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
exports.deleteUser = exports.updateUser = void 0;
const UserLogs_1 = require("../models/user/UserLogs");
const mongodb_1 = require("mongodb");
const updateUser = (req, res) => {
    // Handle user login logic using validated data from req.body
    res.json({ message: 'Update user', data: req.body });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const usersCollection = yield UserLogs_1.UserLogs;
        const deletedUser = yield usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (!exports.deleteUser) {
            res.json({ message: "No user to delete.", deletedUser });
        }
        res.json({ message: "Deleted user successfully", deletedUser });
    }
    catch (err) {
        console.error("Error retrieving user:", err);
        res.status(500).send("Error retrieving user for deletion");
    }
});
exports.deleteUser = deleteUser;
