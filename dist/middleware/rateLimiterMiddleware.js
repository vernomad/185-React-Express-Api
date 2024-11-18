"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_rate_limiter_1 = __importDefault(require("lambda-rate-limiter"));
const limiter = (0, lambda_rate_limiter_1.default)({
    interval: 60000,
    uniqueTokenPerInterval: 3,
});
const rateLimiter = (req, res, next) => {
    var _a;
    limiter.check(3, (_a = req.ip) !== null && _a !== void 0 ? _a : 'unknown')
        .then(() => {
        next();
    })
        .catch(() => {
        res.status(429).send('To Many Requests');
    });
};
exports.default = rateLimiter;
