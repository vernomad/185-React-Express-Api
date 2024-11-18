"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithStatusCode = void 0;
exports.handleError = handleError;
class ErrorWithStatusCode extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, ErrorWithStatusCode.prototype); // For extending built-in classes
    }
}
exports.ErrorWithStatusCode = ErrorWithStatusCode;
function handleError(e, res) {
    if (e instanceof ErrorWithStatusCode) {
        res.status(e.status).json({ message: e.message });
        return;
    }
    res.status(500).json({ message: "Server error" });
}
