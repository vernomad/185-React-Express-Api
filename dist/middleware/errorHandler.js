"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logEvents_1 = __importDefault(require("./logEvents"));
// const errorHandler = (err: Error, req: Request, res: Response ) => {
//     logEvents.logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//     console.error(err.stack)
//     res.status(500).send(err.message);
// }
const errorHandler = (err, req, res) => {
    const errorName = err.name || "UnknownError";
    const errorMessage = err.message || "No error message provided";
    logEvents_1.default.logEvents(`${errorName}: ${errorMessage}`, 'errLog.txt');
    console.error(err.stack || `${errorName}: ${errorMessage}`);
    res.status(500).send(errorMessage);
};
exports.default = errorHandler;
