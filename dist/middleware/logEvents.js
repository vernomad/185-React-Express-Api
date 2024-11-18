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
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logEvents = (message, logName) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message || !logName) {
        console.warn("Undefined message or logName in logEvents call:", { message, logName });
    }
    const dateTime = `${(0, date_fns_1.format)(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    const logPath = path_1.default.join(__dirname, '..', 'logs');
    try {
        yield promises_1.default.access(logPath).catch(() => promises_1.default.mkdir(logPath));
        yield promises_1.default.appendFile(path_1.default.join(logPath, logName), logItem);
    }
    catch (err) {
        console.log(err);
    }
});
const logger = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const origin = req.headers.origin || 'No origin';
    yield logEvents(`${req.method}\t${origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
});
exports.default = { logger, logEvents };
