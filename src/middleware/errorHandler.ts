import { NextFunction, Request, Response } from "express";
import logEvents from "./logEvents";

// Error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const errorName = err.name || "UnknownError";
    const errorMessage = err.message || "No error message provided";
    const statusCode = err.status || 500;  // Use custom error status code if available, otherwise default to 500

    // Log detailed error information
    logEvents.logEvents(
        `${errorName}: ${errorMessage} - ${req.method} ${req.originalUrl}`, 
        'errLog.txt'
    );

    // Log the stack trace if available
    if (err.stack) {
        console.error(err.stack);
    } else {
        console.error(`${errorName}: ${errorMessage}`);
    }

    // Send the error response with the correct status code
    res.status(statusCode).json({
        error: {
            name: errorName,
            message: errorMessage,
        },
    });
};

export default errorHandler;
